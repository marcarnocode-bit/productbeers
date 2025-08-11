import { createClient } from "@supabase/supabase-js"

const SUPABASE_URL = process.env.SUPABASE_URL
// Use ANON key for read-only public queries on the server.
// Do NOT expose SERVICE_ROLE to clients.
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn(
    "[supabase-server] Missing SUPABASE_URL or SUPABASE_ANON_KEY. Ensure your environment variables are set in Vercel.",
  )
}

export const supabaseServer = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
})
