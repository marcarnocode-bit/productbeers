import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Cookie, Settings, BarChart3, Target, Shield, Clock, Mail, Phone, ExternalLink } from 'lucide-react'

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-brand-primary to-brand-secondary text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-6">
              <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30 text-sm font-medium px-4 py-2">
                <Cookie className="h-4 w-4 mr-2" />
                Gestión de Cookies
              </Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Política de Cookies
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Información sobre el uso de cookies y tecnologías similares en nuestra plataforma
            </p>
            <div className="flex items-center justify-center mt-6 text-white/80">
              <Clock className="h-4 w-4 mr-2" />
              <span>Última actualización: {new Date().toLocaleDateString('es-ES')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            
            {/* Introduction */}
            <Card className="border-2 border-gray-200 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center text-text-primary">
                  <Cookie className="h-5 w-5 mr-2 text-brand-primary" />
                  ¿Qué son las Cookies?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-text-secondary leading-relaxed">
                  Las cookies son pequeños archivos de texto que se almacenan en su dispositivo 
                  cuando visita un sitio web. Nos ayudan a mejorar su experiencia, recordar sus 
                  preferencias y proporcionar funcionalidades personalizadas.
                </p>
                <p className="text-text-secondary leading-relaxed">
                  En Product Beers Valencia utilizamos cookies de manera responsable y transparente, 
                  cumpliendo con la normativa europea de protección de datos.
                </p>
              </CardContent>
            </Card>

            {/* Cookie Types */}
            <Card className="border-2 border-gray-200 shadow-md">
              <CardHeader>
                <CardTitle className="text-text-primary">Tipos de Cookies que Utilizamos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Essential Cookies */}
                <div className="border-l-4 border-success-DEFAULT pl-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-text-primary flex items-center">
                      <Shield className="h-4 w-4 mr-2 text-success-DEFAULT" />
                      Cookies Esenciales
                    </h4>
                    <Badge className="bg-success-light text-success-dark border-success-DEFAULT">
                      Siempre Activas
                    </Badge>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">
                    Estas cookies son necesarias para el funcionamiento básico del sitio web 
                    y no se pueden desactivar.
                  </p>
                  <div className="bg-success-light/30 rounded-lg p-3">
                    <h5 className="font-medium text-success-dark mb-2">Funciones:</h5>
                    <ul className="list-disc list-inside space-y-1 text-success-dark text-sm">
                      <li>Autenticación de usuario</li>
                      <li>Seguridad de la sesión</li>
                      <li>Preferencias de idioma</li>
                      <li>Carrito de compras (si aplica)</li>
                    </ul>
                  </div>
                </div>

                {/* Functional Cookies */}
                <div className="border-l-4 border-info-DEFAULT pl-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-text-primary flex items-center">
                      <Settings className="h-4 w-4 mr-2 text-info-DEFAULT" />
                      Cookies Funcionales
                    </h4>
                    <div className="flex items-center space-x-2">
                      <Switch id="functional-cookies" />
                      <label htmlFor="functional-cookies" className="text-sm text-text-secondary">
                        Activar
                      </label>
                    </div>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">
                    Mejoran la funcionalidad del sitio web y permiten personalizar su experiencia.
                  </p>
                  <div className="bg-info-light/30 rounded-lg p-3">
                    <h5 className="font-medium text-info-dark mb-2">Funciones:</h5>
                    <ul className="list-disc list-inside space-y-1 text-info-dark text-sm">
                      <li>Recordar preferencias de usuario</li>
                      <li>Configuraciones de accesibilidad</li>
                      <li>Personalización de interfaz</li>
                      <li>Funciones de chat en vivo</li>
                    </ul>
                  </div>
                </div>

                {/* Analytics Cookies */}
                <div className="border-l-4 border-warning-DEFAULT pl-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-text-primary flex items-center">
                      <BarChart3 className="h-4 w-4 mr-2 text-warning-DEFAULT" />
                      Cookies Analíticas
                    </h4>
                    <div className="flex items-center space-x-2">
                      <Switch id="analytics-cookies" />
                      <label htmlFor="analytics-cookies" className="text-sm text-text-secondary">
                        Activar
                      </label>
                    </div>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">
                    Nos ayudan a entender cómo los usuarios interactúan con nuestro sitio web.
                  </p>
                  <div className="bg-warning-light/30 rounded-lg p-3">
                    <h5 className="font-medium text-warning-dark mb-2">Funciones:</h5>
                    <ul className="list-disc list-inside space-y-1 text-warning-dark text-sm">
                      <li>Google Analytics</li>
                      <li>Estadísticas de uso</li>
                      <li>Análisis de rendimiento</li>
                      <li>Métricas de eventos</li>
                    </ul>
                  </div>
                </div>

                {/* Marketing Cookies */}
                <div className="border-l-4 border-error-DEFAULT pl-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-text-primary flex items-center">
                      <Target className="h-4 w-4 mr-2 text-error-DEFAULT" />
                      Cookies de Marketing
                    </h4>
                    <div className="flex items-center space-x-2">
                      <Switch id="marketing-cookies" />
                      <label htmlFor="marketing-cookies" className="text-sm text-text-secondary">
                        Activar
                      </label>
                    </div>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">
                    Se utilizan para mostrar anuncios relevantes y medir la efectividad de campañas.
                  </p>
                  <div className="bg-error-light/30 rounded-lg p-3">
                    <h5 className="font-medium text-error-dark mb-2">Funciones:</h5>
                    <ul className="list-disc list-inside space-y-1 text-error-dark text-sm">
                      <li>Publicidad personalizada</li>
                      <li>Retargeting</li>
                      <li>Redes sociales</li>
                      <li>Seguimiento de conversiones</li>
                    </ul>
                  </div>
                </div>

              </CardContent>
            </Card>

            {/* Cookie Details */}
            <Card className="border-2 border-gray-200 shadow-md">
              <CardHeader>
                <CardTitle className="text-text-primary">Cookies Específicas que Utilizamos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-2 font-semibold text-text-primary">Nombre</th>
                        <th className="text-left py-3 px-2 font-semibold text-text-primary">Propósito</th>
                        <th className="text-left py-3 px-2 font-semibold text-text-primary">Duración</th>
                        <th className="text-left py-3 px-2 font-semibold text-text-primary">Tipo</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="py-3 px-2 font-medium">supabase-auth-token</td>
                        <td className="py-3 px-2 text-text-secondary">Autenticación de usuario</td>
                        <td className="py-3 px-2 text-text-secondary">1 hora</td>
                        <td className="py-3 px-2">
                          <Badge className="bg-success-light text-success-dark border-success-DEFAULT text-xs">
                            Esencial
                          </Badge>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 px-2 font-medium">cookie-preferences</td>
                        <td className="py-3 px-2 text-text-secondary">Preferencias de cookies</td>
                        <td className="py-3 px-2 text-text-secondary">1 año</td>
                        <td className="py-3 px-2">
                          <Badge className="bg-info-light text-info-dark border-info-DEFAULT text-xs">
                            Funcional
                          </Badge>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 px-2 font-medium">_ga</td>
                        <td className="py-3 px-2 text-text-secondary">Google Analytics - ID único</td>
                        <td className="py-3 px-2 text-text-secondary">2 años</td>
                        <td className="py-3 px-2">
                          <Badge className="bg-warning-light text-warning-dark border-warning-DEFAULT text-xs">
                            Analítica
                          </Badge>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 px-2 font-medium">_ga_*</td>
                        <td className="py-3 px-2 text-text-secondary">Google Analytics - Estado de sesión</td>
                        <td className="py-3 px-2 text-text-secondary">2 años</td>
                        <td className="py-3 px-2">
                          <Badge className="bg-warning-light text-warning-dark border-warning-DEFAULT text-xs">
                            Analítica
                          </Badge>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 px-2 font-medium">_fbp</td>
                        <td className="py-3 px-2 text-text-secondary">Facebook Pixel</td>
                        <td className="py-3 px-2 text-text-secondary">3 meses</td>
                        <td className="py-3 px-2">
                          <Badge className="bg-error-light text-error-dark border-error-DEFAULT text-xs">
                            Marketing
                          </Badge>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Third Party Services */}
            <Card className="border-2 border-gray-200 shadow-md">
              <CardHeader>
                <CardTitle className="text-text-primary">Servicios de Terceros</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-text-secondary leading-relaxed">
                  Utilizamos servicios de terceros que pueden establecer sus propias cookies. 
                  Estos servicios tienen sus propias políticas de privacidad:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-text-primary mb-2">Google Analytics</h4>
                    <p className="text-text-secondary text-sm mb-3">
                      Análisis de tráfico web y comportamiento de usuarios
                    </p>
                    <a 
                      href="https://policies.google.com/privacy" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-brand-primary hover:underline text-sm flex items-center"
                    >
                      Ver política de privacidad
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-text-primary mb-2">Supabase</h4>
                    <p className="text-text-secondary text-sm mb-3">
                      Base de datos y autenticación de usuarios
                    </p>
                    <a 
                      href="https://supabase.com/privacy" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-brand-primary hover:underline text-sm flex items-center"
                    >
                      Ver política de privacidad
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-text-primary mb-2">Vercel</h4>
                    <p className="text-text-secondary text-sm mb-3">
                      Hosting y análisis de rendimiento
                    </p>
                    <a 
                      href="https://vercel.com/legal/privacy-policy" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-brand-primary hover:underline text-sm flex items-center"
                    >
                      Ver política de privacidad
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-text-primary mb-2">Mailchimp</h4>
                    <p className="text-text-secondary text-sm mb-3">
                      Email marketing y newsletters
                    </p>
                    <a 
                      href="https://mailchimp.com/legal/privacy/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-brand-primary hover:underline text-sm flex items-center"
                    >
                      Ver política de privacidad
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cookie Management */}
            <Card className="border-2 border-gray-200 shadow-md">
              <CardHeader>
                <CardTitle className="text-text-primary">Gestión de Cookies</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-text-secondary leading-relaxed">
                  Puede gestionar sus preferencias de cookies de las siguientes maneras:
                </p>
                <div className="space-y-4">
                  <div className="bg-brand-primary/5 border border-brand-primary/20 rounded-lg p-4">
                    <h4 className="font-semibold text-brand-primary mb-2">Panel de Preferencias</h4>
                    <p className="text-text-secondary text-sm mb-3">
                      Use nuestro panel de configuración para activar o desactivar tipos específicos de cookies.
                    </p>
                    <Button className="bg-brand-primary hover:bg-brand-secondary text-white">
                      Configurar Cookies
                    </Button>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-text-primary mb-2">Configuración del Navegador</h4>
                    <p className="text-text-secondary text-sm mb-3">
                      Puede configurar su navegador para rechazar cookies o alertarle cuando se envíen cookies.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                      <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline">
                        Chrome
                      </a>
                      <a href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop" target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline">
                        Firefox
                      </a>
                      <a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline">
                        Safari
                      </a>
                      <a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline">
                        Edge
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Consent */}
            <Card className="border-2 border-gray-200 shadow-md">
              <CardHeader>
                <CardTitle className="text-text-primary">Consentimiento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-text-secondary leading-relaxed">
                  El consentimiento se solicita al acceder por primera vez y puede revocarse en cualquier momento.
                </p>
              </CardContent>
            </Card>

            {/* Impact of Disabling */}
            <Card className="border-2 border-gray-200 shadow-md">
              <CardHeader>
                <CardTitle className="text-text-primary">Impacto de Desactivar Cookies</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-text-secondary leading-relaxed">
                  Desactivar ciertos tipos de cookies puede afectar su experiencia en nuestro sitio web:
                </p>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-error-DEFAULT rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium text-text-primary">Cookies Esenciales</h4>
                      <p className="text-text-secondary text-sm">
                        No se pueden desactivar. Sin ellas, el sitio web no funcionará correctamente.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-warning-DEFAULT rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium text-text-primary">Cookies Funcionales</h4>
                      <p className="text-text-secondary text-sm">
                        Perderá funcionalidades como recordar preferencias y configuraciones personalizadas.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-info-DEFAULT rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium text-text-primary">Cookies Analíticas</h4>
                      <p className="text-text-secondary text-sm">
                        No podremos mejorar el sitio web basándonos en datos de uso anónimos.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-success-DEFAULT rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium text-text-primary">Cookies de Marketing</h4>
                      <p className="text-text-secondary text-sm">
                        Verá anuncios menos relevantes y no podremos medir la efectividad de nuestras campañas.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card className="border-2 border-gray-200 shadow-md">
              <CardHeader>
                <CardTitle className="text-text-primary">Contacto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-text-secondary leading-relaxed">
                  Si tiene preguntas sobre nuestra Política de Cookies, puede contactarnos:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-brand-primary" />
                    <div>
                      <p className="font-medium text-text-primary">Email</p>
                      <a href="mailto:cookies@productbeers.com" className="text-brand-primary hover:underline">
                        cookies@productbeers.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-brand-primary" />
                    <div>
                      <p className="font-medium text-text-primary">Teléfono</p>
                      <a href="tel:+34600000000" className="text-brand-primary hover:underline">
                        +34 600 000 000
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </section>
    </div>
  )
}
