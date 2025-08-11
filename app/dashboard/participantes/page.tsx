"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { supabase } from "@/lib/supabase"
import { Search, Users, Calendar, Mail, MoreHorizontal, Eye } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface Participant {
  id: string
  event_id: string
  user_id: string
  status: "registered" | "attended" | "cancelled"
  created_at: string
  users: {
    full_name: string | null
    email: string
    avatar_url: string | null
  }
  events: {
    title: string
    start_date: string
  }
}

export default function ParticipantesPage() {
  const [participantes, setParticipantes] = useState<Participant[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("todos")

  useEffect(() => {
    fetchParticipantes()
  }, [])

  const fetchParticipantes = async () => {
    try {
      const { data, error } = await supabase
        .from("event_participants")
        .select(`
          *,
          users(full_name, email, avatar_url),
          events(title, start_date)
        `)
        .order("created_at", { ascending: false })

      if (error) throw error
      setParticipantes(data || [])
    } catch (error) {
      console.error("Error al obtener participantes:", error)
    } finally {
      setLoading(false)
    }
  }

  const cambiarEstadoParticipante = async (participanteId: string, nuevoEstado: string) => {
    try {
      const { error } = await supabase
        .from("event_participants")
        .update({ status: nuevoEstado })
        .eq("id", participanteId)

      if (error) throw error
      
      setParticipantes(participantes.map(participante => 
        participante.id === participanteId 
          ? { ...participante, status: nuevoEstado as any }
          : participante
      ))
    } catch (error) {
      console.error("Error al cambiar estado:", error)
    }
  }

  const participantesFiltrados = participantes.filter((participante) => {
    const matchesSearch = participante.users.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         participante.users.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         participante.events.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "todos" || participante.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "registered":
        return "bg-info-light text-info-dark border-info-DEFAULT"
      case "attended":
        return "bg-success-light text-success-dark border-success-DEFAULT"
      case "cancelled":
        return "bg-error-light text-error-dark border-error-DEFAULT"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "registered": return "Registrado"
      case "attended": return "Asistió"
      case "cancelled": return "Cancelado"
      default: return status
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-text-primary">Gestión de Participantes</h1>
        </div>
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-text-secondary">Cargando participantes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Gestión de Participantes</h1>
          <p className="text-text-secondary">Administra las inscripciones y asistencias a eventos</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-2xl font-bold text-text-primary">{participantes.length}</p>
            <p className="text-sm text-text-secondary">Total inscripciones</p>
          </div>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="border-2 border-gray-300 shadow-md bg-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-info-light rounded-full flex items-center justify-center">
                <Users className="h-5 w-5 text-info-dark" />
              </div>
              <div>
                <p className="text-2xl font-bold text-text-primary">
                  {participantes.filter(p => p.status === "registered").length}
                </p>
                <p className="text-sm text-text-secondary">Registrados</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-gray-300 shadow-md bg-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-success-light rounded-full flex items-center justify-center">
                <Users className="h-5 w-5 text-success-dark" />
              </div>
              <div>
                <p className="text-2xl font-bold text-text-primary">
                  {participantes.filter(p => p.status === "attended").length}
                </p>
                <p className="text-sm text-text-secondary">Asistieron</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-gray-300 shadow-md bg-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-error-light rounded-full flex items-center justify-center">
                <Users className="h-5 w-5 text-error-dark" />
              </div>
              <div>
                <p className="text-2xl font-bold text-text-primary">
                  {participantes.filter(p => p.status === "cancelled").length}
                </p>
                <p className="text-sm text-text-secondary">Cancelaron</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="border-2 border-gray-300 shadow-md bg-white">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Buscar por participante o evento..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-2 border-gray-300 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 text-text-primary placeholder:text-text-secondary"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="border-2 border-gray-300 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 text-text-primary">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent className="bg-white border-2 border-gray-200 shadow-lg">
                  <SelectItem value="todos" className="text-text-primary hover:bg-brand-primary/10">Todos los estados</SelectItem>
                  <SelectItem value="registered" className="text-text-primary hover:bg-brand-primary/10">Registrado</SelectItem>
                  <SelectItem value="attended" className="text-text-primary hover:bg-brand-primary/10">Asistió</SelectItem>
                  <SelectItem value="cancelled" className="text-text-primary hover:bg-brand-primary/10">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de participantes */}
      <div className="space-y-4">
        {participantesFiltrados.length === 0 ? (
          <Card className="border-2 border-gray-300 shadow-md bg-white">
            <CardContent className="text-center py-12">
              <Users className="h-16 w-16 text-brand-primary mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold text-text-primary mb-2">No se encontraron participantes</h3>
              <p className="text-text-secondary">Intenta ajustar los filtros de búsqueda</p>
            </CardContent>
          </Card>
        ) : (
          participantesFiltrados.map((participante) => (
            <Card key={participante.id} className="border-2 border-gray-300 shadow-md bg-white hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={participante.users.avatar_url || ""} alt={participante.users.full_name || ""} />
                      <AvatarFallback className="bg-brand-primary/10 text-brand-primary font-medium">
                        {participante.users.full_name?.charAt(0) || participante.users.email.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-text-primary">
                          {participante.users.full_name || "Sin nombre"}
                        </h3>
                        <Badge className={`${getStatusColor(participante.status)} border font-medium`}>
                          {getStatusText(participante.status)}
                        </Badge>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-text-secondary">
                          <Mail className="h-4 w-4" />
                          <span>{participante.users.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-text-secondary">
                          <Calendar className="h-4 w-4" />
                          <span className="font-medium">{participante.events.title}</span>
                          <span>•</span>
                          <span>{format(new Date(participante.events.start_date), "PPP", { locale: es })}</span>
                        </div>
                        <div className="text-xs text-text-secondary">
                          Inscrito el {format(new Date(participante.created_at), "PPP", { locale: es })}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white font-medium">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white border-2 border-gray-200 shadow-lg">
                      <DropdownMenuItem onClick={() => cambiarEstadoParticipante(participante.id, "attended")} className="text-text-primary hover:bg-brand-primary/10 hover:text-brand-primary">
                        Marcar como asistido
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => cambiarEstadoParticipante(participante.id, "registered")} className="text-text-primary hover:bg-brand-primary/10 hover:text-brand-primary">
                        Marcar como registrado
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => cambiarEstadoParticipante(participante.id, "cancelled")} className="text-text-primary hover:bg-brand-primary/10 hover:text-brand-primary">
                        Marcar como cancelado
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
