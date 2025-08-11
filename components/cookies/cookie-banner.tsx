"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Cookie, Settings, X } from "lucide-react"
import Link from "next/link"

function getCookie(name: string) {
  if (typeof document === "undefined") return null
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()!.split(";").shift()!
  return null
}

function setCookie(name: string, value: string, days = 180) {
  if (typeof document === "undefined") return
  const d = new Date()
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000)
  document.cookie = `${name}=${value}; path=/; expires=${d.toUTCString()}; SameSite=Lax`
}

interface CookiePreferences {
  essential: boolean
  functional: boolean
  analytics: boolean
  marketing: boolean
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true, // Always true, cannot be disabled
    functional: false,
    analytics: false,
    marketing: false,
  })

  useEffect(() => {
    const consent = getCookie("cookie_consent")
    if (!consent) setVisible(true)
  }, [])

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem("cookie-preferences", JSON.stringify(prefs))
    localStorage.setItem("cookie-consent-date", new Date().toISOString())
    setPreferences(prefs)
    setVisible(false)
    setShowSettings(false)

    // Initialize services based on prefs (placeholder logs)
    if (prefs.analytics) console.log("Analytics cookies enabled")
    if (prefs.marketing) console.log("Marketing cookies enabled")
    if (prefs.functional) console.log("Functional cookies enabled")
  }

  const acceptAll = () => {
    const allAccepted: CookiePreferences = {
      essential: true,
      functional: true,
      analytics: true,
      marketing: true,
    }
    setCookie("cookie_consent", "accepted")
    savePreferences(allAccepted)
  }

  const acceptEssentialOnly = () => {
    const essentialOnly: CookiePreferences = {
      essential: true,
      functional: false,
      analytics: false,
      marketing: false,
    }
    setCookie("cookie_consent", "accepted")
    savePreferences(essentialOnly)
  }

  const handlePreferenceChange = (type: keyof CookiePreferences, value: boolean) => {
    if (type === "essential") return
    setPreferences((prev) => ({ ...prev, [type]: value }))
  }

  const saveCustomPreferences = () => {
    setCookie("cookie_consent", "accepted")
    savePreferences(preferences)
  }

  if (!visible) return null

  return (
    <>
      {/* Cookie Banner */}
      <div
        role="region"
        aria-label="Aviso de cookies"
        className="fixed inset-x-0 bottom-0 z-50 border-t bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80"
      >
        <div className="container mx-auto px-4 py-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-700">
            Usamos cookies para mejorar tu experiencia. Consulta nuestra{" "}
            <Link className="underline" href="/cookies">
              Política de Cookies
            </Link>
            ,{" "}
            <Link className="underline" href="/privacidad">
              Privacidad
            </Link>{" "}
            y{" "}
            <Link className="underline" href="/terminos">
              Términos
            </Link>
            .
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setCookie("cookie_consent", "rejected")
                setVisible(false)
              }}
              className="border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Rechazar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSettings(true)}
              className="border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white"
            >
              <Settings className="h-4 w-4 mr-2" />
              Configurar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={acceptEssentialOnly}
              className="border-gray-300 text-gray-700 hover:bg-gray-100 bg-transparent"
            >
              Solo esenciales
            </Button>
            <Button size="sm" onClick={acceptAll} className="bg-brand-primary hover:bg-brand-secondary text-white">
              Aceptar todas
            </Button>
          </div>
        </div>
      </div>

      {/* Cookie Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto border-2 border-gray-200 shadow-xl">
            <CardHeader className="border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Cookie className="h-5 w-5 text-brand-primary" />
                  <CardTitle className="text-gray-900">Configuración de cookies</CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowSettings(false)}
                  className="text-gray-600 hover:text-gray-900"
                  aria-label="Cerrar configuración de cookies"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription>
                Personaliza qué tipos de cookies deseas permitir. Las cookies esenciales no se pueden desactivar.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 p-6">
              {/* Essential Cookies */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">🛡️ Cookies esenciales</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Necesarias para el funcionamiento básico del sitio web. No se pueden desactivar.
                    </p>
                  </div>
                  <Switch checked={preferences.essential} disabled className="opacity-50" />
                </div>
                <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                  <strong>Incluye:</strong> Autenticación, seguridad, preferencias de idioma
                </div>
              </div>

              <Separator />

              {/* Functional Cookies */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">⚙️ Cookies funcionales</h4>
                    <p className="text-sm text-gray-600 mt-1">Mejoran la funcionalidad y personalización del sitio.</p>
                  </div>
                  <Switch
                    checked={preferences.functional}
                    onCheckedChange={(checked) => handlePreferenceChange("functional", checked)}
                  />
                </div>
                <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                  <strong>Incluye:</strong> Preferencias de usuario, accesibilidad, chat en vivo
                </div>
              </div>

              <Separator />

              {/* Analytics Cookies */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">📊 Cookies analíticas</h4>
                    <p className="text-sm text-gray-600 mt-1">Nos ayudan a entender el uso del sitio.</p>
                  </div>
                  <Switch
                    checked={preferences.analytics}
                    onCheckedChange={(checked) => handlePreferenceChange("analytics", checked)}
                  />
                </div>
                <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                  <strong>Incluye:</strong> Google Analytics, métricas de rendimiento
                </div>
              </div>

              <Separator />

              {/* Marketing Cookies */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">🎯 Cookies de marketing</h4>
                    <p className="text-sm text-gray-600 mt-1">Para anuncios relevantes y medición de campañas.</p>
                  </div>
                  <Switch
                    checked={preferences.marketing}
                    onCheckedChange={(checked) => handlePreferenceChange("marketing", checked)}
                  />
                </div>
                <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                  <strong>Incluye:</strong> Facebook Pixel, Google Ads, retargeting
                </div>
              </div>

              <Separator />

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowSettings(false)}
                  className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                  Cancelar
                </Button>
                <Button
                  variant="outline"
                  onClick={acceptEssentialOnly}
                  className="flex-1 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white bg-transparent"
                >
                  Solo esenciales
                </Button>
                <Button
                  onClick={saveCustomPreferences}
                  className="flex-1 bg-brand-primary hover:bg-brand-secondary text-white"
                >
                  Guardar preferencias
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
