import React, { useState } from 'react'
import { Search, Bell, User, Settings, LogOut, Menu, Sun, Moon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { SidebarTrigger } from '@/components/ui/sidebar'

interface TopNavigationProps {
  title?: string
  showSearch?: boolean
}

export function TopNavigation({ title = "Dashboard", showSearch = true }: TopNavigationProps) {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [notifications] = useState([
    { id: 1, title: "Nouveau client", message: "Un nouveau client a été ajouté", unread: true },
    { id: 2, title: "Paiement reçu", message: "Paiement de 1,500,000 FCFA reçu", unread: true },
    { id: 3, title: "Maintenance", message: "Maintenance programmée demain", unread: false },
  ])

  const unreadCount = notifications.filter(n => n.unread).length

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle('dark')
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Implement search functionality
    console.log('Searching for:', searchQuery)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-corporate">
        <div className="flex h-16 items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            <SidebarTrigger className="lg:hidden" />
            <div className="hidden lg:block">
              <h1 className="text-xl font-semibold text-foreground">{title}</h1>
              <p className="text-sm text-muted-foreground">Gérez votre activité GMC</p>
            </div>
          </div>

          {/* Center - Search */}
          {showSearch && (
            <div className="flex-1 max-w-md mx-4">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Rechercher clients, propriétés, contrats..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 input-corporate focus:ring-2 focus:ring-primary"
                />
              </form>
            </div>
          )}

          {/* Right Section */}
          <div className="flex items-center space-x-3">
            {/* Dark Mode Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleDarkMode}
              className="h-9 w-9 p-0"
            >
              {isDarkMode ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative h-9 w-9 p-0">
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center"
                    >
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 bg-popover border shadow-lg">
                <DropdownMenuLabel className="font-semibold">Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.map((notification) => (
                  <DropdownMenuItem key={notification.id} className="flex flex-col items-start p-3 cursor-pointer hover:bg-muted">
                    <div className="flex items-center justify-between w-full">
                      <span className={`text-sm font-medium ${notification.unread ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {notification.title}
                      </span>
                      {notification.unread && (
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground mt-1">{notification.message}</span>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-center text-sm text-primary cursor-pointer">
                  Voir toutes les notifications
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src="/api/placeholder/32/32" alt="User" />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      AD
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-popover border shadow-lg" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Administrateur</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      admin@gmc.com
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer hover:bg-muted">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profil</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer hover:bg-muted">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Paramètres</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer hover:bg-muted text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Déconnexion</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}