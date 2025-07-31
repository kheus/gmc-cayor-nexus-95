import { LucideIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface StatCardProps {
  title: string
  value: string | number
  change?: {
    value: string
    isPositive: boolean
  }
  icon: LucideIcon
  subtitle?: string
}

export function StatCard({ title, value, change, icon: Icon, subtitle }: StatCardProps) {
  return (
    <Card className="gmc-stat-card group cursor-pointer">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {title}
        </CardTitle>
        <div className="p-1.5 bg-primary/10 rounded-md group-hover:bg-primary/20 transition-colors">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="text-2xl font-bold text-foreground mb-1">{value}</div>
        {subtitle && (
          <p className="text-xs text-muted-foreground mb-2">{subtitle}</p>
        )}
        {change && (
          <div className="flex items-center justify-between">
            <Badge 
              variant={change.isPositive ? "default" : "destructive"}
              className={`text-xs font-medium ${change.isPositive ? "bg-accent/20 text-accent hover:bg-accent/30" : "bg-destructive/20 text-destructive hover:bg-destructive/30"} border-0 px-1.5 py-0.5`}
            >
              {change.isPositive ? "↗" : "↘"} {change.value}
            </Badge>
            <span className="text-xs text-muted-foreground">
              vs mois dernier
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}