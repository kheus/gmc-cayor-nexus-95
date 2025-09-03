import React from 'react'
import { Outlet } from 'react-router-dom'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from './AppSidebar'
import { TopNavigation } from './TopNavigation'

export function MainLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <TopNavigation />
          
          <main className="flex-1 overflow-auto">
            <div className="container-corporate py-6">
              <Outlet />
            </div>
          </main>
          
          {/* Footer */}
          <footer className="border-t bg-muted/10 py-4">
            <div className="container-corporate">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  © 2024 GMC Business Management. Tous droits réservés.
                </p>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <span>Version 2.0.0</span>
                  <span>•</span>
                  <span>Support: support@gmc.com</span>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </SidebarProvider>
  )
}