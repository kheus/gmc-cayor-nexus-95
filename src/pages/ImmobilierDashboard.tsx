import { useGMCData } from "@/hooks/useGMCData"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { MetricsGrid } from "@/components/dashboard/MetricsGrid"
import { QuickActions } from "@/components/dashboard/QuickActions"
import { NotificationsPanel } from "@/components/dashboard/NotificationsPanel"
import { UpcomingEvents } from "@/components/dashboard/UpcomingEvents"
import { RecentActivities } from "@/components/dashboard/RecentActivities"
import { StandardCharts } from "@/components/dashboard/StandardCharts"
import { SectorCards } from "@/components/dashboard/SectorCards"
import { 
  Building2, 
  Users, 
  Home, 
  AlertTriangle,
  Building,
  FileText,
  CheckCircle,
  Calendar,
  Plus,
  Settings
} from "lucide-react"

export default function ImmobilierDashboard() {
  const { 
    propertyClients, 
    propertyPayments,
    getImmobilierPerformance,
    financialSummary
  } = useGMCData()

  const immobilierMetrics = getImmobilierPerformance()

  // Données pour les graphiques
  const propertyByType = [
    { name: 'Appartements', value: Math.floor(propertyClients.length * 0.6), color: '#3b82f6' },
    { name: 'Maisons', value: Math.floor(propertyClients.length * 0.25), color: '#8b5cf6' },
    { name: 'Bureaux', value: Math.floor(propertyClients.length * 0.1), color: '#10b981' },
    { name: 'Commerces', value: Math.floor(propertyClients.length * 0.05), color: '#f59e0b' }
  ]

  const monthlyRevenue = [
    { month: 'Jan', revenue: 2800000 },
    { month: 'Fév', revenue: 3200000 },
    { month: 'Mar', revenue: 3500000 },
    { month: 'Avr', revenue: 3800000 },
    { month: 'Mai', revenue: 4100000 },
    { month: 'Juin', revenue: 4500000 }
  ]

  const activeProperties = financialSummary.stats.total_proprietes
  const occupiedProperties = Math.floor(activeProperties * (financialSummary.stats.taux_occupation / 100))
  const vacantProperties = activeProperties - occupiedProperties
  const totalRevenue = financialSummary.revenus.immobilier
  const averageRent = totalRevenue / Math.max(propertyClients.length, 1)

  // Données pour actions rapides
  const quickActions = [
    { name: 'Ajouter Propriété', icon: Plus, color: 'bg-blue-500' },
    { name: 'Nouveau Client', icon: Users, color: 'bg-green-500' },
    { name: 'Planifier Visite', icon: Calendar, color: 'bg-purple-500' },
    { name: 'Générer Rapport', icon: FileText, color: 'bg-orange-500' }
  ]

  // Données pour notifications
  const notifications = [
    {
      id: 1,
      type: 'warning' as const,
      title: 'Contrats expirent bientôt',
      message: '3 contrats de location expirent dans les 30 prochains jours',
      time: 'Il y a 1h',
      urgent: true,
      icon: AlertTriangle
    },
    {
      id: 2,
      type: 'info' as const,
      title: 'Rapport mensuel disponible',
      message: 'Le rapport de performance de Juin est maintenant disponible',
      time: 'Il y a 3h',
      urgent: false,
      icon: FileText
    },
    {
      id: 3,
      type: 'success' as const,
      title: 'Objectif atteint',
      message: 'Objectif de collecte de loyers atteint à 95%',
      time: 'Hier',
      urgent: false,
      icon: CheckCircle
    }
  ]

  // Données pour événements
  const upcomingEvents = [
    {
      id: 1,
      title: 'Visite appartement Almadies',
      time: '14:00',
      date: 'Aujourd\'hui',
      client: 'Marie Dieng',
      type: 'visit',
      typeLabel: 'Visite'
    },
    {
      id: 2,
      title: 'Échéance contrat location',
      time: '18:00',
      date: 'Demain',
      client: 'Ibrahima Fall',
      type: 'contract',
      typeLabel: 'Contrat'
    },
    {
      id: 3,
      title: 'Inspection maintenance',
      time: '10:00',
      date: '15 Sept',
      client: 'Villa Ouakam',
      type: 'maintenance',
      typeLabel: 'Maintenance'
    }
  ]

  // Données pour activités récentes
  const recentActivities = [
    {
      id: 1,
      type: 'contract',
      title: 'Nouveau contrat signé',
      description: 'Appartement 3P - Almadies',
      client: 'Amadou Diallo',
      time: 'Il y a 2h',
      status: 'success' as const,
      icon: FileText
    },
    {
      id: 2,
      type: 'payment',
      title: 'Paiement reçu',
      description: 'Loyer Juillet - Maison Mermoz',
      client: 'Fatou Sow',
      time: 'Il y a 4h',
      status: 'success' as const,
      icon: CheckCircle
    },
    {
      id: 3,
      type: 'maintenance',
      title: 'Demande de maintenance',
      description: 'Réparation plomberie - Bureau Plateau',
      client: 'Société ABC',
      time: 'Il y a 6h',
      status: 'pending' as const,
      icon: Settings
    },
    {
      id: 4,
      type: 'visit',
      title: 'Visite programmée',
      description: 'Appartement 2P - Dakar Centre',
      client: 'Omar Ba',
      time: 'Il y a 8h',
      status: 'scheduled' as const,
      icon: Calendar
    }
  ]

  // Données pour les cartes de secteur
  const sectorCards = [
    {
      name: 'Appartements',
      value: Math.floor(propertyClients.length * 0.6),
      subtitle: 'Appartements gérés',
      details: {
        label: 'Loyer moyen',
        value: `${Math.round(averageRent * 0.6).toLocaleString()} FCFA`
      },
      icon: Building,
      color: 'text-blue-600'
    },
    {
      name: 'Maisons',
      value: Math.floor(propertyClients.length * 0.25),
      subtitle: 'Maisons individuelles',
      details: {
        label: 'Loyer moyen',
        value: `${Math.round(averageRent * 1.4).toLocaleString()} FCFA`
      },
      icon: Home,
      color: 'text-purple-600'
    },
    {
      name: 'Bureaux & Commerces',
      value: Math.floor(propertyClients.length * 0.15),
      subtitle: 'Locaux professionnels',
      details: {
        label: 'Loyer moyen',
        value: `${Math.round(averageRent * 2.2).toLocaleString()} FCFA`
      },
      icon: Building2,
      color: 'text-green-600'
    }
  ]

  return (
    <DashboardLayout
      title="Dashboard Immobilier"
      description="Vue d'ensemble de l'activité immobilière GMC"
      sectorName="Secteur Immobilier"
      sectorIcon={Building2}
    >
      {/* Métriques principales */}
      <MetricsGrid
        metrics={immobilierMetrics}
        primaryMetricIcon={Home}
        primaryMetricTitle="Propriétés Gérées"
        primaryMetricValue={activeProperties}
        primaryMetricSubtitle={`${occupiedProperties} occupées`}
        primaryMetricAlert={vacantProperties > 0 ? {
          value: `${vacantProperties} vacantes`,
          isPositive: false
        } : undefined}
      />

      {/* Graphiques et analyses */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="properties">Propriétés</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Actions rapides et notifications */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <QuickActions actions={quickActions} />
            <NotificationsPanel notifications={notifications} />
            <UpcomingEvents events={upcomingEvents} />
          </div>

          {/* Graphiques principaux */}
          <StandardCharts
            distributionData={propertyByType}
            distributionTitle="Répartition par Type de Bien"
            distributionDescription="Distribution du portfolio immobilier"
            revenueData={monthlyRevenue}
            revenueTitle="Évolution du Chiffre d'Affaires"
            revenueDescription="Revenus mensuels du secteur immobilier"
          />

          {/* Activités récentes */}
          <RecentActivities activities={recentActivities} />

          {/* Cartes de secteur */}
          <SectorCards sectors={sectorCards} />
        </TabsContent>

        <TabsContent value="properties" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Statut d'Occupation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Occupées</span>
                    <Badge className="bg-green-100 text-green-800">{occupiedProperties}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Vacantes</span>
                    <Badge className="bg-orange-100 text-orange-800">{vacantProperties}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">En travaux</span>
                    <Badge className="bg-yellow-100 text-yellow-800">{Math.floor(activeProperties * 0.05)}</Badge>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="font-medium">Total</span>
                    <Badge variant="outline">{activeProperties}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenus par Zone</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {totalRevenue.toLocaleString()} FCFA
                </div>
                <p className="text-sm text-muted-foreground mb-4">Revenus mensuels immobilier</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Dakar Centre</span>
                    <span>{Math.round(totalRevenue * 0.45).toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Almadies</span>
                    <span>{Math.round(totalRevenue * 0.30).toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Autres zones</span>
                    <span>{Math.round(totalRevenue * 0.25).toLocaleString()} FCFA</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Mensuelle</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Objectif</span>
                    <span className="font-medium">{immobilierMetrics.objectif_mensuel.toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Réalisé</span>
                    <span className="font-medium text-green-600">{immobilierMetrics.chiffre_affaires_mensuel.toLocaleString()} FCFA</span>
                  </div>
                  <Progress value={immobilierMetrics.taux_realisation} className="h-2" />
                  <div className="text-center text-sm text-muted-foreground">
                    {immobilierMetrics.taux_realisation.toFixed(1)}% réalisé
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Indicateurs Clés</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Taux d'occupation</span>
                    <span className="font-medium">{financialSummary.stats.taux_occupation}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Loyer moyen</span>
                    <span className="font-medium">{Math.round(averageRent).toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Satisfaction</span>
                    <span className="font-medium">{immobilierMetrics.taux_satisfaction}/5</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Derniers Clients</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {propertyClients.slice(0, 3).map((client) => (
                    <div key={client.id} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <Users className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{client.nom} {client.prenom}</p>
                        <p className="text-xs text-muted-foreground">{client.email}</p>
                      </div>
                    </div>
                  ))}
                  {propertyClients.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Aucun client immobilier
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  )
}