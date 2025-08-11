import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Users, Globe, Search } from "lucide-react"
import { fetchAllEventsPage } from "@/lib/queries"
import { Pagination } from "@/components/pagination"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"

type PageProps = {
  searchParams: {
    q?: string
    type?: "virtual" | "presencial" | "all"
    page?: string
    pageSize?: string
  }
}

function buildHref(basePath: string, params: Record<string, string | number | undefined>) {
  const qs = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "" && value !== null) qs.set(key, String(value))
  })
  const query = qs.toString()
  return query ? `${basePath}?${query}` : basePath
}

export default async function EventosPage({ searchParams }: PageProps) {
  const q = searchParams.q ?? ""
  const type = (searchParams.type ?? "all") as "virtual" | "presencial" | "all"
  const page = Math.max(1, Number(searchParams.page ?? "1") || 1)
  const pageSize = Math.min(30, Math.max(3, Number(searchParams.pageSize ?? "9") || 9))

  const { items, total } = await fetchAllEventsPage({
    q,
    type,
    page,
    pageSize,
  })

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-brand-primary to-brand-secondary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="text-center">
            <h1 className="text-4xl font-bold">Eventos</h1>
            <p className="mt-4 text-xl text-white/90">
              Descubre todos nuestros eventos de la comunidad de producto digital
            </p>
          </div>
        </div>
      </section>

      {/* Filters (GET form for SSR) */}
      <section className="bg-white border-b sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <form method="GET" className="grid gap-3 md:grid-cols-[1fr,160px,auto]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                name="q"
                defaultValue={q}
                placeholder="Buscar eventos..."
                className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>

            <select
              name="type"
              defaultValue={type}
              className="rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-primary"
            >
              <option value="all">Todos</option>
              <option value="presencial">Presenciales</option>
              <option value="virtual">Virtuales</option>
            </select>

            <div className="flex gap-2">
              <Button type="submit" className="bg-brand-primary hover:bg-brand-secondary text-white">
                Filtrar
              </Button>
              <Link
                href="/eventos"
                className="inline-flex items-center justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                aria-label="Limpiar filtros"
              >
                Limpiar
              </Link>
            </div>
          </form>
        </div>
      </section>

      {/* Results */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {items.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
            <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay eventos</h3>
            <p className="text-gray-600 mb-6">Prueba ajustar los filtros o vuelve más tarde.</p>
            <Link href="/">
              <Button className="bg-brand-primary hover:bg-brand-secondary text-white">Volver al inicio</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-sm text-gray-600">
                Mostrando {items.length} de {total} eventos
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {items.map((event) => (
                <Card
                  key={event.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-200 flex flex-col group"
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
                    <div className="absolute top-4 right-4 flex gap-2">
                      <Badge
                        className={cn(
                          "font-medium",
                          event.isUpcoming
                            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-200",
                        )}
                      >
                        {event.isUpcoming ? "Próximo" : "Pasado"}
                      </Badge>
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
                    <p className="text-gray-600 line-clamp-2 mt-2">{event.description}</p>
                  </CardHeader>

                  <CardContent className="flex-grow space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4 text-brand-primary" />
                      <span>{format(new Date(event.start_date), "HH:mm", { locale: es })} hrs</span>
                    </div>

                    {event.location && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4 text-brand-primary" />
                        <span className="line-clamp-1">{event.location}</span>
                      </div>
                    )}

                    {event.is_virtual && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Globe className="h-4 w-4 text-brand-primary" />
                        <span>Evento virtual</span>
                      </div>
                    )}

                    {event.max_participants && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="h-4 w-4 text-brand-primary" />
                        <span>Máximo {event.max_participants} participantes</span>
                      </div>
                    )}
                  </CardContent>

                  <CardFooter className="pt-0">
                    <Link href={`/eventos/${event.id}`} className="w-full">
                      <Button
                        className={cn(
                          "w-full text-white",
                          event.isUpcoming
                            ? "bg-brand-primary hover:bg-brand-secondary"
                            : "bg-gray-600 hover:bg-gray-700",
                        )}
                      >
                        {event.isUpcoming ? "Ver detalles y registrarse" : "Ver detalles"}
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>

            <Pagination
              total={total}
              page={page}
              pageSize={pageSize}
              basePath="/eventos"
              searchParams={{ q, type }}
              className="mt-10"
            />
          </>
        )}
      </section>
    </main>
  )
}
