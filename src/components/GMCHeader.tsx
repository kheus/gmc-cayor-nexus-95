import { Bell, Search, User, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface GMCHeaderProps {
  onLogout?: () => void
}

export function GMCHeader({ onLogout }: GMCHeaderProps) {
  return (
    <header className="gmc-header flex h-14 sm:h-16 items-center gap-2 sm:gap-4 px-3 sm:px-4 md:px-6 sticky top-0 z-50">
      <SidebarTrigger className="h-6 w-6 sm:h-7 sm:w-7 hover:bg-muted/80 transition-colors" />
      
      <div className="flex-1 flex items-center gap-2 sm:gap-4 ml-2 sm:ml-4">
        <div className="relative max-w-xs sm:max-w-lg flex-1">
          <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher..."
            className="w-full pl-7 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 gmc-input-focus rounded-md sm:rounded-lg border border-border/50 text-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-3">
        <Button variant="ghost" size="icon" className="relative hover:bg-muted/80 transition-all duration-200 rounded-md sm:rounded-lg h-8 w-8 sm:h-9 sm:w-9">
          <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 h-3 w-3 sm:h-4 sm:w-4 bg-accent rounded-full flex items-center justify-center text-xs text-accent-foreground font-medium animate-pulse">
            3
          </span>
          <span className="sr-only">Notifications</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 sm:h-9 sm:w-9 rounded-full hover:bg-muted/80 transition-all duration-200">
              <Avatar className="h-8 w-8 sm:h-9 sm:w-9 border-2 border-border/50">
                <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-xs sm:text-sm">
                  AD
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 sm:w-60 gmc-card-elevated" align="end" forceMount>
            <DropdownMenuLabel className="font-normal p-3 sm:p-4">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-semibold leading-none">Administrateur GMC</p>
                <p className="text-xs leading-none text-muted-foreground">
                  admin@gmc.sn
                </p>
                <div className="mt-2 px-2 py-1 bg-accent/10 rounded-md">
                  <p className="text-xs text-accent font-medium">Accès Complet</p>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="hover:bg-muted/50 transition-colors">
              <User className="mr-2 h-4 w-4" />
              Profil
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-muted/50 transition-colors">
              <Settings className="mr-2 h-4 w-4" />
              Paramètres
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-destructive hover:bg-destructive/10 transition-colors"
              onClick={onLogout}
            >
              <User className="mr-2 h-4 w-4" />
              Se déconnecter
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}