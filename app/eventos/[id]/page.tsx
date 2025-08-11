"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/hooks/useAuth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  Globe,
  ArrowLeft,
  User,
  Share2,
  Heart,
  AlertCircle,
  CheckCircle,
} from "lucide-react"
import Link from "next/link"
import type { Event } from "@/types/database"
import EventRegistrationForm from "@/components/events/event-registration-form"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"

function EventSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="h-64 bg-gray-200 animate-pulse" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="h-24 bg-white rounded-lg shadow-lg animate-pulse mb-8" />
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-8 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded animate-pulse" />
            <div className="h-32 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="h-96 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    </div>
  )
}

function formatDate(dateString: string) {
  return format(new Date(dateString), "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })
}

function formatTime(dateString: string) {
  return format(new Date(dateString), "HH:mm", { locale: es })
}

export default function EventDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showRegistration, setShowRegistration] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)
  const [registrationCount, setRegistrationCount] = useState(0)
  const [activeTab, setActiveTab] = useState("detalles")

  useEffect(() => {
    if (params.id) {
      fetchEvent()
      checkRegistration()
      fetchRegistrationCount()
    }
  }, [params.id, user])

  async function fetchEvent() {
    try {
      const { data, error } = await supabase
        .from("events")
        .select(`
          *,
          users!events_organizer_id_fkey(full_name, email)
        `)
        .eq("id", params.id)
        .single()

      if (error) throw error
      setEvent(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function checkRegistration() {
    if (!user) return

    try {
      const { data } = await supabase
        .from("event_registrations")
        .select("id")
        .eq("event_id", params.id)
        .eq("user_id", user.id)
        .eq("status", "registered")
        .single()

      setIsRegistered(!!data)
    } catch (err) {
      // No registration found
    }
  }

  async function fetchRegistrationCount() {
    try {
      const { count } = await supabase
        .from("event_registrations")
        .select("*", { count: "exact", head: true })
        .eq("event_id", params.id)
        .eq("status", "registered")

      setRegistrationCount(count || 0)
    } catch (err) {
      console.error("Error fetching registration count:", err)
    }
  }

  if (loading) return <EventSkeleton />

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Evento no encontrado</h1>
          <p className="text-gray-600 mb-6">El evento que buscas no existe o ha sido eliminado.</p>
          <Link href="/eventos">
            <Button className="bg-brand-primary hover:bg-brand-secondary text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a eventos
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const isEventFull = event.max_participants && registrationCount >= event.max_participants
  const isEventPast = new Date(event.end_date) < new Date()
  const eventDate = new Date(event.start_date)
  const eventEndDate = new Date(event.end_date)
  const duration = (eventEndDate.getTime() - eventDate.getTime()) / (1000 * 60) // duration in minutes

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Image */}
      <div className="h-72 md:h-96 bg-gradient-to-br from-gray-800 to-gray-700 relative">
        {event.image_url ? (
          <img
            src={event.image_url || "/placeholder.svg?height=600&width=1200&query=tech%20event"}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20">
            <Calendar className="h-24 w-24 text-brand-primary/40" />
          </div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="absolute top-4 left-4">
          <Link href="/eventos">
            <Button variant="outline" className="bg-white/90 text-gray-900 hover:bg-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a eventos
            </Button>
          </Link>
        </div>
      </div>

      {/* Event Header Card */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <Card className="border-0 shadow-xl mb-8">
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
              <div className="flex-1">
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge
                    variant="secondary"
                    className={cn(
                      "font-medium",
                      event.status === "published"
                        ? "bg-green-100 text-green-800"
                        : event.status === "cancelled"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800",
                    )}
                  >
                    {event.status === "published"
                      ? "Publicado"
                      : event.status === "cancelled"
                        ? "Cancelado"
                        : event.status === "completed"
                          ? "Completado"
                          : "Borrador"}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "font-medium",
                      event.is_virtual ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800",
                    )}
                  >
                    {event.is_virtual ? "Virtual" : "Presencial"}
                  </Badge>
                </div>

                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{event.title}</h1>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-brand-primary" />
                    <span>{format(eventDate, "d MMM, yyyy", { locale: es })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-brand-primary" />
                    <span>
                      {format(eventDate, "HH:mm", { locale: es })} - {format(eventEndDate, "HH:mm", { locale: es })} (
                      {duration} min)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-brand-primary" />
                    <span>
                      {registrationCount} {registrationCount === 1 ? "asistente" : "asistentes"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row md:flex-col gap-3 mt-4 md:mt-0">
                {isEventPast ? (
                  <Button disabled className="bg-gray-200 text-gray-500 cursor-not-allowed">
                    Evento finalizado
                  </Button>
                ) : isRegistered ? (
                  <Button className="bg-green-600 hover:bg-green-700 text-white" disabled>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Registrado
                  </Button>
                ) : isEventFull ? (
                  <Button disabled className="bg-red-100 text-red-800 cursor-not-allowed">
                    Sin plazas disponibles
                  </Button>
                ) : (
                  <Button
                    onClick={() => setShowRegistration(true)}
                    className="bg-brand-primary hover:bg-brand-secondary text-white"
                  >
                    Registrarse
                  </Button>
                )}

                <div className="flex gap-2">
                  <Button variant="outline" size="icon" className="flex-1 bg-transparent" aria-label="Compartir">
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="flex-1 bg-transparent" aria-label="Guardar">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="detalles">Detalles</TabsTrigger>
                <TabsTrigger value="informacion">Información práctica</TabsTrigger>
              </TabsList>

              <TabsContent value="detalles" className="pt-6">
                <div className="prose prose-lg max-w-none text-gray-700">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Sobre este evento</h2>
                  <p>{event.description}</p>
                </div>

                {event.terms_and_conditions && (
                  <Card className="mt-8 border border-gray-200">
                    <CardHeader>
                      <CardTitle className="text-xl">Términos y condiciones</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="prose max-w-none text-gray-700">
                        <p>{event.terms_and_conditions}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="informacion" className="pt-6">
                <Card className="border border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-xl">Información del evento</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-brand-primary mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Fecha y hora</p>
                        <p className="text-gray-600">{formatDate(event.start_date)}</p>
                        <p className="text-gray-600">
                          {formatTime(event.start_date)} - {formatTime(event.end_date)} ({duration} minutos)
                        </p>
                      </div>
                    </div>

                    {event.location && !event.is_virtual && (
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-brand-primary mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-900">Ubicación</p>
                          <p className="text-gray-600">{event.location}</p>
                          <a
                            href={`https://maps.google.com/?q=${encodeURIComponent(event.location)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-brand-primary hover:underline text-sm inline-flex items-center mt-1"
                          >
                            Ver en Google Maps
                            <ArrowLeft className="h-3 w-3 ml-1 rotate-[135deg]" />
                          </a>
                        </div>
                      </div>
                    )}

                    {event.is_virtual && (
                      <div className="flex items-start gap-3">
                        <Globe className="h-5 w-5 text-brand-primary mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-900">Evento virtual</p>
                          <p className="text-gray-600">
                            Este es un evento online. Los detalles de acceso se enviarán por email a los participantes
                            registrados.
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start gap-3">
                      <User className="h-5 w-5 text-brand-primary mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Organizador</p>
                        <p className="text-gray-600">{event.users?.full_name || "Organizador"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Registration Sidebar */}
          <div className="space-y-6">
            <Card className="border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">Registro</h3>
              </div>
              <CardContent className="p-6">
                {isEventPast ? (
                  <div className="text-center py-4">
                    <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-900 font-medium mb-2">Este evento ya ha finalizado</p>
                    <p className="text-gray-600 mb-4">El evento tuvo lugar el {formatDate(event.start_date)}</p>
                    <Button asChild variant="outline" className="w-full bg-transparent">
                      <Link href="/eventos">Ver próximos eventos</Link>
                    </Button>
                  </div>
                ) : isRegistered ? (
                  <div className="text-center py-4">
                    <div className="bg-green-100 text-green-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="h-8 w-8" />
                    </div>
                    <p className="text-gray-900 font-medium mb-2">¡Ya estás registrado!</p>
                    <p className="text-gray-600 text-sm mb-4">Recibirás más información por email antes del evento.</p>
                    <div className="space-y-3">
                      <Link href="/mis-registros" className="w-full block">
                        <Button variant="outline" className="w-full bg-transparent">
                          Ver mis registros
                        </Button>
                      </Link>
                      <Button variant="ghost" className="w-full text-red-600 hover:text-red-700 hover:bg-red-50">
                        Cancelar registro
                      </Button>
                    </div>
                  </div>
                ) : isEventFull ? (
                  <div className="text-center py-4">
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <p className="text-gray-900 font-medium mb-2">Evento completo</p>
                    <p className="text-gray-600 mb-4">
                      Este evento ha alcanzado el límite de {event.max_participants} participantes.
                    </p>
                    <Button asChild variant="outline" className="w-full bg-transparent">
                      <Link href="/eventos">Ver otros eventos</Link>
                    </Button>
                  </div>
                ) : (
                  <div>
                    {!showRegistration ? (
                      <div className="space-y-4">
                        <p className="text-gray-600">
                          Regístrate para asistir a este evento y conectar con otros profesionales.
                        </p>
                        <Button
                          onClick={() => setShowRegistration(true)}
                          className="w-full bg-brand-primary hover:bg-brand-secondary text-white"
                        >
                          Registrarse al evento
                        </Button>
                      </div>
                    ) : (
                      <EventRegistrationForm
                        eventId={event.id}
                        onSuccess={() => {
                          setIsRegistered(true)
                          setShowRegistration(false)
                          fetchRegistrationCount()
                        }}
                        onCancel={() => setShowRegistration(false)}
                      />
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Event Stats */}
            <Card className="border border-gray-200">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">Detalles</h3>
              </div>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                    <span className="text-gray-600">Registrados</span>
                    <span className="font-medium text-gray-900">{registrationCount}</span>
                  </div>
                  {event.max_participants && (
                    <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                      <span className="text-gray-600">Plazas disponibles</span>
                      <span className="font-medium text-gray-900">
                        {Math.max(0, event.max_participants - registrationCount)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                    <span className="text-gray-600">Tipo</span>
                    <span className="font-medium text-gray-900">{event.is_virtual ? "Virtual" : "Presencial"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Duración</span>
                    <span className="font-medium text-gray-900">{duration} minutos</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Share Card */}
            <Card className="border border-gray-200">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">Compartir</h3>
              </div>
              <CardContent className="p-6">
                <p className="text-gray-600 mb-4">¿Te gusta este evento? ¡Compártelo con tus amigos y colegas!</p>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="w-full bg-transparent">
                    <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    Facebook
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent">
                    <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                    Twitter
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
