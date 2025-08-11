import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Shield, Lock, Eye, Database, UserCheck, Settings, AlertTriangle, Clock, Mail, Phone } from 'lucide-react'

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-brand-primary to-brand-secondary text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-6">
              <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30 text-sm font-medium px-4 py-2">
                <Shield className="h-4 w-4 mr-2" />
                Privacidad y Protección de Datos
              </Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Política de Privacidad
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Cómo recopilamos, utilizamos y protegemos su información personal
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
                  <Shield className="h-5 w-5 mr-2 text-brand-primary" />
                  1. Introducción
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-text-secondary leading-relaxed">
                  En Product Beers Valencia, respetamos su privacidad y nos comprometemos a proteger 
                  sus datos personales. Esta Política de Privacidad explica cómo recopilamos, 
                  utilizamos, almacenamos y protegemos su información.
                </p>
                <p className="text-text-secondary leading-relaxed">
                  Esta política cumple con el Reglamento General de Protección de Datos (GDPR) 
                  y la Ley Orgánica de Protección de Datos Personales y garantía de los derechos digitales (LOPDGDD).
                </p>
              </CardContent>
            </Card>

            {/* Data Controller */}
            <Card className="border-2 border-gray-200 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center text-text-primary">
                  <UserCheck className="h-5 w-5 mr-2 text-brand-primary" />
                  2. Responsable del Tratamiento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-info-light border border-info-DEFAULT rounded-lg p-4">
                  <h4 className="font-semibold text-info-dark mb-2">Product Beers Valencia</h4>
                  <div className="space-y-1 text-info-dark text-sm">
                    <p><strong>Email:</strong> privacidad@productbeers.com</p>
                    <p><strong>Dirección:</strong> Valencia, España</p>
                    <p><strong>Teléfono:</strong> +34 600 000 000</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Collection */}
            <Card className="border-2 border-gray-200 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center text-text-primary">
                  <Database className="h-5 w-5 mr-2 text-brand-primary" />
                  3. Datos que Recopilamos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-text-primary mb-3">Datos de Identificación</h4>
                    <ul className="list-disc list-inside space-y-1 text-text-secondary text-sm">
                      <li>Nombre completo</li>
                      <li>Dirección de email</li>
                      <li>Número de teléfono (opcional)</li>
                      <li>Foto de perfil (opcional)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-primary mb-3">Datos Profesionales</h4>
                    <ul className="list-disc list-inside space-y-1 text-text-secondary text-sm">
                      <li>Empresa y posición</li>
                      <li>Habilidades e intereses</li>
                      <li>Enlaces a redes sociales</li>
                      <li>Biografía profesional</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-primary mb-3">Datos de Uso</h4>
                    <ul className="list-disc list-inside space-y-1 text-text-secondary text-sm">
                      <li>Historial de eventos</li>
                      <li>Preferencias de usuario</li>
                      <li>Interacciones en la plataforma</li>
                      <li>Datos de navegación</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-primary mb-3">Datos Técnicos</h4>
                    <ul className="list-disc list-inside space-y-1 text-text-secondary text-sm">
                      <li>Dirección IP</li>
                      <li>Tipo de navegador</li>
                      <li>Sistema operativo</li>
                      <li>Cookies y tecnologías similares</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Legal Basis */}
            <Card className="border-2 border-gray-200 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center text-text-primary">
                  <Lock className="h-5 w-5 mr-2 text-brand-primary" />
                  4. Base Legal del Tratamiento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="border-l-4 border-brand-primary pl-4">
                    <h4 className="font-semibold text-text-primary mb-1">Consentimiento</h4>
                    <p className="text-text-secondary text-sm">
                      Para el envío de newsletters, comunicaciones promocionales y funciones opcionales.
                    </p>
                  </div>
                  <div className="border-l-4 border-success-DEFAULT pl-4">
                    <h4 className="font-semibold text-text-primary mb-1">Ejecución de Contrato</h4>
                    <p className="text-text-secondary text-sm">
                      Para proporcionar nuestros servicios, gestionar su cuenta y procesar registros a eventos.
                    </p>
                  </div>
                  <div className="border-l-4 border-info-DEFAULT pl-4">
                    <h4 className="font-semibold text-text-primary mb-1">Interés Legítimo</h4>
                    <p className="text-text-secondary text-sm">
                      Para mejorar nuestros servicios, análisis de uso y seguridad de la plataforma.
                    </p>
                  </div>
                  <div className="border-l-4 border-warning-DEFAULT pl-4">
                    <h4 className="font-semibold text-text-primary mb-1">Obligación Legal</h4>
                    <p className="text-text-secondary text-sm">
                      Para cumplir con requisitos legales, fiscales y de auditoría.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Usage */}
            <Card className="border-2 border-gray-200 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center text-text-primary">
                  <Settings className="h-5 w-5 mr-2 text-brand-primary" />
                  5. Cómo Utilizamos sus Datos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-text-primary">Servicios Principales:</h4>
                    <ul className="list-disc list-inside space-y-1 text-text-secondary text-sm">
                      <li>Gestión de cuenta de usuario</li>
                      <li>Registro y participación en eventos</li>
                      <li>Facilitación de networking</li>
                      <li>Comunicaciones relacionadas con eventos</li>
                      <li>Soporte técnico y atención al cliente</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-text-primary">Mejoras y Análisis:</h4>
                    <ul className="list-disc list-inside space-y-1 text-text-secondary text-sm">
                      <li>Análisis de uso de la plataforma</li>
                      <li>Mejora de funcionalidades</li>
                      <li>Personalización de contenido</li>
                      <li>Investigación y desarrollo</li>
                      <li>Prevención de fraude y seguridad</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Sharing */}
            <Card className="border-2 border-gray-200 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center text-text-primary">
                  <Eye className="h-5 w-5 mr-2 text-brand-primary" />
                  6. Compartir Datos con Terceros
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-text-secondary leading-relaxed">
                  No vendemos ni alquilamos sus datos personales. Solo compartimos información 
                  en las siguientes circunstancias:
                </p>
                <div className="space-y-4">
                  <div className="bg-success-light border border-success-DEFAULT rounded-lg p-4">
                    <h4 className="font-semibold text-success-dark mb-2">Proveedores de Servicios</h4>
                    <p className="text-success-dark text-sm">
                      Compartimos datos con proveedores que nos ayudan a operar la plataforma 
                      (hosting, análisis, email marketing) bajo estrictos acuerdos de confidencialidad.
                    </p>
                  </div>
                  <div className="bg-warning-light border border-warning-DEFAULT rounded-lg p-4">
                    <h4 className="font-semibold text-warning-dark mb-2">Requisitos Legales</h4>
                    <p className="text-warning-dark text-sm">
                      Podemos divulgar información cuando sea requerido por ley, orden judicial 
                      o para proteger nuestros derechos legales.
                    </p>
                  </div>
                  <div className="bg-info-light border border-info-DEFAULT rounded-lg p-4">
                    <h4 className="font-semibold text-info-dark mb-2">Networking Público</h4>
                    <p className="text-info-dark text-sm">
                      La información de perfil público es visible para otros usuarios 
                      según sus configuraciones de privacidad.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Security */}
            <Card className="border-2 border-gray-200 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center text-text-primary">
                  <Lock className="h-5 w-5 mr-2 text-brand-primary" />
                  7. Seguridad de los Datos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-text-secondary leading-relaxed">
                  Implementamos medidas técnicas y organizativas apropiadas para proteger 
                  sus datos personales contra acceso no autorizado, alteración, divulgación o destrucción.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-text-primary">Medidas Técnicas:</h4>
                    <ul className="list-disc list-inside space-y-1 text-text-secondary text-sm">
                      <li>Cifrado SSL/TLS</li>
                      <li>Autenticación segura</li>
                      <li>Firewalls y monitoreo</li>
                      <li>Copias de seguridad regulares</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-text-primary">Medidas Organizativas:</h4>
                    <ul className="list-disc list-inside space-y-1 text-text-secondary text-sm">
                      <li>Acceso limitado por roles</li>
                      <li>Formación en privacidad</li>
                      <li>Auditorías regulares</li>
                      <li>Políticas de seguridad</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Retention */}
            <Card className="border-2 border-gray-200 shadow-md">
              <CardHeader>
                <CardTitle className="text-text-primary">8. Retención de Datos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-text-secondary leading-relaxed">
                  Conservamos sus datos personales solo durante el tiempo necesario para 
                  los fines para los que fueron recopilados:
                </p>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-100 rounded-lg">
                    <span className="font-medium text-text-primary">Datos de cuenta activa</span>
                    <span className="text-text-secondary">Mientras la cuenta esté activa</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-100 rounded-lg">
                    <span className="font-medium text-text-primary">Datos de cuenta inactiva</span>
                    <span className="text-text-secondary">3 años después del último acceso</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-100 rounded-lg">
                    <span className="font-medium text-text-primary">Datos de marketing</span>
                    <span className="text-text-secondary">Hasta retirar el consentimiento</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-100 rounded-lg">
                    <span className="font-medium text-text-primary">Datos legales</span>
                    <span className="text-text-secondary">Según requisitos legales</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* User Rights */}
            <Card className="border-2 border-gray-200 shadow-md">
              <CardHeader>
                <CardTitle className="text-text-primary">9. Sus Derechos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-text-secondary leading-relaxed">
                  Bajo el GDPR y la LOPDGDD, usted tiene los siguientes derechos:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="border-l-4 border-brand-primary pl-3">
                      <h4 className="font-semibold text-text-primary">Derecho de Acceso</h4>
                      <p className="text-text-secondary text-sm">Solicitar una copia de sus datos personales</p>
                    </div>
                    <div className="border-l-4 border-success-DEFAULT pl-3">
                      <h4 className="font-semibold text-text-primary">Derecho de Rectificación</h4>
                      <p className="text-text-secondary text-sm">Corregir datos inexactos o incompletos</p>
                    </div>
                    <div className="border-l-4 border-error-DEFAULT pl-3">
                      <h4 className="font-semibold text-text-primary">Derecho de Supresión</h4>
                      <p className="text-text-secondary text-sm">Solicitar la eliminación de sus datos</p>
                    </div>
                    <div className="border-l-4 border-warning-DEFAULT pl-3">
                      <h4 className="font-semibold text-text-primary">Derecho de Limitación</h4>
                      <p className="text-text-secondary text-sm">Restringir el procesamiento de sus datos</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="border-l-4 border-info-DEFAULT pl-3">
                      <h4 className="font-semibold text-text-primary">Derecho de Portabilidad</h4>
                      <p className="text-text-secondary text-sm">Recibir sus datos en formato estructurado</p>
                    </div>
                    <div className="border-l-4 border-purple-500 pl-3">
                      <h4 className="font-semibold text-text-primary">Derecho de Oposición</h4>
                      <p className="text-text-secondary text-sm">Oponerse al procesamiento de sus datos</p>
                    </div>
                    <div className="border-l-4 border-pink-500 pl-3">
                      <h4 className="font-semibold text-text-primary">Retirar Consentimiento</h4>
                      <p className="text-text-secondary text-sm">Retirar el consentimiento en cualquier momento</p>
                    </div>
                    <div className="border-l-4 border-gray-500 pl-3">
                      <h4 className="font-semibold text-text-primary">Derecho de Reclamación</h4>
                      <p className="text-text-secondary text-sm">Presentar queja ante la autoridad de control</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cookies */}
            <Card className="border-2 border-gray-200 shadow-md">
              <CardHeader>
                <CardTitle className="text-text-primary">10. Cookies y Tecnologías Similares</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-text-secondary leading-relaxed">
                  Utilizamos cookies y tecnologías similares para mejorar su experiencia. 
                  Para más información, consulte nuestra Política de Cookies.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-text-primary">Cookies Esenciales:</h4>
                    <p className="text-text-secondary text-sm">
                      Necesarias para el funcionamiento básico de la plataforma
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-text-primary">Cookies Analíticas:</h4>
                    <p className="text-text-secondary text-sm">
                      Para entender cómo los usuarios interactúan con nuestro sitio
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* International Transfers */}
            <Card className="border-2 border-gray-200 shadow-md">
              <CardHeader>
                <CardTitle className="text-text-primary">11. Transferencias Internacionales</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-text-secondary leading-relaxed">
                  Algunos de nuestros proveedores de servicios pueden estar ubicados fuera del 
                  Espacio Económico Europeo (EEE). En estos casos, implementamos salvaguardas apropiadas:
                </p>
                <ul className="list-disc list-inside space-y-2 text-text-secondary ml-4">
                  <li>Cláusulas contractuales estándar aprobadas por la Comisión Europea</li>
                  <li>Certificaciones de adecuación (como Privacy Shield para EE.UU.)</li>
                  <li>Decisiones de adecuación de la Comisión Europea</li>
                </ul>
              </CardContent>
            </Card>

            {/* Children's Privacy */}
            <Card className="border-2 border-gray-200 shadow-md">
              <CardHeader>
                <CardTitle className="text-text-primary">12. Privacidad de Menores</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-warning-light border border-warning-DEFAULT rounded-lg p-4">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-warning-dark mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-warning-dark mb-1">Restricción de Edad</h4>
                      <p className="text-warning-dark text-sm">
                        Nuestros servicios están dirigidos a personas mayores de 16 años. 
                        No recopilamos intencionalmente datos de menores de 16 años sin 
                        consentimiento parental verificable.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Updates */}
            <Card className="border-2 border-gray-200 shadow-md">
              <CardHeader>
                <CardTitle className="text-text-primary">13. Actualizaciones de la Política</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-text-secondary leading-relaxed">
                  Podemos actualizar esta Política de Privacidad ocasionalmente. 
                  Le notificaremos sobre cambios significativos por email o mediante 
                  un aviso prominente en nuestra plataforma.
                </p>
                <p className="text-text-secondary leading-relaxed">
                  Le recomendamos revisar esta política periódicamente para mantenerse 
                  informado sobre cómo protegemos su información.
                </p>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card className="border-2 border-gray-200 shadow-md">
              <CardHeader>
                <CardTitle className="text-text-primary">14. Contacto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-text-secondary leading-relaxed">
                  Para ejercer sus derechos o si tiene preguntas sobre esta Política de Privacidad:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-brand-primary" />
                    <div>
                      <p className="font-medium text-text-primary">Delegado de Protección de Datos</p>
                      <a href="mailto:privacidad@productbeers.com" className="text-brand-primary hover:underline">
                        privacidad@productbeers.com
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
                <div className="bg-info-light border border-info-DEFAULT rounded-lg p-4 mt-4">
                  <p className="text-info-dark text-sm">
                    <strong>Autoridad de Control:</strong> Agencia Española de Protección de Datos (AEPD) - 
                    <a href="https://www.aepd.es" className="underline ml-1" target="_blank" rel="noopener noreferrer">
                      www.aepd.es
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* New Content */}
            <div className="container mx-auto px-4 py-8 prose prose-amber max-w-3xl">
              <h2>Finalidad</h2>
              <p>Gestión de eventos, comunidad y comunicaciones relacionadas.</p>
              <h2>Derechos</h2>
              <p>Acceso, rectificación, cancelación y oposición escribiendo a privacy@productbeers.local.</p>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}
