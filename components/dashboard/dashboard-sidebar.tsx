"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { useAuth } from "@/hooks/useAuth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Calendar,
  Users,
  BarChart3,
  Settings,
  Home,
  LogOut,
  User,
  Palette,
  MessageSquare,
  Trophy,
  UserCheck,
  FileText,
} from "lucide-react"

const navigationItems = [
  {
    title: "Panel Principal",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Eventos",
    url: "/dashboard/eventos",
    icon: Calendar,
  },
  {
    title: "Usuarios",
    url: "/dashboard/usuarios",
    icon: UserCheck,
  },
  {
    title: "Participantes",
    url: "/dashboard/participantes",
    icon: Users,
  },
  {
    title: "Recursos",
    url: "/dashboard/recursos",
    icon: FileText,
  },
]

const managementItems = [
  {
    title: "Analíticas",
    url: "/dashboard/analiticas",
    icon: BarChart3,
  },
  {
    title: "Comentarios",
    url: "/dashboard/comentarios",
    icon: MessageSquare,
  },
  {
    title: "Herramientas Canvas",
    url: "/dashboard/canvas",
    icon: Palette,
  },
  {
    title: "Gamificación",
    url: "/dashboard/gamificacion",
    icon: Trophy,
  },
  {
    title: "Configuración",
    url: "/dashboard/configuracion",
    icon: Settings,
  },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const { user, userData, signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <Sidebar className="border-r-2 border-gray-200 bg-white">
      <SidebarHeader className="border-b-2 border-gray-200 bg-white">
        <div className="flex items-center gap-2 px-4 py-4">
          <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">🍺</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-text-primary">Product Beers</h2>
            <p className="text-sm text-text-secondary">Panel de Administración</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-white">
        <SidebarGroup>
          <SidebarGroupLabel className="text-text-secondary font-medium px-4 py-2">
            Navegación Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    className={`mx-2 rounded-md transition-colors ${
                      pathname === item.url
                        ? "bg-brand-primary text-white hover:bg-brand-secondary"
                        : "text-text-primary hover:bg-brand-primary/10 hover:text-brand-primary"
                    }`}
                  >
                    <Link href={item.url} className="flex items-center gap-3 px-3 py-2">
                      <item.icon className="h-4 w-4" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-text-secondary font-medium px-4 py-2">Gestión Avanzada</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {managementItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    className={`mx-2 rounded-md transition-colors ${
                      pathname === item.url
                        ? "bg-brand-primary text-white hover:bg-brand-secondary"
                        : "text-text-primary hover:bg-brand-primary/10 hover:text-brand-primary"
                    }`}
                  >
                    <Link href={item.url} className="flex items-center gap-3 px-3 py-2">
                      <item.icon className="h-4 w-4" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t-2 border-gray-200 bg-white">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="w-full mx-2 p-3 hover:bg-brand-primary/10 rounded-md transition-colors">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={userData?.avatar_url || ""} alt={userData?.full_name || ""} />
                    <AvatarFallback className="bg-brand-primary text-white">
                      {userData?.full_name?.charAt(0) || "A"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start text-left">
                    <span className="text-sm font-medium text-text-primary">{userData?.full_name || "Admin"}</span>
                    <span className="text-xs text-text-secondary capitalize">{userData?.role}</span>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-56 bg-white border-2 border-gray-200 shadow-lg">
                <DropdownMenuItem asChild>
                  <Link href="/perfil" className="flex items-center text-text-primary hover:bg-brand-primary/10">
                    <User className="mr-2 h-4 w-4" />
                    Perfil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/dashboard/configuracion"
                    className="flex items-center text-text-primary hover:bg-brand-primary/10"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Configuración
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-200" />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="text-error-DEFAULT hover:bg-error-light hover:text-error-dark"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
