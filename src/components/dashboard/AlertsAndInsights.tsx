import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  AlertTriangle, 
  TrendingUp, 
  Info, 
  CheckCircle, 
  Clock,
  Target,
  Users,
  DollarSign
} from "lucide-react"

interface Alert {
  id: string
  type: 'warning' | 'success' | 'info' | 'critical'
  title: string
  message: string
  action?: string
  priority: 'high' | 'medium' | 'low'
  category: 'financial' | 'operational' | 'client'
  timestamp: string
}

interface Insight {
  id: string
  title: string
  description: string
  impact: 'positive' | 'negative' | 'neutral'
  recommendation: string
  sector: string
}

interface AlertsAndInsightsProps {
  alerts: Alert[]
  insights: Insight[]
}

export function AlertsAndInsights({ alerts, insights }: AlertsAndInsightsProps) {
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical': return AlertTriangle
      case 'warning': return AlertTriangle
      case 'success': return CheckCircle
      case 'info': return Info
      default: return Info
    }
  }

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200'
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'success': return 'text-green-600 bg-green-50 border-green-200'
      case 'info': return 'text-blue-600 bg-blue-50 border-blue-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'financial': return DollarSign
      case 'operational': return Target
      case 'client': return Users
      default: return Info
    }
  }

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'positive': return TrendingUp
      case 'negative': return AlertTriangle
      case 'neutral': return Info
      default: return Info
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Alertes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            Alertes et Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-80 overflow-y-auto">
            {alerts.length > 0 ? (
              alerts.map((alert) => {
                const AlertIcon = getAlertIcon(alert.type)
                const CategoryIcon = getCategoryIcon(alert.category)
                
                return (
                  <div 
                    key={alert.id}
                    className={`p-3 rounded-lg border ${getAlertColor(alert.type)}`}
                  >
                    <div className="flex items-start gap-3">
                      <AlertIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-sm font-medium truncate">{alert.title}</h4>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <Badge 
                              variant={alert.priority === 'high' ? 'destructive' : 'outline'}
                              className="text-xs"
                            >
                              {alert.priority}
                            </Badge>
                            <CategoryIcon className="h-3 w-3" />
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{alert.message}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
                          {alert.action && (
                            <Button size="sm" variant="outline" className="h-6 text-xs">
                              {alert.action}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <p className="text-sm">Aucune alerte active</p>
                <p className="text-xs">Tous les indicateurs sont normaux</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Analyses et Recommandations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-80 overflow-y-auto">
            {insights.map((insight) => {
              const ImpactIcon = getImpactIcon(insight.impact)
              
              return (
                <div key={insight.id} className="p-3 rounded-lg border bg-gray-50/50">
                  <div className="flex items-start gap-3">
                    <ImpactIcon className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                      insight.impact === 'positive' ? 'text-green-500' :
                      insight.impact === 'negative' ? 'text-red-500' : 'text-blue-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-medium">{insight.title}</h4>
                        <Badge variant="outline" className="text-xs">
                          {insight.sector}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{insight.description}</p>
                      <div className="p-2 bg-blue-50 rounded border-l-2 border-blue-200">
                        <p className="text-xs text-blue-800">
                          <strong>Recommandation:</strong> {insight.recommendation}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}