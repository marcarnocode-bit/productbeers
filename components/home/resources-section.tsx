"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen } from "lucide-react"

export type ResourcesSectionProps = {
  resources: {
    id: string
    title: string
    description: string | null
    url: string | null
    file_path: string | null
    resource_type: "document" | "video" | "link" | "template" | "article"
    created_at: string
  }[]
  title?: string
  ctaHref?: string
}

export function ResourcesSection({
  resources = [],
  title = "Biblioteca de conocimiento",
  ctaHref = "/recursos",
}: ResourcesSectionProps) {
  const typeStyles: Record<string, string> = {
    article: "bg-blue-100 text-blue-800",
    video: "bg-red-100 text-red-800",
    document: "bg-amber-100 text-amber-800",
    link: "bg-purple-100 text-purple-800",
    template: "bg-green-100 text-green-800",
  }

  return (
    <section className="py-20 px-4 bg-white">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{title}</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Accede a artículos, guías y recursos exclusivos para potenciar tu carrera en producto digital.
          </p>
        </div>

        {resources.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-8">
            {resources.map((r) => (
              <Link key={r.id} href={`/recursos/${r.id}`}>
                <Card className="border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden">
                  <div className="h-40 relative overflow-hidden">
                    {r.file_path ? (
                      <img
                        src={r.file_path || "/placeholder.svg"}
                        alt={r.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="h-full bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 flex items-center justify-center">
                        <BookOpen className="h-10 w-10 text-brand-primary opacity-70" />
                      </div>
                    )}
                  </div>
                  <CardHeader>
                    <Badge className={`w-fit mb-2 ${typeStyles[r.resource_type] || "bg-gray-100 text-gray-800"}`}>
                      {r.resource_type.charAt(0).toUpperCase() + r.resource_type.slice(1)}
                    </Badge>
                    <CardTitle className="text-xl font-semibold line-clamp-2">{r.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="line-clamp-3">
                      {r.description ?? "Recurso de la comunidad de Product Beers."}
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay recursos disponibles</h3>
            <p className="text-gray-600">Pronto publicaremos nuevos recursos de la comunidad.</p>
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            href={ctaHref}
            className="inline-flex items-center justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100"
          >
            Ver todos los recursos
          </Link>
        </div>
      </div>
    </section>
  )
}
