import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, ArrowRight, Zap, Coffee, Trophy, Network } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchLatestResources, fetchUpcomingEvents } from "@/lib/queries"
import { EventsSection } from "@/components/home/events-section"
import { ResourcesSection } from "@/components/home/resources-section"

export default async function HomePage() {
  // Server-side fetch: upcoming, fallback to past if none
  const [events, resources] = await Promise.all([fetchUpcomingEvents(6, true), fetchLatestResources(3)])

  const features = [
    {
      icon: Coffee,
      title: "Networking auténtico",
      description: "Conecta con profesionales de producto en un ambiente cercano.",
    },
    { icon: Trophy, title: "Aprendizaje continuo", description: "Workshops y charlas con expertos de la industria." },
    {
      icon: Network,
      title: "Comunidad activa",
      description: "PMs, PO, UX, data y tecnología compartiendo experiencias.",
    },
    { icon: Zap, title: "Experiencias únicas", description: "Eventos pensados para aportar valor real a tu carrera." },
  ]

  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-brand-primary to-brand-secondary text-white overflow-hidden">
        <div className="container relative mx-auto px-4 py-20 sm:py-28 lg:py-32">
          <div className="max-w-3xl">
            

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 tracking-tight">
              Conecta, aprende y crece en Product Beers
            </h1>

            <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl">
              La comunidad de profesionales de producto digital: PMs, PO, UX, data y tecnología.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                className="bg-white text-brand-primary hover:bg-gray-100 shadow-lg shadow-black/10 ring-1 ring-black/5"
              >
                <Link href="/eventos">
                  Ver próximos eventos
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white/10 bg-transparent"
              >
                <Link href="/comunidad">Únete a la comunidad</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Ventajas de la comunidad</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Más que eventos, una red de profesionales compartiendo mejores prácticas.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden group"
              >
                <div className="absolute top-0 left-0 h-1 w-0 bg-brand-primary group-hover:w-full transition-all duration-500" />
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-brand-light rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-brand-primary/20 transition-colors duration-300">
                    <feature.icon className="w-8 h-8 text-brand-primary" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-900">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 text-center">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Events (DB-backed with fallback) */}
      <EventsSection events={events} />

      {/* Resources (DB-backed) */}
      <ResourcesSection resources={resources} />
    </>
  )
}
