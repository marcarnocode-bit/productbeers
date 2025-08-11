"use client"

import { createClient } from "@supabase/supabase-js"

let supabaseSingleton:
  | ReturnType<typeof createClient>
  | null = null

export const supabase = (() => {
  if (supabaseSingleton) return supabaseSingleton

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    console.warn("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY")
  }

  supabaseSingleton = createClient(url!, anonKey!, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  })
  return supabaseSingleton
})()
