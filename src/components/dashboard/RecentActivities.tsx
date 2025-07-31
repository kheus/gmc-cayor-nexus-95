import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, LucideIcon } from "lucide-react"

interface RecentActivity {
  id: number
  type: string
  title: string
  description: string
  client: string
  time: string
  status: 'success' | 'pending' | 'scheduled' | 'warning'
  icon: LucideIcon
}

interface RecentActivitiesProps {
  activities: RecentActivity[]
}

export function RecentActivities({ activities }: RecentActivitiesProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'scheduled': return 'bg-blue-100 text-blue-800'
      case 'warning': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Activités Récentes
        </CardTitle>
        <CardDescription>
          Dernières actions et modifications dans le système
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <activity.icon className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">{activity.title}</h4>
                  <Badge className={`text-xs ${getStatusColor(activity.status)}`}>
                    {activity.status === 'success' ? 'Terminé' :
                     activity.status === 'pending' ? 'En cours' :
                     activity.status === 'scheduled' ? 'Programmé' : 'Attention'}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{activity.description}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs font-medium text-primary">{activity.client}</span>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              </div>
            </div>
          ))}
          <button className="w-full text-sm text-center text-primary hover:underline py-2">
            Voir toutes les activités
          </button>
        </div>
      </CardContent>
    </Card>
  )
}