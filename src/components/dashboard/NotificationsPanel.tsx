import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell, LucideIcon } from "lucide-react"

interface Notification {
  id: number
  type: 'warning' | 'info' | 'success'
  title: string
  message: string
  time: string
  urgent: boolean
  icon: LucideIcon
}

interface NotificationsPanelProps {
  notifications: Notification[]
}

export function NotificationsPanel({ notifications }: NotificationsPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notifications
          {notifications.filter(n => n.urgent).length > 0 && (
            <Badge variant="destructive" className="ml-auto">
              {notifications.filter(n => n.urgent).length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {notifications.slice(0, 3).map((notification) => (
            <div key={notification.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                notification.type === 'warning' ? 'bg-orange-100' :
                notification.type === 'success' ? 'bg-green-100' : 'bg-blue-100'
              }`}>
                <notification.icon className={`h-4 w-4 ${
                  notification.type === 'warning' ? 'text-orange-600' :
                  notification.type === 'success' ? 'text-green-600' : 'text-blue-600'
                }`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{notification.title}</p>
                  {notification.urgent && (
                    <Badge variant="destructive" className="text-xs">Urgent</Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{notification.message}</p>
                <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
              </div>
            </div>
          ))}
          <button className="w-full text-xs text-center text-primary hover:underline">
            Voir toutes les notifications
          </button>
        </div>
      </CardContent>
    </Card>
  )
}