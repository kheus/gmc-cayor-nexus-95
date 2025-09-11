import React, { useState } from 'react'
import { Search, Bell, User, Settings, LogOut, Menu, Sun, Moon, X } from 'lucide-react'
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
import { useNotifications } from '@/hooks/useNotifications'
import { useNavigate } from 'react-router-dom'

interface TopNavigationProps {
  title?: string
  showSearch?: boolean
}

export function TopNavigation({ title = "Dashboard", showSearch = true }: TopNavigationProps) {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()
  
  const { 
    notifications, 
    unreadCount, 
    urgentCount, 
    markAsRead, 
    markAllAsRead, 
    removeNotification 
  } = useNotifications()

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle('dark')
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Searching for:', searchQuery)
  }

  const handleNotificationClick = (notification: any) => {
    markAsRead(notification.id)
    if (notification.action_url) {
      navigate(notification.action_url)
    }
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
                <Button variant="ghost" size="sm" className="relative h-9 w-9 p-0 hover:bg-muted transition-colors">
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center animate-pulse"
                    >
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-96 bg-popover border shadow-lg max-h-96 overflow-y-auto">
                <div className="flex items-center justify-between p-3 border-b">
                  <div>
                    <DropdownMenuLabel className="font-semibold text-base">Notifications</DropdownMenuLabel>
                    {urgentCount > 0 && (
                      <p className="text-xs text-destructive font-medium">
                        {urgentCount} notification(s) urgente(s)
                      </p>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={markAllAsRead}
                      className="text-xs text-primary hover:text-primary/80"
                    >
                      Tout marquer comme lu
                    </Button>
                  )}
                </div>
                
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-muted-foreground">
                    <Bell className="mx-auto h-8 w-8 mb-2 opacity-50" />
                    <p className="text-sm">Aucune notification</p>
                  </div>
                ) : (
                  notifications.slice(0, 8).map((notification) => (
                    <DropdownMenuItem 
                      key={notification.id} 
                      className="flex items-start gap-3 p-4 cursor-pointer hover:bg-muted border-b last:border-b-0 min-h-[70px]"
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        notification.type === 'urgent' ? 'bg-destructive/10 text-destructive' :
                        notification.type === 'warning' ? 'bg-warning/10 text-warning' :
                        notification.type === 'success' ? 'bg-success/10 text-success' : 
                        'bg-info/10 text-info'
                      }`}>
                        <notification.icon className="h-4 w-4" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className={`text-sm font-medium ${notification.unread ? 'text-foreground' : 'text-muted-foreground'}`}>
                                {notification.title}
                              </span>
                              {notification.urgent && (
                                <Badge variant="destructive" className="text-xs px-1 py-0">
                                  Urgent
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1 font-medium">
                              {notification.time}
                            </p>
                          </div>
                          
                          <div className="flex items-start gap-1">
                            {notification.unread && (
                              <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2"></div>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                              onClick={(e) => {
                                e.stopPropagation()
                                removeNotification(notification.id)
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))
                )}
                
                {notifications.length > 8 && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-center text-sm text-primary cursor-pointer hover:bg-muted py-3"
                      onClick={() => navigate('/notifications')}
                    >
                      Voir toutes les notifications ({notifications.length})
                    </DropdownMenuItem>
                  </>
                )}
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