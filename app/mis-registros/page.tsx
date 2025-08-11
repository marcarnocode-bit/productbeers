"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, Globe, ExternalLink } from 'lucide-react'
import Link from "next/link"

type EventRegistration = {
  id: string
  status: string
  created_at: string
  events: {
    id: string
    title: string
    description: string
    start_date: string
    end_date: string
    location: string | null
    is_virtual: boolean
    image_url: string | null
    status: string
  }
}

function RegistrationSkeleton() {
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
      <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes registros aún</h3>
      <p className="text-gray-600 mb-6">
        Explora nuestros eventos y regístrate para comenzar a participar en la comunidad.
      </p>
      <Link href="/eventos">
        <Button className="btn-primary">
          Explorar eventos
        </Button>
      </Link>
    </div>
  )
}

export default function MisRegistrosPage() {
  const { loading, user } = useAuth()
  const router = useRouter()
  const [registrations, setRegistrations] = useState<EventRegistration[]>([])
  const [loadingRegistrations, setLoadingRegistrations] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/signin?redirect=/mis-registros")
    }
  }, [loading, user, router])

  useEffect(() => {
    if (user) {
      fetchMyRegistrations()
    }
  }, [user])

  async function fetchMyRegistrations() {
    try {
      const { data, error } = await supabase
        .from("event_registrations")
        .select(`
          id,
          status,
          created_at,
          events (
            id,
            title,
            description,
            start_date,
            end_date,
            location,
            is_virtual,
            image_url,
            status
          )
        `)
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })

      if (error) throw error
      setRegistrations(data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoadingRegistrations(false)
    }
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  function getStatusBadge(status: string) {
    const variants = {
      registered: { label: "Registrado", className: "bg-green-100 text-green-800" },
      attended: { label: "Asistido", className: "bg-blue-100 text-blue-800" },
      cancelled: { label: "Cancelado", className: "bg-red-100 text-red-800" },
    }
    const variant = variants[status as keyof typeof variants] || variants.registered
    return (
      <Badge className={variant.className}>
        {variant.label}
      </Badge>
    )
  }

  function isEventPast(endDate: string) {
    return new Date(endDate) < new Date()
  }

  if (loading || loadingRegistrations) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="h-8 bg-gray-200 rounded animate-pulse w-64 mb-2" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-96" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <RegistrationSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Inicia sesión</h1>
          <p className="text-gray-600 mb-6">
            Necesitas iniciar sesión para ver tus registros.
          </p>
          <Link href="/auth/signin?redirect=/mis-registros">
            <Button className="btn-primary">Iniciar sesión</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">Error al cargar registros</div>
          <Button onClick={fetchMyRegistrations} className="btn-primary">
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mis Registros</h1>
          <p className="text-gray-600 mt-2">
            Eventos a los que te has registrado y tu historial de participación
          </p>
        </div>

        {/* Registrations Grid */}
        {registrations.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {registrations.map((registration) => {
              const event = registration.events
              const isPast = isEventPast(event.end_date)
              
              return (
                <Card key={registration.id} className="hover:shadow-lg transition-shadow duration-300">
                  <div className="h-32 bg-gradient-to-br from-blue-500 to-purple-600 relative rounded-t-lg">
                    {event.image_url ? (
                      <img
                        src={event.image_url || "/placeholder.svg"}
                        alt={event.title}
                        className="w-full h-full object-cover rounded-t-lg"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Calendar className="h-8 w-8 text-white opacity-50" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      {getStatusBadge(registration.status)}
                    </div>
                  </div>

                  <CardHeader>
                    <CardTitle className="text-lg font-bold line-clamp-2">
                      {event.title}
                    </CardTitle>
                    <p className="text-gray-600 text-sm line-clamp-2">{event.description}</p>
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

                      {event.is_virtual && (
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4" />
                          <span>Evento virtual</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-2">
                      <Link href={`/eventos/${event.id}`}>
                        <Button variant="outline" className="w-full">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Ver detalles del evento
                        </Button>
                      </Link>
                    </div>

                    {isPast && registration.status === "registered" && (
                      <div className="text-xs text-gray-500 text-center">
                        Este evento ya ha finalizado
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
