import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LucideIcon, Plus } from "lucide-react"

interface QuickAction {
  name: string
  icon: LucideIcon
  color: string
}

interface QuickActionsProps {
  actions: QuickAction[]
  onActionClick?: (actionName: string) => void
}

export function QuickActions({ actions, onActionClick }: QuickActionsProps) {
  const handleActionClick = (actionName: string) => {
    if (onActionClick) {
      onActionClick(actionName)
    } else {
      // Actions par défaut selon le nom
      switch (actionName) {
        case 'Nouveau Client':
        case 'Ajouter Propriété':
        case 'Nouvelle Réservation':
        case 'Nouveau Contrat':
          // Rediriger vers la page appropriée
          window.location.href = getActionUrl(actionName)
          break
        case 'Planifier Visite':
        case 'Planifier Départ':
        case 'Renouveler Contrat':
          // Ouvrir un modal de planification
          alert(`Action: ${actionName} - Fonctionnalité en cours de développement`)
          break
        case 'Générer Rapport':
          // Télécharger un rapport
          generateReport()
          break
        default:
          console.log('Action non reconnue:', actionName)
      }
    }
  }

  const getActionUrl = (actionName: string): string => {
    switch (actionName) {
      case 'Nouveau Client':
        return '/clients'
      case 'Ajouter Propriété':
        return '/properties'
      case 'Nouvelle Réservation':
        return '/hotel-reservations'
      case 'Nouveau Contrat':
        return '/insurance-contracts'
      default:
        return '#'
    }
  }

  const generateReport = () => {
    // Simuler la génération d'un rapport
    const data = {
      date: new Date().toLocaleDateString('fr-FR'),
      metrics: 'Rapport généré avec succès'
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `rapport_${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Actions Rapides
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={() => handleActionClick(action.name)}
              className="flex flex-col items-center gap-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors hover:scale-105 transform duration-200"
            >
              <div className={`w-8 h-8 rounded-full ${action.color} flex items-center justify-center shadow-md`}>
                <action.icon className="h-4 w-4 text-white" />
              </div>
              <span className="text-xs font-medium text-center">{action.name}</span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}