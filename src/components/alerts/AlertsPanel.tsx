import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useDataSync } from '@/hooks/useDataSync'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, AlertTriangle, Clock, CheckCircle, X, Filter } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface AlertItem {
  id: string
  type: 'contract' | 'insurance' | 'payment' | 'maintenance' | 'urgent'
  title: string
  description: string
  dueDate: Date
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'pending' | 'in_progress' | 'resolved'
  propertyId?: string
  clientId?: string
}

// Les alertes seront générées automatiquement basées sur les données réelles
const generateAlertsFromData = (clients: any[]): AlertItem[] => {
  const alerts: AlertItem[] = []
  
  // Génération d'alertes basées sur les données réelles
  if (clients.length === 0) {
    alerts.push({
      id: 'no-clients',
      type: 'contract',
      title: 'Aucun client enregistré',
      description: 'Commencez par ajouter des clients à votre portefeuille',
      dueDate: new Date(),
      priority: 'medium',
      status: 'pending'
    })
  }
  
  return alerts
}

const mockAlerts: AlertItem[] = [
  {
    id: '1',
    type: 'contract',
    title: 'Renouvellement contrat de bail',
    description: 'Contrat de Mme Diallo expire dans 15 jours',
    dueDate: new Date(2024, 0, 15),
    priority: 'high',
    status: 'pending',
    clientId: 'client-1'
  },
  {
    id: '2',
    type: 'insurance',
    title: 'Assurance habitation à renouveler',
    description: 'Police d\'assurance Villa Moderne',
    dueDate: new Date(2024, 0, 25),
    priority: 'medium',
    status: 'pending',
    propertyId: 'prop-1'
  },
  {
    id: '3',
    type: 'payment',
    title: 'Paiement en retard',
    description: 'Loyer novembre non reçu - M. Traoré',
    dueDate: new Date(2023, 11, 30),
    priority: 'urgent',
    status: 'pending',
    clientId: 'client-2'
  },
  {
    id: '4',
    type: 'maintenance',
    title: 'Maintenance préventive',
    description: 'Vérification climatisation - Immeuble B',
    dueDate: new Date(2024, 0, 10),
    priority: 'low',
    status: 'in_progress',
    propertyId: 'prop-2'
  },
  {
    id: '5',
    type: 'urgent',
    title: 'Fuite d\'eau signalée',
    description: 'Appartement 3A - Intervention immédiate requise',
    dueDate: new Date(),
    priority: 'urgent',
    status: 'pending',
    propertyId: 'prop-3'
  }
]

function getPriorityColor(priority: AlertItem['priority']) {
  switch (priority) {
    case 'urgent': return 'destructive'
    case 'high': return 'destructive'
    case 'medium': return 'default'
    case 'low': return 'secondary'
    default: return 'secondary'
  }
}

function getTypeIcon(type: AlertItem['type']) {
  switch (type) {
    case 'contract': return <Clock className="h-4 w-4" />
    case 'insurance': return <AlertTriangle className="h-4 w-4" />
    case 'payment': return <AlertTriangle className="h-4 w-4" />
    case 'maintenance': return <Clock className="h-4 w-4" />
    case 'urgent': return <AlertTriangle className="h-4 w-4" />
    default: return <Bell className="h-4 w-4" />
  }
}

function getDaysUntilDue(dueDate: Date): number {
  const today = new Date()
  const diffTime = dueDate.getTime() - today.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

export function AlertsPanel() {
  const { clients } = useDataSync()
  const [alerts, setAlerts] = useState<AlertItem[]>([])
  
  useEffect(() => {
    const generatedAlerts = generateAlertsFromData(clients)
    setAlerts(generatedAlerts)
  }, [clients])
  const [filter, setFilter] = useState<'all' | 'pending' | 'urgent'>('all')

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'all') return true
    if (filter === 'pending') return alert.status === 'pending'
    if (filter === 'urgent') return alert.priority === 'urgent'
    return true
  })

  const markAsResolved = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, status: 'resolved' as const } : alert
    ))
  }

  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId))
  }

  const urgentCount = alerts.filter(a => a.priority === 'urgent' && a.status === 'pending').length
  const pendingCount = alerts.filter(a => a.status === 'pending').length

  return (
    <Card className="gmc-card-elevated">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Alertes & Notifications
              {urgentCount > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {urgentCount} urgent{urgentCount > 1 ? 's' : ''}
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              {pendingCount} notification{pendingCount > 1 ? 's' : ''} en attente
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              Toutes
            </Button>
            <Button
              variant={filter === 'pending' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('pending')}
            >
              En attente
            </Button>
            <Button
              variant={filter === 'urgent' ? 'destructive' : 'outline'}
              size="sm"
              onClick={() => setFilter('urgent')}
            >
              Urgentes
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
            <p className="text-muted-foreground">Aucune alerte pour ce filtre</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const daysUntilDue = getDaysUntilDue(alert.dueDate)
            const isOverdue = daysUntilDue < 0
            const isDueSoon = daysUntilDue <= 7 && daysUntilDue >= 0
            
            return (
              <Alert key={alert.id} className={`border-l-4 ${
                alert.priority === 'urgent' ? 'border-l-red-500 bg-red-50 dark:bg-red-950/30' :
                alert.priority === 'high' ? 'border-l-orange-500 bg-orange-50 dark:bg-orange-950/30' :
                alert.priority === 'medium' ? 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950/30' :
                'border-l-blue-500 bg-blue-50 dark:bg-blue-950/30'
              }`}>
                <div className="flex items-start justify-between w-full">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="mt-0.5">
                      {getTypeIcon(alert.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-sm">{alert.title}</h4>
                        <Badge variant={getPriorityColor(alert.priority)} className="text-xs">
                          {alert.priority === 'urgent' ? 'Urgent' :
                           alert.priority === 'high' ? 'Élevé' :
                           alert.priority === 'medium' ? 'Moyen' : 'Faible'}
                        </Badge>
                      </div>
                      <AlertDescription className="text-sm">
                        {alert.description}
                      </AlertDescription>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span>
                          {isOverdue ? (
                            <span className="text-red-600 font-medium">
                              En retard de {Math.abs(daysUntilDue)} jour{Math.abs(daysUntilDue) > 1 ? 's' : ''}
                            </span>
                          ) : isDueSoon ? (
                            <span className="text-orange-600 font-medium">
                              Dans {daysUntilDue} jour{daysUntilDue > 1 ? 's' : ''}
                            </span>
                          ) : (
                            `Dans ${daysUntilDue} jour${daysUntilDue > 1 ? 's' : ''}`
                          )}
                        </span>
                        <span>•</span>
                        <span>{alert.dueDate.toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>
                  </div>
                  
                  {alert.status === 'pending' && (
                    <div className="flex items-center gap-1 ml-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAsResolved(alert.id)}
                        className="h-8 w-8 p-0"
                      >
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => dismissAlert(alert.id)}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  )}
                </div>
              </Alert>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}