import { supabaseServer } from "./supabase-server"

export type EventRow = {
  id: string
  title: string
  description: string | null
  start_date: string
  end_date: string | null
  location: string | null
  is_virtual: boolean
  image_url: string | null
  max_participants: number | null
  status: string
}

export type ResourceRow = {
  id: string
  title: string
  description: string | null
  url: string | null
  file_path: string | null
  resource_type: "document" | "video" | "link" | "template" | "article"
  created_at: string
}

const EVENT_SELECT =
  "id, title, description, start_date, end_date, location, is_virtual, image_url, max_participants, status"
const RESOURCE_SELECT = "id, title, description, url, file_path, resource_type, created_at"

const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes
const queryCache = new Map<string, { data: any; timestamp: number }>()

function getCachedResult<T>(key: string): T | null {
  const cached = queryCache.get(key)
  if (!cached) return null

  if (Date.now() - cached.timestamp > CACHE_DURATION) {
    queryCache.delete(key)
    return null
  }

  return cached.data as T
}

function setCachedResult<T>(key: string, data: T): void {
  queryCache.set(key, { data, timestamp: Date.now() })
}

// Home helper: upcoming with optional fallback
export async function fetchUpcomingEvents(limit = 6, fallbackToPast = true): Promise<EventRow[]> {
  const cacheKey = `upcoming_events_${limit}_${fallbackToPast}`
  const cached = getCachedResult<EventRow[]>(cacheKey)
  if (cached) return cached

  const nowIso = new Date().toISOString()

  const { data: upcoming, error: upErr } = await supabaseServer
    .from("events")
    .select(EVENT_SELECT)
    .eq("status", "published")
    .gte("start_date", nowIso)
    .order("start_date", { ascending: true })
    .limit(limit)

  if (upErr) {
    console.error("fetchUpcomingEvents error:", upErr)
    return []
  }

  if (upcoming && upcoming.length > 0) {
    const result = upcoming as EventRow[]
    setCachedResult(cacheKey, result)
    return result
  }

  if (!fallbackToPast) return []

  const { data: past, error: pastErr } = await supabaseServer
    .from("events")
    .select(EVENT_SELECT)
    .eq("status", "published")
    .lt("start_date", nowIso)
    .order("start_date", { ascending: false })
    .limit(limit)

  if (pastErr) {
    console.error("fetchUpcomingEvents fallback error:", pastErr)
    return []
  }

  const result = (past as EventRow[]) ?? []
  setCachedResult(cacheKey, result)
  return result
}

export async function fetchLatestResources(limit = 3): Promise<ResourceRow[]> {
  const cacheKey = `latest_resources_${limit}`
  const cached = getCachedResult<ResourceRow[]>(cacheKey)
  if (cached) return cached

  const { data, error } = await supabaseServer
    .from("resources")
    .select(RESOURCE_SELECT)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("fetchLatestResources error:", error)
    return []
  }

  const result = (data as ResourceRow[]) ?? []
  setCachedResult(cacheKey, result)
  return result
}

type EventsPageParams = {
  q?: string
  type?: "virtual" | "presencial" | "all" | undefined
  page?: number
  pageSize?: number
  when?: "proximos" | "pasados" | "auto"
}

export async function fetchEventsPage({
  q,
  type = "all",
  page = 1,
  pageSize = 9,
  when = "auto",
}: EventsPageParams): Promise<{
  items: EventRow[]
  total: number
  page: number
  pageSize: number
  isFallbackPast: boolean
}> {
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1
  const term = (q ?? "").trim()
  const nowIso = new Date().toISOString()

  let query = supabaseServer.from("events").select(EVENT_SELECT, { count: "exact" }).eq("status", "published")

  if (when === "proximos") {
    query = query.gte("start_date", nowIso).order("start_date", { ascending: true })
  } else if (when === "pasados") {
    query = query.lt("start_date", nowIso).order("start_date", { ascending: false })
  } else {
    query = query.gte("start_date", nowIso).order("start_date", { ascending: true })
  }

  if (type === "virtual") query = query.eq("is_virtual", true)
  if (type === "presencial") query = query.eq("is_virtual", false)

  if (term) {
    const like = `%${term}%`
    query = query.or(`title.ilike.${like},description.ilike.${like},location.ilike.${like}`)
  }

  const { data, count, error } = await query.range(from, to)

  if (error) {
    console.error("fetchEventsPage error:", error)
    return { items: [], total: 0, page, pageSize, isFallbackPast: false }
  }

  if ((when === "auto" || when === undefined) && page === 1 && (!data || data.length === 0)) {
    let fallbackQuery = supabaseServer
      .from("events")
      .select(EVENT_SELECT, { count: "exact" })
      .eq("status", "published")
      .lt("start_date", nowIso)
      .order("start_date", { ascending: false })

    if (type === "virtual") fallbackQuery = fallbackQuery.eq("is_virtual", true)
    if (type === "presencial") fallbackQuery = fallbackQuery.eq("is_virtual", false)

    if (term) {
      const like = `%${term}%`
      fallbackQuery = fallbackQuery.or(`title.ilike.${like},description.ilike.${like},location.ilike.${like}`)
    }

    const { data: pastData, count: pastCount, error: pastErr } = await fallbackQuery.range(from, to)

    if (pastErr) {
      console.error("fetchEventsPage fallback error:", pastErr)
      return { items: [], total: 0, page, pageSize, isFallbackPast: false }
    }

    return {
      items: (pastData as EventRow[]) ?? [],
      total: pastCount ?? 0,
      page,
      pageSize,
      isFallbackPast: true,
    }
  }

  return {
    items: (data as EventRow[]) ?? [],
    total: count ?? 0,
    page,
    pageSize,
    isFallbackPast: false,
  }
}

