import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, X } from "lucide-react"
import { useNotifications } from "@/hooks/useNotifications"
import { useNavigate } from "react-router-dom"

export function NotificationsPanel() {
  const navigate = useNavigate()
  const { 
    notifications, 
    urgentCount, 
    markAsRead, 
    removeNotification,
    markAllAsRead 
  } = useNotifications()
  const handleNotificationClick = (notification: any) => {
    markAsRead(notification.id)
    if (notification.action_url) {
      navigate(notification.action_url)
    }
  }

  return (
    <Card className="hover:shadow-elegant transition-all duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
            {urgentCount > 0 && (
              <Badge variant="destructive" className="animate-pulse">
                {urgentCount}
              </Badge>
            )}
          </CardTitle>
          {notifications.filter(n => n.unread).length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs text-primary hover:text-primary/80"
            >
              Tout lire
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <Bell className="mx-auto h-8 w-8 mb-2 opacity-50" />
              <p className="text-sm">Aucune notification</p>
            </div>
          ) : (
            notifications.slice(0, 5).map((notification) => (
              <div 
                key={notification.id} 
                className="group flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
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
                      <div className="flex items-center gap-2 mb-1">
                        <p className={`text-sm font-medium ${notification.unread ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {notification.title}
                        </p>
                        {notification.urgent && (
                          <Badge variant="destructive" className="text-xs px-1 py-0">
                            Urgent
                          </Badge>
                        )}
                        {notification.unread && (
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground font-medium">
                        {notification.time}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
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
            ))
          )}
          
          {notifications.length > 5 && (
            <Button 
              variant="ghost" 
              className="w-full text-xs text-primary hover:text-primary/80"
              onClick={() => navigate('/notifications')}
            >
              Voir toutes les notifications ({notifications.length})
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}