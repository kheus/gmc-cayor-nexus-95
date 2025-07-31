import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "lucide-react"

interface Event {
  id: number
  title: string
  time: string
  date: string
  client: string
  type: string
  typeLabel: string
}

interface UpcomingEventsProps {
  events: Event[]
}

export function UpcomingEvents({ events }: UpcomingEventsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Événements à Venir
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {events.map((event) => (
            <div key={event.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
              <div className="flex flex-col items-center">
                <div className="text-xs font-medium text-primary">{event.time}</div>
                <div className="text-xs text-muted-foreground">{event.date}</div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{event.title}</p>
                <p className="text-xs text-muted-foreground">{event.client}</p>
              </div>
              <Badge variant="outline" className="text-xs">
                {event.typeLabel}
              </Badge>
            </div>
          ))}
          <button className="w-full text-xs text-center text-primary hover:underline">
            Voir le calendrier complet
          </button>
        </div>
      </CardContent>
    </Card>
  )
}