// Resource type counters for chips: Artículos (n), Vídeos (n), etc.
const RESOURCE_TYPES = ["article", "document", "video", "link", "template"] as const
export type ResourceTypeKey = (typeof RESOURCE_TYPES)[number]

export async function fetchResourceTypeCounts(q?: string): Promise<Record<ResourceTypeKey | "all", number>> {
  const cacheKey = `resource_counts_${q || "all"}`
  const cached = getCachedResult<Record<ResourceTypeKey | "all", number>>(cacheKey)
  if (cached) return cached

  const term = (q ?? "").trim()

  let baseQuery = supabaseServer.from("resources")

  if (term) {
    const like = `%${term}%`
    baseQuery = baseQuery.or(`title.ilike.${like},description.ilike.${like}`)
  }

  const queries = [
    // Total count
    baseQuery.select("id", { count: "exact", head: true }),
    // Individual type counts
    ...RESOURCE_TYPES.map((type) => {
      let query = supabaseServer
        .from("resources")
        .select("id", { count: "exact", head: true })
        .eq("resource_type", type)
      if (term) {
        const like = `%${term}%`
        query = query.or(`title.ilike.${like},description.ilike.${like}`)
      }
      return query
    }),
  ]

  const results = await Promise.all(queries)

  const totalCount = results[0].count ?? 0
  const typeCounts = results.slice(1).map((result, index) => [RESOURCE_TYPES[index], result.count ?? 0] as const)

  const counts = {
    all: totalCount,
    ...Object.fromEntries(typeCounts),
  } as Record<ResourceTypeKey | "all", number>

  setCachedResult(cacheKey, counts)
  return counts
}

export async function fetchAllEventsPage({
  q,
  type = "all",
  page = 1,
  pageSize = 9,
}: Omit<EventsPageParams, "when">): Promise<{
  items: (EventRow & { isUpcoming: boolean })[]
  total: number
  page: number
  pageSize: number
}> {
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1
  const term = (q ?? "").trim()
  const nowIso = new Date().toISOString()

  let baseQuery = supabaseServer.from("events").select(EVENT_SELECT).eq("status", "published")

  if (type === "virtual") baseQuery = baseQuery.eq("is_virtual", true)
  if (type === "presencial") baseQuery = baseQuery.eq("is_virtual", false)

  if (term) {
    const like = `%${term}%`
    baseQuery = baseQuery.or(`title.ilike.${like},description.ilike.${like},location.ilike.${like}`)
  }

  const { data: allEvents, error } = await baseQuery.order("start_date", { ascending: true })

  if (error) {
    console.error("fetchAllEventsPage error:", error)
    return { items: [], total: 0, page, pageSize }
  }

  const events = (allEvents as EventRow[]) ?? []
  const now = new Date(nowIso)

  const processedEvents = events.map((event) => ({
    ...event,
    isUpcoming: new Date(event.start_date) >= now,
  }))

  // Sort: upcoming first (by start_date asc), then past (by start_date desc)
  processedEvents.sort((a, b) => {
    if (a.isUpcoming && !b.isUpcoming) return -1
    if (!a.isUpcoming && b.isUpcoming) return 1

    if (a.isUpcoming && b.isUpcoming) {
      return new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
    } else {
      return new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
    }
  })

  const total = processedEvents.length
  const paginatedEvents = processedEvents.slice(from, to + 1)

  return {
    items: paginatedEvents,
    total,
    page,
    pageSize,
  }
}

type ResourcesPageParams = {
  q?: string
  type?: ResourceRow["resource_type"] | "all" | undefined
  page?: number
  pageSize?: number
}

export async function fetchResourcesPage({
  q,
  type = "all",
  page = 1,
  pageSize = 9,
}: ResourcesPageParams): Promise<{ items: ResourceRow[]; total: number; page: number; pageSize: number }> {
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1
  const term = (q ?? "").trim()

  let query = supabaseServer
    .from("resources")
    .select(RESOURCE_SELECT, { count: "exact" })
    .order("created_at", { ascending: false })

  if (type && type !== "all") {
    query = query.eq("resource_type", type)
  }

  if (term) {
    const like = `%${term}%`
    query = query.or(`title.ilike.${like},description.ilike.${like}`)
  }

  const { data, count, error } = await query.range(from, to)

  if (error) {
    console.error("fetchResourcesPage error:", error)
    return { items: [], total: 0, page, pageSize }
  }

  return {
    items: (data as ResourceRow[]) ?? [],
    total: count ?? 0,
    page,
    pageSize,
  }
}

export function clearQueryCache(pattern?: string): void {
  if (!pattern) {
    queryCache.clear()
    return
  }

  for (const key of queryCache.keys()) {
    if (key.includes(pattern)) {
      queryCache.delete(key)
    }
  }
}
