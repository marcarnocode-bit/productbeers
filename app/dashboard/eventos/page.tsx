"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"
import type { Event } from "@/types/database"
import { Calendar, MapPin, Users, Search, Plus, Eye, Edit, Trash2, MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export default function EventosAdminPage() {
  const [eventos, setEventos] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("todos")

  useEffect(() => {
    fetchEventos()
  }, [])

  const fetchEventos = async () => {
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      setEventos(data || [])
    } catch (error) {
      console.error("Error al obtener eventos:", error)
    } finally {
      setLoading(false)
    }
  }

  const eliminarEvento = async (eventoId: string) => {
    try {
      const { error } = await supabase
        .from("events")
        .delete()
        .eq("id", eventoId)

      if (error) throw error
      
      setEventos(eventos.filter(evento => evento.id !== eventoId))
    } catch (error) {
      console.error("Error al eliminar evento:", error)
    }
  }

  const cambiarEstadoEvento = async (eventoId: string, nuevoEstado: string) => {
    try {
      const { error } = await supabase
        .from("events")
        .update({ status: nuevoEstado })
        .eq("id", eventoId)

      if (error) throw error
      
      setEventos(eventos.map(evento => 
        evento.id === eventoId 
          ? { ...evento, status: nuevoEstado as any }
          : evento
      ))
    } catch (error) {
      console.error("Error al cambiar estado:", error)
    }
  }

  const eventosFiltrados = eventos.filter((evento) => {
    const matchesSearch = evento.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         evento.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "todos" || evento.status === statusFilter
    return matchesSearch && matchesStatus
  })

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

  const getStatusText = (status: string) => {
    switch (status) {
      case "published": return "Publicado"
      case "draft": return "Borrador"
      case "cancelled": return "Cancelado"
      case "completed": return "Completado"
      default: return status
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-text-primary">Gestión de Eventos</h1>
        </div>
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-text-secondary">Cargando eventos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Gestión de Eventos</h1>
          <p className="text-text-secondary">Administra todos los eventos de la plataforma</p>
        </div>
        <Button asChild className="bg-brand-primary hover:bg-brand-secondary text-white font-medium border-0 shadow-md">
          <Link href="/dashboard/eventos/crear">
            <Plus className="h-4 w-4 mr-2" />
            Crear Evento
          </Link>
        </Button>
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
                  placeholder="Buscar eventos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-2 border-gray-300 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 text-text-primary placeholder:text-text-secondary bg-transparent"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="border-2 border-gray-300 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 text-text-primary bg-transparent">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent className="bg-white border-2 border-gray-200 shadow-lg">
                  <SelectItem value="todos" className="text-text-primary hover:bg-brand-primary/10">Todos los estados</SelectItem>
                  <SelectItem value="published" className="text-text-primary hover:bg-brand-primary/10">Publicado</SelectItem>
                  <SelectItem value="draft" className="text-text-primary hover:bg-brand-primary/10">Borrador</SelectItem>
                  <SelectItem value="cancelled" className="text-text-primary hover:bg-brand-primary/10">Cancelado</SelectItem>
                  <SelectItem value="completed" className="text-text-primary hover:bg-brand-primary/10">Completado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de eventos */}
      <div className="space-y-4">
        {eventosFiltrados.length === 0 ? (
          <Card className="border-2 border-gray-300 shadow-md bg-white">
            <CardContent className="text-center py-12">
              <Calendar className="h-16 w-16 text-brand-primary mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold text-text-primary mb-2">
                {searchTerm || statusFilter !== "todos" ? "No se encontraron eventos" : "No hay eventos"}
              </h3>
              <p className="text-text-secondary mb-4">
                {searchTerm || statusFilter !== "todos" 
                  ? "Intenta ajustar los filtros de búsqueda"
                  : "Crea tu primer evento para comenzar"
                }
              </p>
              {!searchTerm && statusFilter === "todos" && (
                <Button asChild className="bg-brand-primary hover:bg-brand-secondary text-white font-medium border-0">
                  <Link href="/dashboard/eventos/crear">
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Evento
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          eventosFiltrados.map((evento) => (
            <Card key={evento.id} className="border-2 border-gray-300 shadow-md bg-white hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <h3 className="text-xl font-semibold text-text-primary">{evento.title}</h3>
                      <Badge className={`${getStatusColor(evento.status)} border font-medium`}>
                        {getStatusText(evento.status)}
                      </Badge>
                      <Badge variant="outline" className="border-2 border-brand-primary text-brand-primary font-medium">
                        {evento.is_virtual ? "Virtual" : "Presencial"}
                      </Badge>
                    </div>
                    
                    <p className="text-text-secondary mb-4 line-clamp-2">{evento.description}</p>
                    
                    <div className="grid md:grid-cols-3 gap-4 text-sm text-text-secondary">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-brand-primary" />
                        <span>{format(new Date(evento.start_date), "PPP", { locale: es })}</span>
                      </div>
                      
                      {evento.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-brand-primary" />
                          <span className="truncate">{evento.location}</span>
                        </div>
                      )}
                      
                      {evento.max_participants && (
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-brand-primary" />
                          <span>Máx. {evento.max_participants} participantes</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Button variant="outline" size="sm" asChild className="border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white font-medium bg-transparent">
                      <Link href={`/dashboard/eventos/${evento.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    
                    <Button variant="outline" size="sm" asChild className="border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white font-medium bg-transparent">
                      <Link href={`/dashboard/eventos/${evento.id}/editar`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger className="bg-transparent" className="border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white font-medium bg-transparent" asChild>
                        <Button variant="outline" size="sm" className="border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white font-medium">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white border-2 border-gray-200 shadow-lg">
                        <DropdownMenuItem onClick={() => cambiarEstadoEvento(evento.id, "published")} className="text-text-primary hover:bg-brand-primary/10 hover:text-brand-primary">
                          Publicar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => cambiarEstadoEvento(evento.id, "draft")} className="text-text-primary hover:bg-brand-primary/10 hover:text-brand-primary">
                          Marcar como borrador
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => cambiarEstadoEvento(evento.id, "completed")} className="text-text-primary hover:bg-brand-primary/10 hover:text-brand-primary">
                          Marcar como completado
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => cambiarEstadoEvento(evento.id, "cancelled")} className="text-text-primary hover:bg-brand-primary/10 hover:text-brand-primary">
                          Cancelar evento
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-gray-200" />
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-error-DEFAULT hover:bg-error-light hover:text-error-dark">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Eliminar
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-white border-2 border-gray-300">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-text-primary">¿Estás seguro?</AlertDialogTitle>
                              <AlertDialogDescription className="text-text-secondary">
                                Esta acción no se puede deshacer. El evento será eliminado permanentemente.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="border-2 border-gray-300 text-text-primary hover:bg-gray-50">Cancelar</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => eliminarEvento(evento.id)}
                                className="bg-error-DEFAULT hover:bg-error-dark text-white border-0"
                              >
                                Eliminar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
