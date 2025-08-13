"use client"

import type React from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdmin, isOrganizer } = useAuth()
  const router = useRouter()
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAuthChecked(true)
    }, 5000) // 5 second timeout

    if (!loading) {
      clearTimeout(timeout)
      setAuthChecked(true)

      if (!user) {
        router.push("/auth/signin")
        return
      }

      if (!isAdmin && !isOrganizer) {
        router.push("/")
        return
      }
    }

    return () => clearTimeout(timeout)
  }, [user, loading, isAdmin, isOrganizer, router])

  if (!authChecked || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-brand-primary mb-4"></div>
          <p className="text-gray-600">Verificando permisos...</p>
          {!loading && (
            <Button onClick={() => router.push("/")} variant="outline" className="mt-4">
              Volver al inicio
            </Button>
          )}
        </div>
      </div>
    )
  }

  // Don't render dashboard if not authenticated or authorized
  if (!user || (!isAdmin && !isOrganizer)) {
    return null
  }

  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mx-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Panel</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
