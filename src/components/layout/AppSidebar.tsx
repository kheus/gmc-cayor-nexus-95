import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { 
  BarChart3, 
  Building2, 
  Plane, 
  Shield, 
  Users, 
  FileText, 
  Settings, 
  Home,
  Calendar,
  TrendingUp,
  Briefcase,
  Car,
  Hotel,
  CreditCard,
  Phone,
  Mail,
  Calculator,
  PieChart,
  Database
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

const dashboardItems = [
  { title: "Vue d'ensemble", url: "/", icon: Home },
  { title: "Immobilier", url: "/immobilier-dashboard", icon: Building2 },
  { title: "Voyage", url: "/travel-dashboard", icon: Plane },
  { title: "Assurance", url: "/insurance-dashboard", icon: Shield },
  { title: "Analytics", url: "/dashboard", icon: BarChart3 },
]

const managementItems = [
  { title: "Clients", url: "/clients", icon: Users },
  { title: "Propriétés", url: "/properties", icon: Building2 },
  { title: "Réservations Vols", url: "/flight-reservations", icon: Plane },
  { title: "Réservations Hôtels", url: "/hotel-reservations", icon: Hotel },
  { title: "Location Véhicules", url: "/car-rentals", icon: Car },
  { title: "Contrats Assurance", url: "/insurance-contracts", icon: Shield },
  { title: "Assurance Auto", url: "/auto-insurance", icon: Car },
]

const financeItems = [
  { title: "Paiements Unifiés", url: "/unified-payments", icon: CreditCard },
  { title: "Paiements Voyage", url: "/travel-payments", icon: Plane },
  { title: "Paiements Assurance", url: "/insurance-payments", icon: Shield },
  { title: "Comptabilité", url: "/accounting", icon: Calculator },
  { title: "Comptabilité Avancée", url: "/advanced-accounting", icon: PieChart },
  { title: "Finance", url: "/finance", icon: TrendingUp },
]

const toolsItems = [
  { title: "Maintenance", url: "/maintenance", icon: Settings },
  { title: "Suivi Prospects", url: "/prospect-manager", icon: Phone },
  { title: "Suivi Clients", url: "/client-tracker", icon: Users },
  { title: "Rapports", url: "/reports", icon: FileText },
]

const configItems = [
  { title: "Paramètres", url: "/settings", icon: Settings },
]

export function AppSidebar() {
  const { state } = useSidebar()
  const location = useLocation()
  const currentPath = location.pathname

  const isActive = (path: string) => currentPath === path
  const isGroupExpanded = (items: any[]) => items.some(item => isActive(item.url))

  const getNavClassName = (path: string) => {
    const baseClasses = "sidebar-nav-item transition-all duration-200"
    return isActive(path) ? `${baseClasses} active` : baseClasses
  }

  return (
    <Sidebar
      className={`transition-all duration-300 ${state === "collapsed" ? "w-16" : "w-64"} border-r bg-card`}
    >
      {/* Logo Section */}
      <div className="flex items-center justify-between p-4 border-b">
        {state !== "collapsed" && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">GMC</span>
            </div>
            <div>
              <h2 className="font-semibold text-sm">GMC Dashboard</h2>
              <p className="text-xs text-muted-foreground">Business Management</p>
            </div>
          </div>
        )}
        {state === "collapsed" && (
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto">
            <span className="text-white font-bold text-sm">G</span>
          </div>
        )}
      </div>

      <SidebarContent className="px-2">
        {/* Dashboards Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 py-2">
            {state !== "collapsed" && "Tableaux de Bord"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="sidebar-nav">
              {dashboardItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavClassName(item.url)}>
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      {state !== "collapsed" && <span className="ml-3">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator className="my-2" />

        {/* Management Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 py-2">
            {state !== "collapsed" && "Gestion"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="sidebar-nav">
              {managementItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavClassName(item.url)}>
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      {state !== "collapsed" && <span className="ml-3">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator className="my-2" />

        {/* Finance Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 py-2">
            {state !== "collapsed" && "Finance"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="sidebar-nav">
              {financeItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavClassName(item.url)}>
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      {state !== "collapsed" && <span className="ml-3">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator className="my-2" />

        {/* Tools Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 py-2">
            {state !== "collapsed" && "Outils"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="sidebar-nav">
              {toolsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavClassName(item.url)}>
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      {state !== "collapsed" && <span className="ml-3">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator className="my-2" />

        {/* Configuration Section */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="sidebar-nav">
              {configItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavClassName(item.url)}>
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      {state !== "collapsed" && <span className="ml-3">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}