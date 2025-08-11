import Link from "next/link"
import { Facebook, Twitter, Linkedin, Instagram, Mail, MapPin, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-2">Únete a nuestra newsletter</h2>
            <p className="text-gray-400 mb-6">Recibe información sobre eventos, recursos y novedades de la comunidad</p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Tu email"
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-brand-primary"
                required
              />
              <Button type="submit" className="bg-brand-primary hover:bg-brand-secondary text-white">
                Suscribirme
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 font-bold mb-4">
              <div className="rounded-md bg-brand-primary p-1.5 text-white">
                <span className="text-xl">🍺</span>
              </div>
              <span className="text-xl">Product Beers</span>
            </div>
            <p className="text-gray-400 text-sm">
              Comunidad de profesionales de producto que comparten conocimiento, experiencias y networking en un
              ambiente distendido.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="text-gray-400 hover:text-brand-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="text-gray-400 hover:text-brand-primary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="text-gray-400 hover:text-brand-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="text-gray-400 hover:text-brand-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Navigation Column */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Navegación</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/eventos" className="text-gray-400 hover:text-brand-primary transition-colors">
                  Eventos
                </Link>
              </li>
              <li>
                <Link href="/comunidad" className="text-gray-400 hover:text-brand-primary transition-colors">
                  Comunidad
                </Link>
              </li>
              <li>
                <Link href="/recursos" className="text-gray-400 hover:text-brand-primary transition-colors">
                  Recursos
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/terminos" className="text-gray-400 hover:text-brand-primary transition-colors">
                  Términos y Condiciones
                </Link>
              </li>
              <li>
                <Link href="/privacidad" className="text-gray-400 hover:text-brand-primary transition-colors">
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-gray-400 hover:text-brand-primary transition-colors">
                  Política de Cookies
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Mail className="h-5 w-5 text-brand-primary mr-2 mt-0.5" />
                <a
                  href="mailto:hola@productbeers.com"
                  className="text-gray-400 hover:text-brand-primary transition-colors"
                >
                  hola@productbeers.com
                </a>
              </li>
              <li className="flex items-start">
                <Phone className="h-5 w-5 text-brand-primary mr-2 mt-0.5" />
                <a href="tel:+34600000000" className="text-gray-400 hover:text-brand-primary transition-colors">
                  +34 600 000 000
                </a>
              </li>
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-brand-primary mr-2 mt-0.5" />
                <span className="text-gray-400">Valencia, España</span>
              </li>
              <li className="pt-2">
                <Link
                  href="/contacto"
                  className="text-brand-primary hover:text-brand-secondary transition-colors font-medium"
                >
                  Formulario de contacto →
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">© {currentYear} Product Beers. Todos los derechos reservados.</p>
            <div className="flex items-center gap-4 text-sm">
              <Link href="/privacidad" className="text-gray-500 hover:text-brand-primary transition-colors">
                Privacidad
              </Link>
              <span className="text-gray-700">•</span>
              <Link href="/cookies" className="text-gray-500 hover:text-brand-primary transition-colors">
                Cookies
              </Link>
              <span className="text-gray-700">•</span>
              <Link href="/terminos" className="text-gray-500 hover:text-brand-primary transition-colors">
                Términos
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
