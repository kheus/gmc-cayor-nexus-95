import { 
  Home, 
  Building2, 
  CreditCard, 
  Wrench, 
  FileText, 
  Shield, 
  Car,
  TrendingUp,
  Calculator,
  Settings,
  Users,
  Plane,
  Hotel
} from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"
// Utilisation du nouveau logo GMC
const gmcLogoUrl = "/lovable-uploads/25477d8a-e5e1-4146-8802-486e5a27b10d.png"

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
  useSidebar,
} from "@/components/ui/sidebar"

const generalItems = [
  { 
    title: "Vue d'ensemble", 
    url: "/", 
    icon: Home,
    description: "Tableau de bord principal"
  },
  { 
    title: "Clients", 
    url: "/clients", 
    icon: Users,
    description: "Gestion des clients"
  },
  { 
    title: "Suivi Clients", 
    url: "/client-tracker", 
    icon: Users,
    description: "Suivi et relance des clients"
  },
  { 
    title: "Paiements", 
    url: "/payments", 
    icon: CreditCard,
    description: "Tous les paiements GMC"
  },
]

const immobilierItems = [
  { 
    title: "Dashboard Immobilier", 
    url: "/immobilier-dashboard", 
    icon: TrendingUp,
    description: "Vue d'ensemble immobilier"
  },
  { 
    title: "Propriétés", 
    url: "/properties", 
    icon: Building2,
    description: "Gestion des biens immobiliers"
  },
  { 
    title: "Maintenance", 
    url: "/maintenance", 
    icon: Wrench,
    description: "Interventions et réparations"
  },
  { 
    title: "Contrats", 
    url: "/contracts", 
    icon: FileText,
    description: "Gestion des contrats"
  },
]

const voyageItems = [
  { 
    title: "Dashboard Voyage", 
    url: "/travel-dashboard", 
    icon: TrendingUp,
    description: "Vue d'ensemble voyage"
  },
  { 
    title: "Réservations Vols", 
    url: "/flight-reservations", 
    icon: Plane,
    description: "Réservations de billets d'avion"
  },
  { 
    title: "Réservations Hôtels", 
    url: "/hotel-reservations", 
    icon: Hotel,
    description: "Réservations d'hôtels"
  },
  { 
    title: "Location Voitures", 
    url: "/car-rentals", 
    icon: Car,
    description: "Location de véhicules"
  },
  { 
    title: "Clients Voyage", 
    url: "/clients", 
    icon: Users,
    description: "Gestion des voyageurs"
  },
]

const assuranceItems = [
  { 
    title: "Dashboard Assurance", 
    url: "/insurance-dashboard", 
    icon: TrendingUp,
    description: "Vue d'ensemble assurance"
  },
  { 
    title: "Clients Assurance", 
    url: "/clients", 
    icon: Users,
    description: "Gestion des clients assurance"
  },
  { 
    title: "Contrats", 
    url: "/insurance-contracts", 
    icon: FileText,
    description: "Polices d'assurance"
  },
  { 
    title: "Assurances Auto", 
    url: "/auto-insurance", 
    icon: Shield,
    description: "Assurances automobiles"
  },
]

const gestionItems = [
  { 
    title: "Suivi Financier", 
    url: "/finance", 
    icon: TrendingUp,
    description: "Revenus, dépenses et rentabilité"
  },
  { 
    title: "Comptabilité", 
    url: "/accounting", 
    icon: Calculator,
    description: "Journal comptable et tarification"
  },
  { 
    title: "Comptabilité Avancée", 
    url: "/advanced-accounting", 
    icon: Building2,
    description: "TVA, rapports fiscaux, réconciliation bancaire"
  },
  { 
    title: "Paramètres", 
    url: "/settings", 
    icon: Settings,
    description: "Configuration de l'agence"
  },
]

export function GMCSidebar() {
  const { state } = useSidebar()
  const location = useLocation()
  const currentPath = location.pathname

  const isActive = (path: string) => {
    if (path === "/") {
      return currentPath === "/"
    }
    return currentPath.startsWith(path)
  }

  const isCollapsed = state === "collapsed"

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarHeader className="border-b border-border p-4">
        <div className="flex items-center gap-3">
          <img 
            src={gmcLogoUrl} 
            alt="GMC Logo" 
            className="h-8 w-8 rounded-full object-contain"
          />
          {!isCollapsed && (
            <div className="flex flex-col">
              <h2 className="text-lg font-semibold text-primary">GMC Dashboard</h2>
              <p className="text-xs text-muted-foreground">Groupe Multisectoriel du Cayor</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Général</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {generalItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive(item.url)}
                    tooltip={isCollapsed ? item.description : undefined}
                  >
                    <NavLink 
                      to={item.url} 
                      className="gmc-nav-item"
                      end={item.url === "/"}
                    >
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>GMC Immobilier</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {immobilierItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive(item.url)}
                    tooltip={isCollapsed ? item.description : undefined}
                  >
                    <NavLink 
                      to={item.url} 
                      className="gmc-nav-item"
                    >
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>GMC Voyage</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {voyageItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive(item.url)}
                    tooltip={isCollapsed ? item.description : undefined}
                  >
                    <NavLink 
                      to={item.url} 
                      className="gmc-nav-item"
                    >
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>GMC Assurance</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {assuranceItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive(item.url)}
                    tooltip={isCollapsed ? item.description : undefined}
                  >
                    <NavLink 
                      to={item.url} 
                      className="gmc-nav-item"
                    >
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Gestion</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {gestionItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive(item.url)}
                    tooltip={isCollapsed ? item.description : undefined}
                  >
                    <NavLink 
                      to={item.url} 
                      className="gmc-nav-item"
                    >
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
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