"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { supabase } from "@/lib/supabase"
import type { User } from "@/types/database"
import { Search, Users, UserCheck, UserX, MoreHorizontal, Mail, Calendar } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export default function UsuariosAdminPage() {
  const [usuarios, setUsuarios] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("todos")

  useEffect(() => {
    fetchUsuarios()
  }, [])

  const fetchUsuarios = async () => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      setUsuarios(data || [])
    } catch (error) {
      console.error("Error al obtener usuarios:", error)
    } finally {
      setLoading(false)
    }
  }

  const cambiarRolUsuario = async (usuarioId: string, nuevoRol: string) => {
    try {
      const { error } = await supabase
        .from("users")
        .update({ role: nuevoRol })
        .eq("id", usuarioId)

      if (error) throw error
      
      setUsuarios(usuarios.map(usuario => 
        usuario.id === usuarioId 
          ? { ...usuario, role: nuevoRol as any }
          : usuario
      ))
    } catch (error) {
      console.error("Error al cambiar rol:", error)
    }
  }

  const usuariosFiltrados = usuarios.filter((usuario) => {
    const matchesSearch = usuario.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         usuario.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === "todos" || usuario.role === roleFilter
    return matchesSearch && matchesRole
  })

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-error-light text-error-dark border-error-DEFAULT"
      case "organizer":
        return "bg-warning-light text-warning-dark border-warning-DEFAULT"
      case "participant":
        return "bg-info-light text-info-dark border-info-DEFAULT"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  const getRoleText = (role: string) => {
    switch (role) {
      case "admin": return "Administrador"
      case "organizer": return "Organizador"
      case "participant": return "Participante"
      default: return role
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-text-primary">Gestión de Usuarios</h1>
        </div>
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-text-secondary">Cargando usuarios...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Gestión de Usuarios</h1>
          <p className="text-text-secondary">Administra los usuarios de la plataforma</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-2xl font-bold text-text-primary">{usuarios.length}</p>
            <p className="text-sm text-text-secondary">Total usuarios</p>
          </div>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="border-2 border-gray-300 shadow-md bg-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-error-light rounded-full flex items-center justify-center">
                <UserCheck className="h-5 w-5 text-error-dark" />
              </div>
              <div>
                <p className="text-2xl font-bold text-text-primary">
                  {usuarios.filter(u => u.role === "admin").length}
                </p>
                <p className="text-sm text-text-secondary">Administradores</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-gray-300 shadow-md bg-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-warning-light rounded-full flex items-center justify-center">
                <Users className="h-5 w-5 text-warning-dark" />
              </div>
              <div>
                <p className="text-2xl font-bold text-text-primary">
                  {usuarios.filter(u => u.role === "organizer").length}
                </p>
                <p className="text-sm text-text-secondary">Organizadores</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-gray-300 shadow-md bg-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-info-light rounded-full flex items-center justify-center">
                <UserX className="h-5 w-5 text-info-dark" />
              </div>
              <div>
                <p className="text-2xl font-bold text-text-primary">
                  {usuarios.filter(u => u.role === "participant").length}
                </p>
                <p className="text-sm text-text-secondary">Participantes</p>
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
                  placeholder="Buscar por nombre o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-2 border-gray-300 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 text-text-primary placeholder:text-text-secondary"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="border-2 border-gray-300 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 text-text-primary">
                  <SelectValue placeholder="Rol" />
                </SelectTrigger>
                <SelectContent className="bg-white border-2 border-gray-200 shadow-lg">
                  <SelectItem value="todos" className="text-text-primary hover:bg-brand-primary/10">Todos los roles</SelectItem>
                  <SelectItem value="admin" className="text-text-primary hover:bg-brand-primary/10">Administrador</SelectItem>
                  <SelectItem value="organizer" className="text-text-primary hover:bg-brand-primary/10">Organizador</SelectItem>
                  <SelectItem value="participant" className="text-text-primary hover:bg-brand-primary/10">Participante</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de usuarios */}
      <div className="space-y-4">
        {usuariosFiltrados.length === 0 ? (
          <Card className="border-2 border-gray-300 shadow-md bg-white">
            <CardContent className="text-center py-12">
              <Users className="h-16 w-16 text-brand-primary mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold text-text-primary mb-2">No se encontraron usuarios</h3>
              <p className="text-text-secondary">Intenta ajustar los filtros de búsqueda</p>
            </CardContent>
          </Card>
        ) : (
          usuariosFiltrados.map((usuario) => (
            <Card key={usuario.id} className="border-2 border-gray-300 shadow-md bg-white hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={usuario.avatar_url || ""} alt={usuario.full_name || ""} />
                      <AvatarFallback className="bg-brand-primary/10 text-brand-primary font-medium">
                        {usuario.full_name?.charAt(0) || usuario.email.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-text-primary">
                          {usuario.full_name || "Sin nombre"}
                        </h3>
                        <Badge className={`${getRoleColor(usuario.role)} border font-medium`}>
                          {getRoleText(usuario.role)}
                        </Badge>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
                        <div className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          <span>{usuario.email}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>Registrado {format(new Date(usuario.created_at), "PPP", { locale: es })}</span>
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
                      <DropdownMenuItem onClick={() => cambiarRolUsuario(usuario.id, "admin")} className="text-text-primary hover:bg-brand-primary/10 hover:text-brand-primary">
                        Hacer administrador
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => cambiarRolUsuario(usuario.id, "organizer")} className="text-text-primary hover:bg-brand-primary/10 hover:text-brand-primary">
                        Hacer organizador
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => cambiarRolUsuario(usuario.id, "participant")} className="text-text-primary hover:bg-brand-primary/10 hover:text-brand-primary">
                        Hacer participante
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-gray-200" />
                      <DropdownMenuItem className="text-error-DEFAULT hover:bg-error-light hover:text-error-dark">
                        Suspender usuario
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
