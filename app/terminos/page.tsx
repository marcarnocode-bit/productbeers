import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Scale, Shield, Users, AlertTriangle, FileText, Clock, Mail, Phone } from 'lucide-react'

export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-brand-primary to-brand-secondary text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-6">
              <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30 text-sm font-medium px-4 py-2">
                <Scale className="h-4 w-4 mr-2" />
                Información Legal
              </Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Términos y Condiciones
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Condiciones de uso de la plataforma Product Beers Valencia
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
                  <FileText className="h-5 w-5 mr-2 text-brand-primary" />
                  1. Introducción
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-text-secondary leading-relaxed">
                  Bienvenido a Product Beers Valencia ("nosotros", "nuestro" o "la plataforma"). 
                  Estos términos y condiciones ("Términos") rigen el uso de nuestro sitio web 
                  y servicios relacionados con eventos de networking y tecnología.
                </p>
                <p className="text-text-secondary leading-relaxed">
                  Al acceder y utilizar nuestros servicios, usted acepta estar sujeto a estos 
                  Términos. Si no está de acuerdo con alguna parte de estos términos, 
                  no debe utilizar nuestros servicios.
                </p>
              </CardContent>
            </Card>

            {/* Definitions */}
            <Card className="border-2 border-gray-200 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center text-text-primary">
                  <Users className="h-5 w-5 mr-2 text-brand-primary" />
                  2. Definiciones
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <strong className="text-text-primary">"Plataforma":</strong>
                    <span className="text-text-secondary ml-2">
                      Se refiere al sitio web y servicios de Product Beers Valencia.
                    </span>
                  </div>
                  <div>
                    <strong className="text-text-primary">"Usuario":</strong>
                    <span className="text-text-secondary ml-2">
                      Cualquier persona que acceda o utilice nuestros servicios.
                    </span>
                  </div>
                  <div>
                    <strong className="text-text-primary">"Evento":</strong>
                    <span className="text-text-secondary ml-2">
                      Cualquier actividad, meetup, conferencia o gathering organizado a través de la plataforma.
                    </span>
                  </div>
                  <div>
                    <strong className="text-text-primary">"Contenido":</strong>
                    <span className="text-text-secondary ml-2">
                      Información, textos, imágenes, videos y otros materiales disponibles en la plataforma.
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* User Accounts */}
            <Card className="border-2 border-gray-200 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center text-text-primary">
                  <Shield className="h-5 w-5 mr-2 text-brand-primary" />
                  3. Cuentas de Usuario
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-text-secondary leading-relaxed">
                  Para acceder a ciertas funciones de la plataforma, debe crear una cuenta. 
                  Usted es responsable de:
                </p>
                <ul className="list-disc list-inside space-y-2 text-text-secondary ml-4">
                  <li>Proporcionar información precisa y actualizada</li>
                  <li>Mantener la confidencialidad de sus credenciales</li>
                  <li>Notificar inmediatamente cualquier uso no autorizado</li>
                  <li>Ser responsable de todas las actividades en su cuenta</li>
                </ul>
                <div className="bg-warning-light border border-warning-DEFAULT rounded-lg p-4 mt-4">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-warning-dark mr-2 flex-shrink-0 mt-0.5" />
                    <p className="text-warning-dark text-sm">
                      <strong>Importante:</strong> No comparta sus credenciales con terceros. 
                      Product Beers no será responsable por pérdidas derivadas del uso no autorizado de su cuenta.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Use of Services */}
            <Card className="border-2 border-gray-200 shadow-md">
              <CardHeader>
                <CardTitle className="text-text-primary">4. Uso de los Servicios</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-text-secondary leading-relaxed">
                  Usted se compromete a utilizar nuestros servicios de manera responsable y legal. 
                  Está prohibido:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-text-primary">Actividades Prohibidas:</h4>
                    <ul className="list-disc list-inside space-y-1 text-text-secondary text-sm">
                      <li>Spam o contenido no solicitado</li>
                      <li>Comportamiento abusivo o acoso</li>
                      <li>Violación de derechos de propiedad intelectual</li>
                      <li>Actividades ilegales o fraudulentas</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-text-primary">Uso Apropiado:</h4>
                    <ul className="list-disc list-inside space-y-1 text-text-secondary text-sm">
                      <li>Networking profesional</li>
                      <li>Intercambio de conocimientos</li>
                      <li>Participación constructiva en eventos</li>
                      <li>Respeto hacia otros usuarios</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Events and Registration */}
            <Card className="border-2 border-gray-200 shadow-md">
              <CardHeader>
                <CardTitle className="text-text-primary">5. Eventos y Registro</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-text-primary mb-2">Registro a Eventos</h4>
                    <p className="text-text-secondary text-sm leading-relaxed">
                      El registro a eventos está sujeto a disponibilidad. Nos reservamos el derecho 
                      de cancelar o modificar eventos por circunstancias imprevistas.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-primary mb-2">Política de Cancelación</h4>
                    <p className="text-text-secondary text-sm leading-relaxed">
                      Los usuarios pueden cancelar su registro hasta 24 horas antes del evento. 
                      Las cancelaciones de último momento pueden resultar en restricciones futuras.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-primary mb-2">Comportamiento en Eventos</h4>
                    <p className="text-text-secondary text-sm leading-relaxed">
                      Se espera un comportamiento profesional y respetuoso en todos los eventos. 
                      El incumplimiento puede resultar en expulsión y prohibición de eventos futuros.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Intellectual Property */}
            <Card className="border-2 border-gray-200 shadow-md">
              <CardHeader>
                <CardTitle className="text-text-primary">6. Propiedad Intelectual</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-text-secondary leading-relaxed">
                  Todo el contenido de la plataforma, incluyendo textos, gráficos, logos, 
                  imágenes y software, está protegido por derechos de autor y otras leyes 
                  de propiedad intelectual.
                </p>
                <div className="bg-info-light border border-info-DEFAULT rounded-lg p-4">
                  <h4 className="font-semibold text-info-dark mb-2">Contenido del Usuario</h4>
                  <p className="text-info-dark text-sm">
                    Al subir contenido a la plataforma, usted otorga a Product Beers una 
                    licencia no exclusiva para usar, mostrar y distribuir dicho contenido 
                    en relación con nuestros servicios.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Privacy and Data */}
            <Card className="border-2 border-gray-200 shadow-md">
              <CardHeader>
                <CardTitle className="text-text-primary">7. Privacidad y Datos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-text-secondary leading-relaxed">
                  El tratamiento de sus datos personales se rige por nuestra Política de Privacidad, 
                  que forma parte integral de estos Términos.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-text-primary">Datos Recopilados:</h4>
                    <ul className="list-disc list-inside space-y-1 text-text-secondary text-sm">
                      <li>Información de perfil</li>
                      <li>Historial de eventos</li>
                      <li>Preferencias de usuario</li>
                      <li>Datos de uso de la plataforma</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-text-primary">Sus Derechos:</h4>
                    <ul className="list-disc list-inside space-y-1 text-text-secondary text-sm">
                      <li>Acceso a sus datos</li>
                      <li>Rectificación de información</li>
                      <li>Eliminación de cuenta</li>
                      <li>Portabilidad de datos</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Liability */}
            <Card className="border-2 border-gray-200 shadow-md">
              <CardHeader>
                <CardTitle className="text-text-primary">8. Limitación de Responsabilidad</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-text-secondary leading-relaxed">
                  Product Beers proporciona la plataforma "tal como está" y no garantiza 
                  que esté libre de errores o interrupciones.
                </p>
                <div className="bg-error-light border border-error-DEFAULT rounded-lg p-4">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-error-dark mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-error-dark mb-1">Exención de Responsabilidad</h4>
                      <p className="text-error-dark text-sm">
                        No seremos responsables por daños indirectos, incidentales o 
                        consecuentes derivados del uso de nuestros servicios.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Modifications */}
            <Card className="border-2 border-gray-200 shadow-md">
              <CardHeader>
                <CardTitle className="text-text-primary">9. Modificaciones</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-text-secondary leading-relaxed">
                  Nos reservamos el derecho de modificar estos Términos en cualquier momento. 
                  Los cambios entrarán en vigor inmediatamente después de su publicación.
                </p>
                <p className="text-text-secondary leading-relaxed">
                  Es su responsabilidad revisar periódicamente estos Términos. 
                  El uso continuado de nuestros servicios constituye aceptación de los cambios.
                </p>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card className="border-2 border-gray-200 shadow-md">
              <CardHeader>
                <CardTitle className="text-text-primary">10. Contacto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-text-secondary leading-relaxed">
                  Si tiene preguntas sobre estos Términos y Condiciones, puede contactarnos:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-brand-primary" />
                    <div>
                      <p className="font-medium text-text-primary">Email</p>
                      <a href="mailto:legal@productbeers.com" className="text-brand-primary hover:underline">
                        legal@productbeers.com
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

            {/* New Content */}
            <div className="container mx-auto px-4 py-8 prose prose-amber max-w-3xl">
              <h2>Uso Aceptable</h2>
              <ul>
                <li>No uses la plataforma para actividades ilegales.</li>
                <li>Respeta a otros usuarios.</li>
              </ul>
              <h2>Responsabilidad</h2>
              <p>La plataforma se ofrece “tal cual”. Nos esforzamos por mantenerla disponible y segura.</p>
              <p>Última actualización: {new Date().toLocaleDateString("es-ES")}</p>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}
