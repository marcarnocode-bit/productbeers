"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { User, Building, Briefcase, ExternalLink, Search, Users } from "lucide-react"
import Link from "next/link"

type Profile = {
  id: string
  bio: string | null
  company: string | null
  position: string | null
  skills: string[] | null
  interests: string[] | null
  linkedin_url: string | null
  twitter_url: string | null
  website_url: string | null
  users: {
    full_name: string | null
    avatar_url: string | null
  }
}

function ProfileSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 bg-gray-200 rounded-full animate-pulse" />
          <div className="flex-1">
            <div className="h-6 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
          </div>
        </div>
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

function EmptyState({ searchTerm }: { searchTerm: string }) {
  const isFiltered = searchTerm.length > 0

  return (
    <div className="text-center py-12">
      <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {isFiltered ? "No se encontraron perfiles" : "No hay perfiles públicos"}
      </h3>
      <p className="text-gray-600 mb-6">
        {isFiltered
          ? "Intenta ajustar tu búsqueda."
          : "Aún no hay miembros con perfiles públicos. ¡Sé el primero en hacer público tu perfil!"}
      </p>
      {!isFiltered && (
        <Link href="/perfil">
          <Button className="btn-primary">Configurar mi perfil</Button>
        </Link>
      )}
    </div>
  )
}

export default function ComunidadPage() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchProfiles()
  }, [])

  useEffect(() => {
    filterProfiles()
  }, [profiles, searchTerm])

  async function fetchProfiles() {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select(`
        *,
        users!profiles_user_id_fkey(full_name, avatar_url)
      `)
        .eq("is_public", true)
        .order("created_at", { ascending: false })

      if (error) throw error
      setProfiles(data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function filterProfiles() {
    if (!searchTerm) {
      setFilteredProfiles(profiles)
      return
    }

    const filtered = profiles.filter((profile) => {
      const searchLower = searchTerm.toLowerCase()
      return (
        profile.users?.full_name?.toLowerCase().includes(searchLower) ||
        profile.company?.toLowerCase().includes(searchLower) ||
        profile.position?.toLowerCase().includes(searchLower) ||
        profile.bio?.toLowerCase().includes(searchLower) ||
        profile.skills?.some((skill) => skill.toLowerCase().includes(searchLower)) ||
        profile.interests?.some((interest) => interest.toLowerCase().includes(searchLower))
      )
    })

    setFilteredProfiles(filtered)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-brand-primary to-brand-secondary text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <div className="h-10 bg-white/20 rounded animate-pulse w-64 mx-auto mb-4" />
              <div className="h-6 bg-white/20 rounded animate-pulse w-96 mx-auto" />
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProfileSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">Error al cargar perfiles</div>
          <Button onClick={fetchProfiles} className="btn-primary">
            Reintentar
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-brand-primary to-brand-secondary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Nuestra comunidad</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Conecta con profesionales, emprendedores y expertos de nuestra comunidad
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por nombre, empresa, habilidades..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Profiles Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filteredProfiles.length === 0 ? (
          <EmptyState searchTerm={searchTerm} />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfiles.map((profile) => (
              <Card key={profile.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-full flex items-center justify-center overflow-hidden">
                      {profile.users?.avatar_url ? (
                        <img
                          src={profile.users.avatar_url || "/placeholder.svg?height=64&width=64&query=person"}
                          alt={profile.users.full_name || "Usuario"}
                          className="h-16 w-16 object-cover"
                        />
                      ) : (
                        <User className="h-8 w-8 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg font-bold">{profile.users?.full_name || "Usuario"}</CardTitle>
                      {profile.position && profile.company && (
                        <p className="text-gray-600 text-sm">
                          {profile.position} en {profile.company}
                        </p>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {profile.bio && <p className="text-gray-700 text-sm line-clamp-3">{profile.bio}</p>}

                  {profile.company && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Building className="h-4 w-4" />
                      <span>{profile.company}</span>
                    </div>
                  )}

                  {profile.position && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Briefcase className="h-4 w-4" />
                      <span>{profile.position}</span>
                    </div>
                  )}

                  {profile.skills && profile.skills.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-900 mb-2">Habilidades</p>
                      <div className="flex flex-wrap gap-1">
                        {profile.skills.slice(0, 3).map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {profile.skills.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{profile.skills.length - 3} más
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Social Links */}
                  <div className="flex gap-2 pt-2">
                    {profile.linkedin_url && (
                      <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex-1">
                        <Button variant="outline" size="sm" className="w-full bg-transparent">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          LinkedIn
                        </Button>
                      </a>
                    )}
                    {profile.website_url && (
                      <a href={profile.website_url} target="_blank" rel="noopener noreferrer" className="flex-1">
                        <Button variant="outline" size="sm" className="w-full bg-transparent">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Web
                        </Button>
                      </a>
                    )}
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
