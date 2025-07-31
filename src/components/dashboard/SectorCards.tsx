import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"

interface SectorData {
  name: string
  value: number | string
  subtitle: string
  details: {
    label: string
    value: string
  }
  icon: LucideIcon
  color: string
}

interface SectorCardsProps {
  sectors: SectorData[]
}

export function SectorCards({ sectors }: SectorCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {sectors.map((sector, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <sector.icon className={`h-5 w-5 ${sector.color}`} />
              {sector.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${sector.color}`}>
              {sector.value}
            </div>
            <p className="text-sm text-muted-foreground">{sector.subtitle}</p>
            <div className="mt-2">
              <div className="text-xs text-muted-foreground">{sector.details.label}</div>
              <div className="font-medium">{sector.details.value}</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}