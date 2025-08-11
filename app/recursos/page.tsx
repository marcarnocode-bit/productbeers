import Link from "next/link"
import { fetchResourcesPage, fetchResourceTypeCounts, type ResourceRow } from "@/lib/queries"
import { Pagination } from "@/components/pagination"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Search } from "lucide-react"
import { cn } from "@/lib/utils"

type PageProps = {
  searchParams: {
    q?: string
    type?: ResourceRow["resource_type"] | "all"
    page?: string
    pageSize?: string
  }
}

const TYPE_LABEL: Record<string, string> = {
  document: "Documento",
  video: "Vídeo",
  link: "Enlace",
  template: "Plantilla",
  article: "Artículo",
}

function buildHref(basePath: string, params: Record<string, string | number | undefined>) {
  const qs = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "" && value !== null) qs.set(key, String(value))
  })
  const query = qs.toString()
  return query ? `${basePath}?${query}` : basePath
}

export default async function RecursosPage({ searchParams }: PageProps) {
  const q = searchParams.q ?? ""
  const type = (searchParams.type ?? "all") as PageProps["searchParams"]["type"]
  const page = Math.max(1, Number(searchParams.page ?? "1") || 1)
  const pageSize = Math.min(30, Math.max(3, Number(searchParams.pageSize ?? "9") || 9))

  const [pageData, counts] = await Promise.all([
    fetchResourcesPage({ q, type, page, pageSize }),
    fetchResourceTypeCounts(q),
  ])

  const { items, total } = pageData

  const chips: Array<{ key: "all" | ResourceRow["resource_type"]; label: string; count: number }> = [
    { key: "all", label: "Todos", count: counts.all },
    { key: "article", label: TYPE_LABEL.article, count: counts.article },
    { key: "document", label: TYPE_LABEL.document, count: counts.document },
    { key: "video", label: TYPE_LABEL.video, count: counts.video },
    { key: "link", label: TYPE_LABEL.link, count: counts.link },
    { key: "template", label: TYPE_LABEL.template, count: counts.template },
  ]

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-brand-primary to-brand-secondary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">Recursos</h1>
            <p className="text-white/90">Artículos, guías y materiales para profesionales de producto.</p>
          </div>
        </div>
      </section>

      {/* Filters (GET) + Counters */}
      <section className="bg-white border-b sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-3">
          <form method="GET" className="grid gap-3 md:grid-cols-[1fr,auto]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                name="q"
                defaultValue={q}
                placeholder="Buscar recursos..."
                className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
              {/* Preserve current 'type' & pagination reset */}
              <input type="hidden" name="type" value={type ?? "all"} />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-md bg-brand-primary px-4 py-2 text-sm font-medium text-white hover:bg-brand-secondary"
              >
                Filtrar
              </button>
              <Link
                href="/recursos"
                className="inline-flex items-center justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                aria-label="Limpiar filtros"
              >
                Limpiar
              </Link>
            </div>
          </form>

          {/* Type chips with counters */}
          <div className="flex flex-wrap gap-2">
            {chips.map((chip) => {
              const isActive = (type ?? "all") === chip.key
              const href = buildHref("/recursos", { q, type: chip.key, page: 1, pageSize })
              return (
                <Link
                  key={chip.key}
                  href={href}
                  className={cn(
                    "inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm transition-colors",
                    isActive
                      ? "bg-brand-primary text-white border-brand-primary"
                      : "bg-white border-gray-300 text-gray-700 hover:bg-gray-100",
                  )}
                  aria-current={isActive ? "true" : undefined}
                >
                  <span>{chip.label}</span>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "px-2 py-0.5",
                      isActive ? "bg-white text-brand-primary" : "bg-gray-100 text-gray-800",
                    )}
                  >
                    {chip.count}
                  </Badge>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {items.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay recursos</h3>
            <p className="text-gray-600 mb-6">Prueba ajustar los filtros o vuelve más tarde.</p>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-md bg-brand-primary px-4 py-2 text-sm font-medium text-white hover:bg-brand-secondary"
            >
              Volver al inicio
            </Link>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-600 mb-6">
              Mostrando {items.length} de {total} resultados
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {items.map((r) => (
                <Link key={r.id} href={`/recursos/${r.id}`}>
                  <Card className="border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden">
                    <div className="h-40 bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 relative overflow-hidden">
                      {r.file_path ? (
                        <img
                          src={r.file_path || "/placeholder.svg"}
                          alt={r.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <BookOpen className="h-10 w-10 text-brand-primary opacity-70" />
                        </div>
                      )}
                    </div>
                    <CardHeader>
                      <Badge className="w-fit mb-2">{TYPE_LABEL[r.resource_type] ?? r.resource_type}</Badge>
                      <CardTitle className="text-xl font-semibold line-clamp-2">{r.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {r.description ?? "Recurso de la comunidad de Product Beers."}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            <Pagination
              total={total}
              page={page}
              pageSize={pageSize}
              basePath="/recursos"
              searchParams={{ q, type }}
              className="mt-10"
            />
          </>
        )}
      </section>
    </main>
  )
}
