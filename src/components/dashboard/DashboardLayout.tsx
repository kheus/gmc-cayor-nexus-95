import { ReactNode } from "react"
import { Badge } from "@/components/ui/badge"
import { LucideIcon } from "lucide-react"

interface DashboardLayoutProps {
  title: string
  description: string
  sectorName: string
  sectorIcon: LucideIcon
  children: ReactNode
}

export function DashboardLayout({ 
  title, 
  description, 
  sectorName, 
  sectorIcon: SectorIcon, 
  children 
}: DashboardLayoutProps) {
  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-2">
            <SectorIcon className="h-4 w-4" />
            {sectorName}
          </Badge>
        </div>
      </div>
      
      {children}
    </div>
  )
}