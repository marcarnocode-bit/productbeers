"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { LogOut, User, LayoutDashboard, Menu, X, Calendar, Users, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"

const nav = [
  { href: "/eventos", label: "Eventos", icon: Calendar },
  { href: "/comunidad", label: "Comunidad", icon: Users },
  { href: "/recursos", label: "Recursos", icon: BookOpen },
]

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, userData, isAdmin, isOrganizer, signOut } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleMouseEnter = (href: string) => {
    router.prefetch(href)
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full",
        "bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85 border-b border-gray-200",
      )}
      role="banner"
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-white px-3 py-2 rounded-md border"
      >
        Saltar al contenido
      </a>
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-gray-900">
          <div className="rounded-md bg-brand-primary p-1.5 text-white" aria-hidden="true">
            <span className="text-xl">🍺</span>
          </div>
          <span className="text-lg">Product Beers</span>
        </Link>

        {/* Desktop Navigation */}
        <nav aria-label="Principal" className="hidden md:flex items-center gap-6">
          {nav.map((item) => {
            const active = pathname?.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                onMouseEnter={() => handleMouseEnter(item.href)}
                className={cn(
                  "text-sm font-medium transition-colors relative py-1",
                  active ? "text-brand-primary" : "text-gray-800 hover:text-brand-primary",
                )}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
                {active && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-primary rounded-full" />}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-2">
          {!user ? (
            <div className="hidden md:flex items-center gap-3">
              <Link href="/auth/signin" onMouseEnter={() => handleMouseEnter("/auth/signin")}>
                <Button
                  variant="outline"
                  className="border-gray-300 text-gray-900 hover:border-brand-primary hover:text-brand-primary bg-transparent"
                >
                  Iniciar sesión
                </Button>
              </Link>
              <Link href="/auth/signup" onMouseEnter={() => handleMouseEnter("/auth/signup")}>
                <Button className="bg-brand-primary hover:bg-brand-secondary text-white">Crear cuenta</Button>
              </Link>
            </div>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="border-gray-300 text-gray-900 hover:border-brand-primary hover:text-brand-primary flex items-center gap-2 bg-transparent"
                  onMouseEnter={() => {
                    handleMouseEnter("/perfil")
                    handleMouseEnter("/mis-eventos")
                    if (isAdmin || isOrganizer) {
                      handleMouseEnter("/dashboard")
                    }
                  }}
                >
                  <Avatar className="h-8 w-8 border-2 border-brand-light">
                    <AvatarImage src={userData?.avatar_url ?? ""} alt={userData?.full_name ?? "Usuario"} />
                    <AvatarFallback className="bg-brand-primary text-white">
                      {(userData?.full_name ?? "U").charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline-block max-w-[160px] truncate">
                    {userData?.full_name ?? "Usuario"}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-2">
                <div className="px-2 pt-1 pb-2 mb-1 border-b">
                  <p className="text-sm font-medium text-gray-900 truncate">{userData?.full_name}</p>
                  <p className="text-xs text-gray-600 truncate">{user?.email}</p>
                </div>
                <DropdownMenuItem asChild className="h-9 cursor-pointer">
                  <Link href="/perfil" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    Mi perfil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="h-9 cursor-pointer">
                  <Link href="/mis-eventos" className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    Mis eventos
                  </Link>
                </DropdownMenuItem>
                {(isAdmin || isOrganizer) && (
                  <DropdownMenuItem asChild className="h-9 cursor-pointer">
                    <Link href="/dashboard" className="flex items-center">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut} className="h-9 cursor-pointer text-red-600 focus:text-red-700">
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Abrir menú">
                <Menu className="h-5 w-5 text-gray-900" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85%] sm:w-[385px] p-0">
              <div className="flex flex-col h-full">
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between mb-6">
                    <Link
                      href="/"
                      className="flex items-center gap-2 font-bold text-gray-900"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div className="rounded-md bg-brand-primary p-1.5 text-white">
                        <span className="text-xl">🍺</span>
                      </div>
                      <span className="text-lg">Product Beers</span>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Cerrar menú"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>

                  {!user ? (
                    <div className="grid grid-cols-2 gap-3">
                      <Link href="/auth/signin" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full bg-transparent">
                          Iniciar sesión
                        </Button>
                      </Link>
                      <Link href="/auth/signup" onClick={() => setMobileMenuOpen(false)}>
                        <Button className="w-full bg-brand-primary hover:bg-brand-secondary text-white">
                          Crear cuenta
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                      <Avatar className="h-10 w-10 border-2 border-brand-light">
                        <AvatarImage src={userData?.avatar_url ?? ""} alt={userData?.full_name ?? "Usuario"} />
                        <AvatarFallback className="bg-brand-primary text-white">
                          {(userData?.full_name ?? "U").charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{userData?.full_name}</p>
                        <p className="text-xs text-gray-600 truncate">{user?.email}</p>
                      </div>
                    </div>
                  )}
                </div>

                <nav className="flex-1 overflow-y-auto py-4" aria-label="Menú móvil">
                  <div className="px-3 mb-2 text-xs font-medium text-gray-600 uppercase tracking-wider">Navegación</div>
                  {nav.map((item) => {
                    const active = pathname?.startsWith(item.href)
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        onTouchStart={() => handleMouseEnter(item.href)}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 text-base font-medium rounded-md mx-2 transition-colors",
                          active ? "bg-brand-light text-brand-primary" : "text-gray-900 hover:bg-gray-100",
                        )}
                        aria-current={active ? "page" : undefined}
                      >
                        <item.icon className="h-5 w-5" />
                        {item.label}
                      </Link>
                    )
                  })}

                  {user && (
                    <>
                      <div className="px-3 mt-6 mb-2 text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Tu cuenta
                      </div>
                      <Link
                        href="/perfil"
                        onClick={() => setMobileMenuOpen(false)}
                        onTouchStart={() => handleMouseEnter("/perfil")}
                        className="flex items-center gap-3 px-3 py-2.5 text-base font-medium rounded-md mx-2 text-gray-900 hover:bg-gray-100"
                      >
                        <User className="h-5 w-5" />
                        Mi perfil
                      </Link>
                      <Link
                        href="/mis-eventos"
                        onClick={() => setMobileMenuOpen(false)}
                        onTouchStart={() => handleMouseEnter("/mis-eventos")}
                        className="flex items-center gap-3 px-3 py-2.5 text-base font-medium rounded-md mx-2 text-gray-900 hover:bg-gray-100"
                      >
                        <Calendar className="h-5 w-5" />
                        Mis eventos
                      </Link>
                      {(isAdmin || isOrganizer) && (
                        <Link
                          href="/dashboard"
                          onClick={() => setMobileMenuOpen(false)}
                          onTouchStart={() => handleMouseEnter("/dashboard")}
                          className="flex items-center gap-3 px-3 py-2.5 text-base font-medium rounded-md mx-2 text-gray-900 hover:bg-gray-100"
                        >
                          <LayoutDashboard className="h-5 w-5" />
                          Dashboard
                        </Link>
                      )}
                    </>
                  )}
                </nav>

                {user && (
                  <div className="p-4 border-t">
                    <Button
                      onClick={() => {
                        signOut()
                        setMobileMenuOpen(false)
                      }}
                      variant="outline"
                      className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Cerrar sesión
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
