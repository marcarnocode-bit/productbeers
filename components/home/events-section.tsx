"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, Users } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"

export type EventsSectionProps = {
  events: {
    id: string
    title: string
    description: string | null
    start_date: string
    end_date: string | null
    location: string | null
    is_virtual: boolean
    image_url: string | null
    max_participants: number | null
    status: string
  }[]
}

export function EventsSection({ events = [] }: EventsSectionProps) {
  const [activeTab, setActiveTab] = useState("todos")

  const filtered = useMemo(() => {
    if (activeTab === "todos") return events
    if (activeTab === "presenciales") return events.filter((e) => !e.is_virtual)
    if (activeTab === "virtuales") return events.filter((e) => e.is_virtual)
    return events
  }, [events, activeTab])

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Eventos</h2>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <div className="flex justify-center">
            <TabsList className="bg-gray-100">
              <TabsTrigger value="todos" className="data-[state=active]:bg-white">
                Todos
              </TabsTrigger>
              <TabsTrigger value="presenciales" className="data-[state=active]:bg-white">
                Presenciales
              </TabsTrigger>
              <TabsTrigger value="virtuales" className="data-[state=active]:bg-white">
                Virtuales
              </TabsTrigger>
            </TabsList>
          </div>
        </Tabs>

        {filtered.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {filtered.slice(0, 6).map((event) => (
                <Card
                  key={event.id}
                  className="border border-gray-200 hover:border-brand-primary/30 hover:shadow-lg transition-all duration-300 overflow-hidden group flex flex-col h-full"
                >
                  <div className="h-48 bg-gradient-to-br from-gray-800 to-gray-700 relative overflow-hidden">
                    {event.image_url ? (
                      <img
                        src={event.image_url || "/placeholder.svg?height=300&width=600&query=tech%20event"}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20">
                        <Calendar className="h-16 w-16 text-brand-primary/40" />
                      </div>
                    )}
                    <div className="absolute top-4 right-4">
                      <Badge
                        className={cn(
                          "font-medium",
                          event.is_virtual
                            ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                            : "bg-green-100 text-green-800 hover:bg-green-200",
                        )}
                      >
                        {event.is_virtual ? "Virtual" : "Presencial"}
                      </Badge>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      <div className="flex items-center text-white gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-brand-primary" />
                        <span>{format(new Date(event.start_date), "d MMM, yyyy", { locale: es })}</span>
                      </div>
                    </div>
                  </div>

                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-gray-900 group-hover:text-brand-primary transition-colors line-clamp-2">
                      {event.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2 mt-2">{event.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="flex-grow space-y-3">
                    <div className="flex items-center text-gray-600 gap-2 text-sm">
                      <Clock className="h-4 w-4 text-brand-primary" />
                      <span>{format(new Date(event.start_date), "HH:mm", { locale: es })} hrs</span>
                    </div>
                    <div className="flex items-center text-gray-600 gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-brand-primary" />
                      <span className="line-clamp-1">
                        {event.is_virtual ? "Online" : (event.location ?? "Por anunciar")}
                      </span>
                    </div>
                    {event.max_participants && (
                      <div className="flex items-center text-gray-600 gap-2 text-sm">
                        <Users className="h-4 w-4 text-brand-primary" />
                        <span>Máximo {event.max_participants} participantes</span>
                      </div>
                    )}
                  </CardContent>

                  <CardFooter className="pt-0">
                    <Button asChild className="w-full bg-brand-primary hover:bg-brand-secondary text-white">
                      <Link href={`/eventos/${event.id}`}>Ver detalles</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Button asChild variant="outline" size="lg" className="group bg-transparent">
                <Link href="/eventos">Ver todos los eventos</Link>
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-12 bg-gray-100 rounded-lg">
            <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay eventos disponibles</h3>
            <p className="text-gray-600 mb-6">Actualmente no hay eventos publicados. ¡Vuelve pronto!</p>
            <Button asChild className="bg-brand-primary hover:bg-brand-secondary text-white">
              <Link href="/comunidad">Explorar la comunidad</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
