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

// Home helper: upcoming with optional fallback
export async function fetchUpcomingEvents(limit = 6, fallbackToPast = true): Promise<EventRow[]> {
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

  if (upcoming && upcoming.length > 0) return upcoming as EventRow[]

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
  return (past as EventRow[]) ?? []
}

export async function fetchLatestResources(limit = 3): Promise<ResourceRow[]> {
  const { data, error } = await supabaseServer
    .from("resources")
    .select(RESOURCE_SELECT)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("fetchLatestResources error:", error)
    return []
  }
  return (data as ResourceRow[]) ?? []
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

  const base = supabaseServer.from("events").select(EVENT_SELECT, { count: "exact" }).eq("status", "published")

  if (when === "proximos") {
    base.gte("start_date", nowIso).order("start_date", { ascending: true })
  } else if (when === "pasados") {
    base.lt("start_date", nowIso).order("start_date", { ascending: false })
  } else {
    base.gte("start_date", nowIso).order("start_date", { ascending: true })
  }

  if (type === "virtual") base.eq("is_virtual", true)
  if (type === "presencial") base.eq("is_virtual", false)

  if (term) {
    const like = `%${term}%`
    base.or([`title.ilike.${like}`, `description.ilike.${like}`, `location.ilike.${like}`].join(","))
  }

  const { data, count, error } = await base.range(from, to)
  if (error) {
    console.error("fetchEventsPage error:", error)
    return { items: [], total: 0, page, pageSize, isFallbackPast: false }
  }

  if ((when === "auto" || when === undefined) && page === 1 && (!data || data.length === 0)) {
    const alt = supabaseServer
      .from("events")
      .select(EVENT_SELECT, { count: "exact" })
      .eq("status", "published")
      .lt("start_date", nowIso)
      .order("start_date", { ascending: false })

    if (type === "virtual") alt.eq("is_virtual", true)
    if (type === "presencial") alt.eq("is_virtual", false)
    if (term) {
      const like = `%${term}%`
      alt.or([`title.ilike.${like}`, `description.ilike.${like}`, `location.ilike.${like}`].join(","))
    }

    const { data: pastData, count: pastCount, error: pastErr } = await alt.range(from, to)
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
  const term = (q ?? "").trim()
  const whereSearch = (builder: ReturnType<typeof supabaseServer.from>) => {
    if (term) {
      const like = `%${term}%`
      builder.or([`title.ilike.${like}`, `description.ilike.${like}`].join(","))
    }
    return builder
  }

  const perTypePromises = RESOURCE_TYPES.map(async (t) => {
    const query = whereSearch(supabaseServer.from("resources"))
      .select("id", { count: "exact", head: true })
      .eq("resource_type", t)

    const { count, error } = await query
    if (error) {
      console.error(`fetchResourceTypeCounts error for ${t}:`, error)
      return [t, 0] as const
    }
    return [t, count ?? 0] as const
  })

  const totalPromise = whereSearch(supabaseServer.from("resources").select("id", { count: "exact", head: true }))

  const [entries, { count: totalCount }] = await Promise.all([Promise.all(perTypePromises), totalPromise])

  const counts = Object.fromEntries(entries) as Record<ResourceTypeKey, number>
  return {
    ...counts,
    all: totalCount ?? 0,
  }
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

  // First, get upcoming events
  const upcomingQuery = supabaseServer
    .from("events")
    .select(EVENT_SELECT, { count: "exact" })
    .eq("status", "published")
    .gte("start_date", nowIso)
    .order("start_date", { ascending: true })

  if (type === "virtual") upcomingQuery.eq("is_virtual", true)
  if (type === "presencial") upcomingQuery.eq("is_virtual", false)
  if (term) {
    const like = `%${term}%`
    upcomingQuery.or([`title.ilike.${like}`, `description.ilike.${like}`, `location.ilike.${like}`].join(","))
  }

  // Then, get past events
  const pastQuery = supabaseServer
    .from("events")
    .select(EVENT_SELECT, { count: "exact" })
    .eq("status", "published")
    .lt("start_date", nowIso)
    .order("start_date", { ascending: false })

  if (type === "virtual") pastQuery.eq("is_virtual", true)
  if (type === "presencial") pastQuery.eq("is_virtual", false)
  if (term) {
    const like = `%${term}%`
    pastQuery.or([`title.ilike.${like}`, `description.ilike.${like}`, `location.ilike.${like}`].join(","))
  }

  const [upcomingResult, pastResult] = await Promise.all([upcomingQuery, pastQuery])

  if (upcomingResult.error || pastResult.error) {
    console.error("fetchAllEventsPage error:", upcomingResult.error || pastResult.error)
    return { items: [], total: 0, page, pageSize }
  }

  // Combine and mark events
  const upcomingEvents = (upcomingResult.data as EventRow[])?.map((event) => ({ ...event, isUpcoming: true })) ?? []
  const pastEvents = (pastResult.data as EventRow[])?.map((event) => ({ ...event, isUpcoming: false })) ?? []

  // Combine all events (upcoming first, then past)
  const allEvents = [...upcomingEvents, ...pastEvents]
  const total = (upcomingResult.count ?? 0) + (pastResult.count ?? 0)

  // Apply pagination to combined results
  const paginatedEvents = allEvents.slice(from, to + 1)

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

  const base = supabaseServer
    .from("resources")
    .select(RESOURCE_SELECT, { count: "exact" })
    .order("created_at", { ascending: false })

  if (type && type !== "all") {
    base.eq("resource_type", type)
  }

  if (term) {
    const like = `%${term}%`
    base.or([`title.ilike.${like}`, `description.ilike.${like}`].join(","))
  }

  const { data, count, error } = await base.range(from, to)
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
