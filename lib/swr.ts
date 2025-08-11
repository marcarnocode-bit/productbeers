"use client"

import { supabase } from "@/lib/supabase"
import type { Event } from "@/types/database"

// Narrow types for the smaller selects to reduce payload.
export type FeaturedEvent = Pick<Event, "id" | "title" | "description" | "start_date" | "is_virtual" | "location">

export async function getFeaturedEvents(limit = 3): Promise<FeaturedEvent[]> {
  const { data, error } = await supabase
    .from("events")
    .select("id, title, description, start_date, is_virtual, location")
    .eq("status", "published")
    .gte("start_date", new Date().toISOString())
    .order("start_date", { ascending: true })
    .limit(limit)

  if (error) throw error
  return data ?? []
}

export type PublishedEvent = Pick<
  Event,
  | "id"
  | "title"
  | "description"
  | "start_date"
  | "end_date"
  | "location"
  | "is_virtual"
  | "image_url"
  | "max_participants"
  | "status"
>

export async function getPublishedUpcomingEvents(): Promise<(PublishedEvent & { users?: { full_name: string } })[]> {
  const { data, error } = await supabase
    .from("events")
    .select(`
      id,
      title,
      description,
      start_date,
      end_date,
      location,
      is_virtual,
      image_url,
      max_participants,
      status,
      users:users!events_organizer_id_fkey(full_name)
    `)
    .eq("status", "published")
    .gte("end_date", new Date().toISOString())
    .order("start_date", { ascending: true })

  if (error) throw error
  return (data as any) ?? []
}

export type ResourceRow = {
  id: string
  title: string
  description: string | null
  url: string | null
  file_path: string | null
  resource_type: "document" | "video" | "link" | "template" | "article"
  created_at: string
  events?: {
    title: string
  }
}

export async function getResources(): Promise<ResourceRow[]> {
  const { data, error } = await supabase
    .from("resources")
    .select(`
      id,
      title,
      description,
      url,
      file_path,
      resource_type,
      created_at,
      events(title)
    `)
    .order("created_at", { ascending: false })

  if (error) throw error
  return (data as any) ?? []
}
