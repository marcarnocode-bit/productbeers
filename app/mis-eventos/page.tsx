"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, Plus, Edit, Eye } from 'lucide-react'
import Link from "next/link"
import { Event } from "@/types/database"

function EventSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="h-6 bg-gray-200 rounded animate-pulse mb-2" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
        </div>
      </CardContent>
    </Card>
  )
}

function EmptyState() {
  return (
    <div className="text-center py-12">
      <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">No has organizado eventos aún</h3>
      <p className="text-gray-600 mb-6">
        Crea tu primer evento y comienza a construir tu comunidad.
      </p>
      <Link href="/dashboard/eventos/crear">
        <Button className="btn-primary">
          <Plus className="h-4 w-4 mr-2" />
          Crear mi primer evento
        </Button>
      </Link>
    </div>
  )
}

export default function MisEventosPage() {
  const { loading, user, isOrganizer, isAdmin } = useAuth()
  const router = useRouter()
  const [events, setEvents] = useState<Event[]>([])
  const [loadingEvents, setLoadingEvents] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/signin?redirect=/mis-eventos")
    }
  }, [loading, user, router])

  useEffect(() => {
    if (user && (isOrganizer || isAdmin)) {
      fetchMyEvents()
    }
  }, [user, isOrganizer, isAdmin])

  async function fetchMyEvents() {
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("organizer_id", user!.id)
        .order("created_at", { ascending: false })

      if (error) throw error
      setEvents(data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoadingEvents(false)
    }
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  function getStatusBadge(status: string) {
    const variants = {
      draft: { label: "Borrador", className: "bg-gray-100 text-gray-800" },
      published: { label: "Publicado", className: "bg-green-100 text-green-800" },
      cancelled: { label: "Cancelado", className: "bg-red-100 text-red-800" },
      completed: { label: "Completado", className: "bg-blue-100 text-blue-800" },
    }
    const variant = variants[status as keyof typeof variants] || variants.draft
    return (
      <Badge className={variant.className}>
        {variant.label}
      </Badge>
    )
  }

  if (loading || loadingEvents) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="h-8 bg-gray-200 rounded animate-pulse w-64 mb-2" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-96" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <EventSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!user || (!isOrganizer && !isAdmin)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Acceso restringido</h1>
          <p className="text-gray-600 mb-6">
            Necesitas permisos de organizador para ver esta página.
          </p>
          <Link href="/">
            <Button className="btn-primary">Volver al inicio</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">Error al cargar eventos</div>
          <Button onClick={fetchMyEvents} className="btn-primary">
            Reintentar
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mis Eventos</h1>
            <p className="text-gray-600 mt-2">
              Gestiona los eventos que has creado como organizador
            </p>
          </div>
          <Link href="/dashboard/eventos/crear">
            <Button className="btn-primary">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo evento
            </Button>
          </Link>
        </div>

        {/* Events Grid */}
        {events.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <Card key={event.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="text-lg font-bold line-clamp-2">
                      {event.title}
                    </CardTitle>
                    {getStatusBadge(event.status)}
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-3">{event.description}</p>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(event.start_date)}</span>
                    </div>

                    {event.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span className="line-clamp-1">{event.location}</span>
                      </div>
                    )}

                    {event.max_participants && (
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>Máximo {event.max_participants} participantes</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Link href={`/eventos/${event.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        <Eye className="h-4 w-4 mr-1" />
                        Ver
                      </Button>
                    </Link>
                    <Link href={`/dashboard/eventos/${event.id}/editar`} className="flex-1">
                      <Button size="sm" className="w-full btn-primary">
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
