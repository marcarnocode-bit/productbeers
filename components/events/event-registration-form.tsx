"use client"

import { useEffect, useMemo, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'

type Props = {
  eventId: string
  maxParticipants?: number | null
}

export default function EventRegistrationForm({ eventId, maxParticipants = null }: Props) {
  const { user, loading } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [form, setForm] = useState({
    full_name: "",
    email: "",
  })
  const [count, setCount] = useState<number>(0)
  const [alreadyRegistered, setAlreadyRegistered] = useState(false)

  const spotsLeft = useMemo(() => {
    if (typeof maxParticipants === "number") return Math.max(maxParticipants - count, 0)
    return null
  }, [maxParticipants, count])

  useEffect(() => {
    async function prime() {
      // Pre-fill user info if available
      if (user) {
        setForm((f) => ({
          ...f,
          full_name: (user.user_metadata as any)?.full_name || "",
          email: user.email || "",
        }))
      }
      // Registration count
      const { count: c } = await supabase
        .from("event_registrations")
        .select("id", { count: "exact", head: true })
        .eq("event_id", eventId)
        .eq("status", "registered")
      setCount(typeof c === "number" ? c : 0)
      // Already registered?
      if (user?.id) {
        const { data } = await supabase
          .from("event_registrations")
          .select("id")
          .eq("event_id", eventId)
          .eq("user_id", user.id)
          .eq("status", "registered")
          .maybeSingle()
        if (data?.id) setAlreadyRegistered(true)
      }
    }
    prime()
  }, [eventId, user])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!form.full_name.trim() || !form.email.trim()) {
      setError("El nombre y el email son obligatorios.")
      return
    }
    if (spotsLeft !== null && spotsLeft <= 0) {
      setError("No quedan plazas disponibles.")
      return
    }
    if (!user) {
      setError("Debes iniciar sesión para registrarte.")
      return
    }
    if (alreadyRegistered) {
      setError("Ya estás registrado en este evento.")
      return
    }

    setIsSubmitting(true)
    try {
      const { error: insertError } = await supabase.from("event_registrations").insert({
        event_id: eventId,
        user_id: user.id,
        email: form.email.trim(),
        full_name: form.full_name.trim(),
        terms_accepted: true,
        privacy_accepted: true,
        marketing_accepted: false,
        status: "registered",
      })
      if (insertError) throw insertError

      setSuccess("Te has registrado correctamente.")
      setAlreadyRegistered(true)
      setCount((x) => x + 1)
    } catch (err: any) {
      setError(err?.message || "No se pudo completar el registro. Inténtalo de nuevo.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" aria-describedby="registration-status">
      <div id="registration-status" className="sr-only" aria-live="polite" aria-atomic="true">
        {success || error || ""}
      </div>

      {typeof spotsLeft === "number" && (
        <p className="text-sm text-gray-600">
          Plazas disponibles: <span className="font-medium">{spotsLeft}</span>
        </p>
      )}

      <div className="space-y-2">
        <Label htmlFor="full_name">Nombre completo</Label>
        <Input
          id="full_name"
          value={form.full_name}
          onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
          placeholder="Tu nombre y apellidos"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          placeholder="tu@email.com"
          required
        />
      </div>

      {error && (
        <p className="flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md p-2" role="alert">
          <AlertCircle className="h-4 w-4" />
          {error}
        </p>
      )}
      {success && (
        <p className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md p-2" role="status">
          <CheckCircle2 className="h-4 w-4" />
          {success}
        </p>
      )}

      <Button
        type="submit"
        className="btn-primary w-full"
        disabled={loading || isSubmitting || alreadyRegistered || (spotsLeft !== null && spotsLeft <= 0)}
      >
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {alreadyRegistered ? "Ya registrado" : (spotsLeft !== null && spotsLeft <= 0) ? "Aforo completo" : "Registrarme"}
      </Button>
    </form>
  )
}
