"use client"

import type React from "react"

import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react"
import type { User as SupabaseUser, AuthChangeEvent, Session } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"
import type { Profile, User as UserRow } from "@/types/database"

type AuthContextType = {
  user: SupabaseUser | null
  userData: UserRow | null
  profile: Profile | null
  loading: boolean
  isAdmin: boolean
  isOrganizer: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  updateUserData: (updates: Partial<UserRow>) => Promise<{ error: any }>
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const CACHE_KEY = "pb_user_permissions"
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

function getCachedPermissions() {
  if (typeof window === "undefined") return null
  try {
    const cached = localStorage.getItem(CACHE_KEY)
    if (!cached) return null
    const { data, timestamp } = JSON.parse(cached)
    if (Date.now() - timestamp > CACHE_DURATION) {
      localStorage.removeItem(CACHE_KEY)
      return null
    }
    return data
  } catch {
    return null
  }
}

function setCachedPermissions(userData: UserRow | null, profile: Profile | null) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        data: { userData, profile },
        timestamp: Date.now(),
      }),
    )
  } catch {
    // Ignore storage errors
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [userData, setUserData] = useState<UserRow | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [initialLoad, setInitialLoad] = useState(true)

  const fetchUserRelatedData = useCallback(
    async (u: SupabaseUser | null) => {
      if (!u) {
        setUserData(null)
        setProfile(null)
        if (typeof window !== "undefined") {
          localStorage.removeItem(CACHE_KEY)
        }
        setLoading(false)
        return
      }

      if (initialLoad) {
        const cached = getCachedPermissions()
        if (cached) {
          setUserData(cached.userData)
          setProfile(cached.profile)
          setLoading(false)
          setInitialLoad(false)
          // Still fetch fresh data in background
          fetchFreshUserData(u)
          return
        }
      }

      await fetchFreshUserData(u)
    },
    [initialLoad],
  )

  const fetchFreshUserData = async (u: SupabaseUser) => {
    try {
      const [{ data: usersRow, error: usersError }, { data: profileRow, error: profileError }] = await Promise.all([
        supabase.from("users").select("*").eq("id", u.id).single(),
        supabase.from("profiles").select("*").eq("user_id", u.id).single(),
      ])

      if (usersError) {
        console.error("Error fetching users row:", usersError.message)
        setUserData(null)
      } else {
        setUserData(usersRow as UserRow)
      }

      if (profileError && (profileError as any).code !== "PGRST116") {
        console.error("Error fetching profile row:", profileError.message)
      }
      setProfile(profileRow as Profile)

      setCachedPermissions(usersRow as UserRow, profileRow as Profile)
    } catch (err) {
      console.error("Error fetching user-related data:", err)
      setUserData(null)
      setProfile(null)
    } finally {
      setLoading(false)
      setInitialLoad(false)
    }
  }

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession()
      const session = data.session
      setUser(session?.user ?? null)
      await fetchUserRelatedData(session?.user ?? null)
    }
    init()

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event: AuthChangeEvent, session: Session | null) => {
        setLoading(true)
        setUser(session?.user ?? null)
        await fetchUserRelatedData(session?.user ?? null)
      },
    )

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [fetchUserRelatedData])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUserData(null)
    setProfile(null)
    if (typeof window !== "undefined") {
      localStorage.removeItem(CACHE_KEY)
    }
  }

  const updateUserData = async (updates: Partial<UserRow>) => {
    if (!user) return { error: { message: "No user logged in" } }
    const { data, error } = await supabase
      .from("users")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", user.id)
      .select()
      .single()

    if (!error && data) {
      setUserData(data as UserRow)
      setCachedPermissions(data as UserRow, profile)
    }
    return { error }
  }

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: { message: "No user logged in" } }
    const { data, error } = await supabase
      .from("profiles")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("user_id", user.id)
      .select()
      .single()

    if (!error && data) {
      setProfile(data as Profile)
      setCachedPermissions(userData, data as Profile)
    }
    return { error }
  }

  const isAdmin = useMemo(() => userData?.role === "admin", [userData?.role])
  const isOrganizer = useMemo(() => userData?.role === "admin" || userData?.role === "organizer", [userData?.role])

  const value: AuthContextType = {
    user,
    userData,
    profile,
    loading,
    isAdmin,
    isOrganizer,
    signIn,
    signOut,
    updateUserData,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
