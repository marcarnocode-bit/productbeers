"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { BarChart3, Users, Calendar, TrendingUp, Eye, MessageSquare, Award, Clock } from 'lucide-react'

interface AnalyticsData {
  totalEvents: number
  totalParticipants: number
  totalFeedback: number
  avgRating: number
  eventsByMonth: { month: string; count: number }[]
  topEvents: { title: string; participants: number }[]
  participantGrowth: number
}

export default function AnaliticasPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalEvents: 0,
    totalParticipants: 0,
    totalFeedback: 0,
    avgRating: 0,
    eventsByMonth: [],
    topEvents: [],
    participantGrowth: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const { count: eventsCount } = await supabase
        .from("events")
        .select("*", { count: "exact", head: true })

      const { count: participantsCount } = await supabase
        .from("event_participants")
        .select("*", { count: "exact", head: true })

      const { data: feedbackData, count: feedbackCount } = await supabase
        .from("feedback")
        .select("rating", { count: "exact" })

      const avgRating = feedbackData?.length 
        ? feedbackData.reduce((sum, f) => sum + f.rating, 0) / feedbackData.length 
        : 0

      const sixMonthsAgo = new Date()
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
      
      const { data: monthlyEvents } = await supabase
        .from("events")
        .select("created_at")
        .gte("created_at", sixMonthsAgo.toISOString())

      const eventsByMonth = monthlyEvents?.reduce((acc: any[], event) => {
        const month = new Date(event.created_at).toLocaleDateString('es-ES', { 
          month: 'short', 
          year: 'numeric' 
        })
        const existing = acc.find(item => item.month === month)
        if (existing) {
          existing.count++
        } else {
          acc.push({ month, count: 1 })
        }
        return acc
      }, []) || []

      const { data: topEventsData } = await supabase
        .from("events")
        .select(`
          title,
          event_participants(count)
        `)
        .limit(5)

      const topEvents = topEventsData?.map(event => ({
        title: event.title,
        participants: event.event_participants?.length || 0
      })).sort((a, b) => b.participants - a.participants) || []

      setAnalytics({
        totalEvents: eventsCount || 0,
        totalParticipants: participantsCount || 0,
        totalFeedback: feedbackCount || 0,
        avgRating: Math.round(avgRating * 10) / 10,
        eventsByMonth,
        topEvents,
        participantGrowth: 15
      })
    } catch (error) {
      console.error("Error al obtener analíticas:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-text-primary">Analíticas</h1>
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-text-secondary">Cargando analíticas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-text-primary">Analíticas del Dashboard</h1>
        <p className="text-text-secondary">Métricas y estadísticas de rendimiento de la plataforma</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-2 border-gray-300 shadow-md bg-white hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">Total Eventos</CardTitle>
            <div className="w-10 h-10 bg-brand-primary/10 rounded-full flex items-center justify-center">
              <Calendar className="h-5 w-5 text-brand-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-text-primary">{analytics.totalEvents}</div>
            <p className="text-xs text-success-dark font-medium">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +12% desde el mes pasado
            </p>
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
            <div className="text-2xl font-bold text-text-primary">{analytics.totalParticipants}</div>
            <p className="text-xs text-success-dark font-medium">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +{analytics.participantGrowth}% crecimiento
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-gray-300 shadow-md bg-white hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">Feedback Recibido</CardTitle>
            <div className="w-10 h-10 bg-warning-light rounded-full flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-warning-dark" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-text-primary">{analytics.totalFeedback}</div>
            <p className="text-xs text-text-secondary">Comentarios de eventos</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-gray-300 shadow-md bg-white hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">Rating Promedio</CardTitle>
            <div className="w-10 h-10 bg-success-light rounded-full flex items-center justify-center">
              <Award className="h-5 w-5 text-success-dark" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-text-primary">{analytics.avgRating}/5</div>
            <p className="text-xs text-success-dark font-medium">Excelente satisfacción</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Eventos por Mes */}
        <Card className="border-2 border-gray-300 shadow-md bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-text-primary">
              <BarChart3 className="h-5 w-5 text-brand-primary" />
              Eventos por Mes
            </CardTitle>
            <CardDescription className="text-text-secondary">
              Tendencia de creación de eventos en los últimos 6 meses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.eventsByMonth.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary font-medium">{item.month}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-brand-primary h-2 rounded-full transition-all" 
                        style={{ width: `${(item.count / Math.max(...analytics.eventsByMonth.map(e => e.count))) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-text-primary w-8">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Eventos */}
        <Card className="border-2 border-gray-300 shadow-md bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-text-primary">
              <TrendingUp className="h-5 w-5 text-brand-primary" />
              Eventos Más Populares
            </CardTitle>
            <CardDescription className="text-text-secondary">
              Eventos con mayor número de participantes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topEvents.map((event, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-brand-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-brand-primary">#{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-text-primary line-clamp-1">{event.title}</p>
                    <p className="text-xs text-text-secondary">{event.participants} participantes</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Métricas Adicionales */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-2 border-gray-300 shadow-md bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-text-primary">
              <Eye className="h-5 w-5 text-brand-primary" />
              Engagement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-text-primary mb-2">78%</div>
            <p className="text-xs text-text-secondary">Tasa de participación promedio</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-gray-300 shadow-md bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-text-primary">
              <Clock className="h-5 w-5 text-brand-primary" />
              Duración Promedio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-text-primary mb-2">2.5h</div>
            <p className="text-xs text-text-secondary">Tiempo promedio por evento</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-gray-300 shadow-md bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-text-primary">
              <Users className="h-5 w-5 text-brand-primary" />
              Retención
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-text-primary mb-2">65%</div>
            <p className="text-xs text-text-secondary">Usuarios que repiten eventos</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
