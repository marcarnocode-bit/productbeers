"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react'
import Link from "next/link"
import { Event } from "@/types/database"

type EventForm = {
  title: string
  description: string
  start_date: string
  end_date: string
  location: string
  is_virtual: boolean
  max_participants: string
  status: "draft" | "published" | "cancelled" | "completed"
  image_url: string
  terms_and_conditions: string
}

function EventSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="h-8 bg-gray-200 rounded animate-pulse w-32 mb-4" />
        <div className="h-8 bg-gray-200 rounded animate-pulse w-64 mb-2" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-96 mb-8" />
        <Card>
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded animate-pulse w-48" />
          </CardHeader>
          <CardContent className="space-y-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-10 bg-gray-200 rounded animate-pulse" />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function EditarEventoPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isOrganizer, isAdmin } = useAuth()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [form, setForm] = useState<EventForm>({
    title: "",
    description: "",
    start_date: "",
    end_date: "",
    location: "",
    is_virtual: false,
    max_participants: "",
    status: "draft",
    image_url: "",
    terms_and_conditions: "",
  })

  const isCreated = searchParams.get("created") === "true"

  useEffect(() => {
    if (params.id) {
      fetchEvent()
    }
  }, [params.id])

  useEffect(() => {
    if (isCreated) {
      setSuccess("¡Evento creado exitosamente! Puedes continuar editándolo aquí.")
    }
  }, [isCreated])

  async function fetchEvent() {
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("id", params.id)
        .single()

      if (error) throw error

      // Check if user can edit this event
      if (data.organizer_id !== user?.id && !isAdmin) {
        throw new Error("No tienes permisos para editar este evento.")
      }

      setEvent(data)
      setForm({
        title: data.title,
        description: data.description,
        start_date: data.start_date.slice(0, 16), // Format for datetime-local
        end_date: data.end_date.slice(0, 16),
        location: data.location || "",
        is_virtual: data.is_virtual,
        max_participants: data.max_participants?.toString() || "",
        status: data.status,
        image_url: data.image_url || "",
        terms_and_conditions: data.terms_and_conditions || "",
      })
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setSaving(true)

    try {
      if (!user) {
        throw new Error("Debes iniciar sesión para editar eventos.")
      }

      if (!event) {
        throw new Error("Evento no encontrado.")
      }

      // Validate dates
      const startDate = new Date(form.start_date)
      const endDate = new Date(form.end_date)
      
      if (startDate >= endDate) {
        throw new Error("La fecha de fin debe ser posterior a la fecha de inicio.")
      }

      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        start_date: form.start_date,
        end_date: form.end_date,
        location: form.location.trim() || null,
        is_virtual: form.is_virtual,
        max_participants: form.max_participants ? parseInt(form.max_participants) : null,
        status: form.status,
        image_url: form.image_url.trim() || null,
        terms_and_conditions: form.terms_and_conditions.trim() || null,
        updated_at: new Date().toISOString(),
      }

      const { error } = await supabase
        .from("events")
        .update(payload)
        .eq("id", event.id)

      if (error) throw error

      setSuccess("Evento actualizado exitosamente.")
      
      // Refresh event data
      await fetchEvent()
    } catch (err: any) {
      setError(err.message || "No se pudo actualizar el evento.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <EventSkeleton />

  if (error && !event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
          <p className="text-red-600 mb-6">{error}</p>
          <Link href="/dashboard/eventos">
            <Button className="btn-primary">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a eventos
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard/eventos">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a eventos
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Editar Evento</h1>
          <p className="text-gray-600 mt-2">
            Modifica la información de tu evento
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Información del evento</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6" aria-describedby="form-status">
              <div id="form-status" className="sr-only" aria-live="polite" aria-atomic="true">
                {error || success || ""}
              </div>

              {/* Success Message */}
              {success && (
                <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-md p-3" role="alert">
                  <CheckCircle className="h-4 w-4" />
                  {success}
                </div>
              )}

              {/* Basic Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Label htmlFor="title">Título del evento *</Label>
                  <Input
                    id="title"
                    value={form.title}
                    onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
                    required
                    placeholder="Ej: Workshop de React Avanzado"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="description">Descripción *</Label>
                  <Textarea
                    id="description"
                    value={form.description}
                    onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
                    required
                    rows={4}
                    placeholder="Describe tu evento, qué aprenderán los participantes, agenda, etc."
                  />
                </div>

                <div>
                  <Label htmlFor="start_date">Fecha y hora de inicio *</Label>
                  <Input
                    id="start_date"
                    type="datetime-local"
                    value={form.start_date}
                    onChange={(e) => setForm(f => ({ ...f, start_date: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="end_date">Fecha y hora de fin *</Label>
                  <Input
                    id="end_date"
                    type="datetime-local"
                    value={form.end_date}
                    onChange={(e) => setForm(f => ({ ...f, end_date: e.target.value }))}
                    required
                  />
                </div>
              </div>

              {/* Location */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_virtual"
                    checked={form.is_virtual}
                    onCheckedChange={(checked) => setForm(f => ({ ...f, is_virtual: !!checked }))}
                  />
                  <Label htmlFor="is_virtual">Evento virtual</Label>
                </div>

                {!form.is_virtual && (
                  <div>
                    <Label htmlFor="location">Ubicación</Label>
                    <Input
                      id="location"
                      value={form.location}
                      onChange={(e) => setForm(f => ({ ...f, location: e.target.value }))}
                      placeholder="Ej: Calle Mayor 123, Madrid"
                    />
                  </div>
                )}
              </div>

              {/* Additional Settings */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="max_participants">Máximo de participantes</Label>
                  <Input
                    id="max_participants"
                    type="number"
                    min="1"
                    value={form.max_participants}
                    onChange={(e) => setForm(f => ({ ...f, max_participants: e.target.value }))}
                    placeholder="Ej: 50"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Deja vacío para sin límite
                  </p>
                </div>

                <div>
                  <Label htmlFor="status">Estado</Label>
                  <Select
                    value={form.status}
                    onValueChange={(value: "draft" | "published" | "cancelled" | "completed") => setForm(f => ({ ...f, status: value }))}
                  >
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Borrador</SelectItem>
                      <SelectItem value="published">Publicado</SelectItem>
                      <SelectItem value="cancelled">Cancelado</SelectItem>
                      <SelectItem value="completed">Completado</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-500 mt-1">
                    Solo los eventos publicados son visibles públicamente
                  </p>
                </div>
              </div>

              <div>
                <Label htmlFor="image_url">URL de imagen (opcional)</Label>
                <Input
                  id="image_url"
                  type="url"
                  value={form.image_url}
                  onChange={(e) => setForm(f => ({ ...f, image_url: e.target.value }))}
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </div>

              <div>
                <Label htmlFor="terms_and_conditions">Términos y condiciones (opcional)</Label>
                <Textarea
                  id="terms_and_conditions"
                  value={form.terms_and_conditions}
                  onChange={(e) => setForm(f => ({ ...f, terms_and_conditions: e.target.value }))}
                  rows={3}
                  placeholder="Condiciones específicas para este evento..."
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md p-3" role="alert">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}

              <div className="flex items-center justify-between pt-6">
                <div className="flex gap-2">
                  <Link href={`/eventos/${event?.id}`}>
                    <Button type="button" variant="outline">
                      Ver evento público
                    </Button>
                  </Link>
                </div>
                <div className="flex gap-2">
                  <Link href="/dashboard/eventos">
                    <Button type="button" variant="outline" disabled={saving}>
                      Cancelar
                    </Button>
                  </Link>
                  <Button type="submit" className="btn-primary" disabled={saving}>
                    {saving ? "Guardando..." : "Guardar cambios"}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
