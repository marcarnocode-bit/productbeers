"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  const { signUp } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

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
          <CardDescription className="text-text-secondary text-base">Crea tu cuenta y comienza a conectar con profesionales de producto</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive" className="border-2 border-error-DEFAULT bg-error-light">
                <AlertDescription className="text-error-dark font-medium">{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-3">
              <Label htmlFor="fullName" className="text-text-primary font-semibold text-base">Nombre Completo</Label>
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
              <Label htmlFor="email" className="text-text-primary font-semibold text-base">Email</Label>
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
              <Label htmlFor="password" className="text-text-primary font-semibold text-base">Contraseña</Label>
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

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-semibold h-12 text-base transition-colors"
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
              <Link href="/auth/signin" className="text-brand-primary hover:text-brand-secondary font-semibold underline">
                Inicia sesión
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
