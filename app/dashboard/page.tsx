"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"
import type { Event } from "@/types/database"
import { Calendar, Users, TrendingUp, Plus, Eye, Edit, MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface DashboardStats {
  totalEvents: number
  publishedEvents: number
  totalParticipants: number
  upcomingEvents: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalEvents: 0,
    publishedEvents: 0,
    totalParticipants: 0,
    upcomingEvents: 0,
  })
  const [recentEvents, setRecentEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const { data: events, error: eventsError } = await supabase.from("events").select("*")
      if (eventsError) throw eventsError

      const { count: participantsCount, error: participantsError } = await supabase
        .from("event_participants")
        .select("*", { count: "exact", head: true })
      if (participantsError) throw participantsError

      const now = new Date()
      const publishedEvents = events?.filter((event) => event.status === "published") || []
      const upcomingEvents = events?.filter((event) => new Date(event.start_date) > now) || []

      setStats({
        totalEvents: events?.length || 0,
        publishedEvents: publishedEvents.length,
        totalParticipants: participantsCount || 0,
        upcomingEvents: upcomingEvents.length,
      })

      const recentEventsData = events
        ?.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5)

      setRecentEvents(recentEventsData || [])
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-success-light text-success-dark border-success-DEFAULT"
      case "draft":
        return "bg-warning-light text-warning-dark border-warning-DEFAULT"
      case "cancelled":
        return "bg-error-light text-error-dark border-error-DEFAULT"
      case "completed":
        return "bg-info-light text-info-dark border-info-DEFAULT"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="border-2 border-gray-300 shadow-md bg-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-16 animate-pulse mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">¡Bienvenido de vuelta, Admin! 🍺</h1>
          <p className="text-text-secondary">Aquí tienes un resumen de lo que está pasando con tus eventos hoy.</p>
        </div>
        <Button asChild className="bg-brand-primary hover:bg-brand-secondary text-white font-medium border-0 shadow-md">
          <Link href="/dashboard/eventos/crear">
            <Plus className="h-4 w-4 mr-2" />
            Crear Evento
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-2 border-gray-300 shadow-md bg-white hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">Total Eventos</CardTitle>
            <div className="w-10 h-10 bg-brand-primary/10 rounded-full flex items-center justify-center">
              <Calendar className="h-5 w-5 text-brand-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-text-primary">{stats.totalEvents}</div>
            <p className="text-xs text-text-secondary">Eventos creados en total</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-gray-300 shadow-md bg-white hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">Eventos Publicados</CardTitle>
            <div className="w-10 h-10 bg-success-light rounded-full flex items-center justify-center">
              <Eye className="h-5 w-5 text-success-dark" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-text-primary">{stats.publishedEvents}</div>
            <p className="text-xs text-text-secondary">Eventos actualmente en vivo</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-gray-300 shadow-md bg-white hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">Total Participantes</CardTitle>
            <div className="w-10 h-10 bg-info-light rounded-full flex items-center justify-center">
              <Users className="h-5 w-5 text-info-dark" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-text-primary">{stats.totalParticipants}</div>
            <p className="text-xs text-text-secondary">Participantes registrados</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-gray-300 shadow-md bg-white hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">Próximos Eventos</CardTitle>
            <div className="w-10 h-10 bg-warning-light rounded-full flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-warning-dark" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-text-primary">{stats.upcomingEvents}</div>
            <p className="text-xs text-text-secondary">Eventos programados</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Events */}
      <Card className="border-2 border-gray-300 shadow-md bg-white">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle className="text-text-primary">Eventos Recientes</CardTitle>
              <CardDescription className="text-text-secondary">Tus últimas actividades de eventos</CardDescription>
            </div>
            <Button variant="outline" asChild className="border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white font-medium bg-transparent">
              <Link href="/dashboard/eventos">Ver Todos</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {recentEvents.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-brand-primary mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold text-text-primary mb-2">Aún no hay eventos</h3>
              <p className="text-text-secondary mb-4">¡Crea tu primer evento para comenzar!</p>
              <Button asChild className="bg-brand-primary hover:bg-brand-secondary text-white font-medium border-0">
                <Link href="/dashboard/eventos/crear">
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Evento
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {recentEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-text-primary">{event.title}</h4>
                      <Badge className={`${getStatusColor(event.status)} border font-medium`}>
                        {event.status === 'published' ? 'Publicado' : 
                         event.status === 'draft' ? 'Borrador' :
                         event.status === 'cancelled' ? 'Cancelado' : 'Completado'}
                      </Badge>
                    </div>
                    <p className="text-sm text-text-secondary mb-2 line-clamp-2">{event.description}</p>
                    <div className="flex items-center gap-4 text-xs text-text-secondary">
                      <span>📅 {format(new Date(event.start_date), "PPP", { locale: es })}</span>
                      <span>📍 {event.is_virtual ? "Virtual" : event.location || "Por definir"}</span>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-text-secondary hover:text-brand-primary hover:bg-brand-primary/10">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white border-2 border-gray-200 shadow-lg">
                      <DropdownMenuItem asChild className="text-text-primary hover:bg-brand-primary/10 hover:text-brand-primary">
                        <Link href={`/dashboard/eventos/${event.id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Detalles
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="text-text-primary hover:bg-brand-primary/10 hover:text-brand-primary">
                        <Link href={`/dashboard/eventos/${event.id}/editar`}>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar Evento
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
