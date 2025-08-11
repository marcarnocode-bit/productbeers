"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Calendar,
  ExternalLink,
  ArrowLeft,
  BookOpen,
  FileText,
  LinkIcon,
  Video,
  Share2,
  Download,
  AlertCircle,
} from "lucide-react"

type Resource = {
  id: string
  title: string
  description: string | null
  url: string | null
  file_path: string | null
  resource_type: "document" | "video" | "link" | "template" | "article"
  created_at: string
  events?: {
    title: string
  } | null
}

function HeaderSkeleton() {
  return (
    <div className="bg-gradient-to-r from-brand-primary to-brand-secondary text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="h-7 w-32 bg-white/30 rounded animate-pulse mb-3" />
        <div className="h-10 w-3/4 bg-white/30 rounded animate-pulse" />
      </div>
    </div>
  )
}

function getResourceIcon(type: string) {
  const icons = {
    article: BookOpen,
    document: FileText,
    video: Video,
    link: LinkIcon,
    template: FileText,
  }
  return (icons as any)[type] || FileText
}

function getResourceTypeLabel(type: string) {
  const labels = {
    article: "Artículo",
    document: "Documento",
    video: "Video",
    link: "Enlace",
    template: "Plantilla",
  }
  return (labels as any)[type] || type
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export default function ResourceViewPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [resource, setResource] = useState<Resource | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    fetchResource(id as string)
  }, [id])

  async function fetchResource(resourceId: string) {
    try {
      const { data, error } = await supabase
        .from("resources")
        .select(`
          *,
          events(title)
        `)
        .eq("id", resourceId)
        .single()

      if (error) throw error
      setResource(data as Resource)
    } catch (err: any) {
      setError(err.message || "No se pudo cargar el recurso")
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <HeaderSkeleton />

  if (error || !resource) {
    return (
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-2 text-red-600">
              <AlertCircle className="h-5 w-5 mt-0.5" />
              <p>{error ?? "Recurso no encontrado"}</p>
            </div>
            <div className="mt-4">
              <Link href="/recursos">
                <Button className="btn-primary">Ir a recursos</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    )
  }

  const Icon = getResourceIcon(resource.resource_type)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero / Header */}
      <header className="bg-gradient-to-r from-brand-primary to-brand-secondary text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-3 mb-3">
            <Button
              variant="secondary"
              onClick={() => router.back()}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>
            <Badge variant="secondary" className="bg-white/90 text-gray-900">
              {getResourceTypeLabel(resource.resource_type)}
            </Badge>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold flex items-start gap-3">
            <Icon className="h-8 w-8 opacity-90 mt-1" />
            <span>{resource.title}</span>
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-white/90">
            <span className="inline-flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {formatDate(resource.created_at)}
            </span>
            {resource.events?.title && (
              <span className="inline-flex items-center gap-2">
                Evento: <span className="font-medium text-white">{resource.events.title}</span>
              </span>
            )}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/recursos">
              <Button variant="secondary" className="bg-white text-gray-900 hover:bg-white/90">
                Ver todos los recursos
              </Button>
            </Link>
            {resource.url && (
              <a href={resource.url} target="_blank" rel="noopener noreferrer">
                <Button className="btn-primary">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  {resource.resource_type === "article"
                    ? "Abrir fuente"
                    : resource.resource_type === "video"
                      ? "Ver video"
                      : resource.resource_type === "document"
                        ? "Ver documento"
                        : "Abrir enlace"}
                </Button>
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <main id="main" role="main" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <Card className="overflow-hidden">
              {resource.file_path ? (
                <div className="h-52 sm:h-64 bg-gray-100">
                  <img
                    src={resource.file_path || "/placeholder.svg?height=300&width=1200&query=resource cover image"}
                    alt={`Imagen de ${resource.title}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="h-40 sm:h-48 bg-gradient-to-br from-brand-primary/15 to-brand-secondary/15 flex items-center justify-center">
                  <Icon className="h-12 w-12 text-white opacity-80" />
                </div>
              )}
              <CardContent className="prose max-w-none prose-p:text-gray-700">
                {resource.description ? (
                  <div aria-label="Contenido del recurso" dangerouslySetInnerHTML={{ __html: resource.description }} />
                ) : (
                  <p className="text-gray-600">Este recurso no tiene descripción.</p>
                )}
              </CardContent>
            </Card>
          </div>
          <aside className="lg:col-span-4">
            <Card>
              <CardHeader>
                <CardTitle>Información</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Tipo</span>
                  <Badge variant="secondary">{getResourceTypeLabel(resource.resource_type)}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Publicado</span>
                  <span>{formatDate(resource.created_at)}</span>
                </div>
                {resource.events?.title && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Evento</span>
                    <span className="font-medium">{resource.events.title}</span>
                  </div>
                )}
                {resource.url && (
                  <div className="pt-2">
                    <a href={resource.url} target="_blank" rel="noopener noreferrer" className="w-full block">
                      <Button className="w-full btn-primary">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Abrir fuente externa
                      </Button>
                    </a>
                  </div>
                )}
                <div className="pt-2 grid grid-cols-1 gap-2">
                  <Button variant="outline" className="w-full bg-transparent">
                    <Share2 className="h-4 w-4 mr-2" />
                    Compartir
                  </Button>
                  {(resource.resource_type === "document" || resource.resource_type === "template") && (
                    <Button variant="outline" className="w-full bg-transparent">
                      <Download className="h-4 w-4 mr-2" />
                      Descargar
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>
    </div>
  )
}
