"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/hooks/useAuth"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const [acceptLegal, setAcceptLegal] = useState(false)

  const { signUp } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (!acceptLegal) {
      setError("Debe aceptar los Términos y Condiciones y la Política de Privacidad para continuar.")
      setLoading(false)
      return
    }

    const { error } = await signUp(email, password, fullName)

    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
    }

    setLoading(false)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md border-2 border-success-DEFAULT shadow-xl bg-white">
          <CardHeader className="text-center pb-8">
            <div className="w-24 h-24 bg-success-light rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">✅</span>
            </div>
            <CardTitle className="text-3xl font-bold text-text-primary">¡Revisa tu email!</CardTitle>
            <CardDescription className="text-text-secondary text-base">
              Te hemos enviado un enlace de confirmación a <strong className="text-text-primary">{email}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Button
              onClick={() => router.push("/auth/signin")}
              className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-semibold h-12 text-base"
            >
              Volver al Inicio de Sesión
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md border-2 border-gray-300 shadow-xl bg-white">
        <CardHeader className="text-center pb-8">
          <div className="w-20 h-20 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">🍺</span>
          </div>
          <CardTitle className="text-3xl font-bold text-text-primary">Únete a Product Beers</CardTitle>
          <CardDescription className="text-text-secondary text-base">
            Crea tu cuenta y comienza a conectar con profesionales de producto
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive" className="border-2 border-error-DEFAULT bg-error-light">
                <AlertDescription className="text-error-dark font-medium">{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-3">
              <Label htmlFor="fullName" className="text-text-primary font-semibold text-base">
                Nombre Completo
              </Label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                placeholder="Introduce tu nombre completo"
                className="input-clean h-12 text-base"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="email" className="text-text-primary font-semibold text-base">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Introduce tu email"
                className="input-clean h-12 text-base"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="password" className="text-text-primary font-semibold text-base">
                Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Crea una contraseña"
                minLength={6}
                className="input-clean h-12 text-base"
              />
              <p className="text-sm text-text-secondary">Mínimo 6 caracteres</p>
            </div>

            <div className="space-y-4 pt-2">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="acceptLegal"
                    checked={acceptLegal}
                    onCheckedChange={(checked) => setAcceptLegal(checked as boolean)}
                    className="mt-1"
                    required
                  />
                  <div className="text-sm">
                    <Label htmlFor="acceptLegal" className="text-text-primary font-medium cursor-pointer">
                      Acepto los{" "}
                      <Link
                        href="/terminos"
                        className="text-brand-primary hover:text-brand-secondary underline"
                        target="_blank"
                      >
                        Términos y Condiciones
                      </Link>{" "}
                      y la{" "}
                      <Link
                        href="/privacidad"
                        className="text-brand-primary hover:text-brand-secondary underline"
                        target="_blank"
                      >
                        Política de Privacidad
                      </Link>
                      <span className="text-error-DEFAULT ml-1">*</span>
                    </Label>
                  </div>
                </div>
              </div>

              <div className="bg-info-light border border-info-DEFAULT rounded-lg p-3">
                <p className="text-info-dark text-xs leading-relaxed">
                  <strong>Información sobre protección de datos:</strong> Sus datos serán tratados por Product Beers
                  Valencia para gestionar su cuenta y proporcionarle nuestros servicios. Puede ejercer sus derechos de
                  acceso, rectificación, supresión y portabilidad escribiendo a{" "}
                  <Link href="mailto:privacidad@productbeers.com" className="underline">
                    privacidad@productbeers.com
                  </Link>
                  . Consulte nuestra{" "}
                  <Link href="/privacidad" className="underline" target="_blank">
                    Política de Privacidad
                  </Link>{" "}
                  para más información.
                </p>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading || !acceptLegal}
              className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-semibold h-12 text-base transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"></div>
                  Creando cuenta...
                </>
              ) : (
                "Crear Cuenta"
              )}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-base text-text-secondary">
              ¿Ya tienes una cuenta?{" "}
              <Link
                href="/auth/signin"
                className="text-brand-primary hover:text-brand-secondary font-semibold underline"
              >
                Inicia sesión
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
