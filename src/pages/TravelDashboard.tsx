import { useGMCData } from "@/hooks/useGMCData"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
  Plane, 
  Users, 
  Ticket, 
  Calendar,
  AlertTriangle,
  Globe,
  MapPin,
  FileText,
  CheckCircle,
  Plus,
  Settings
} from "lucide-react"

export default function TravelDashboard() {
  const { 
    travelClients, 
    travelReservations, 
    travelPayments,
    getVoyagePerformance,
    financialSummary
  } = useGMCData()

  const voyageMetrics = getVoyagePerformance()

  // Données pour les graphiques
  const destinationsByRegion = [
    { name: 'Europe', value: Math.floor(travelPayments.length * 0.4), color: '#3b82f6' },
    { name: 'CEDEAO', value: Math.floor(travelPayments.length * 0.35), color: '#8b5cf6' },
    { name: 'Afrique', value: Math.floor(travelPayments.length * 0.15), color: '#10b981' },
    { name: 'Monde', value: Math.floor(travelPayments.length * 0.1), color: '#f59e0b' }
  ]

  const monthlyRevenue = [
    { month: 'Jan', revenue: 850000 },
    { month: 'Fév', revenue: 1200000 },
    { month: 'Mar', revenue: 950000 },
    { month: 'Avr', revenue: 1400000 },
    { month: 'Mai', revenue: 1650000 },
    { month: 'Juin', revenue: 1800000 }
  ]

  const activeReservations = travelPayments.length
  const confirmedReservations = travelPayments.filter(p => p.statut === 'completed').length
  const upcomingDepartures = Math.floor(travelPayments.length * 0.6)
  const totalRevenue = financialSummary.revenus.voyage
  const averageBookingValue = totalRevenue / Math.max(travelPayments.length, 1)

  // Données pour actions rapides
  const quickActions = [
    { name: 'Nouvelle Réservation', icon: Plus, color: 'bg-blue-500' },
    { name: 'Nouveau Client', icon: Users, color: 'bg-green-500' },
    { name: 'Planifier Départ', icon: Calendar, color: 'bg-purple-500' },
    { name: 'Générer Rapport', icon: FileText, color: 'bg-orange-500' }
  ]

  // Données pour notifications
  const notifications = [
    {
      id: 1,
      type: 'warning' as const,
      title: 'Départs prochains',
      message: `${upcomingDepartures} départs programmés dans les 7 prochains jours`,
      time: 'Il y a 1h',
      urgent: true,
      icon: AlertTriangle
    },
    {
      id: 2,
      type: 'info' as const,
      title: 'Nouvelles destinations',
      message: '5 nouvelles destinations ajoutées au catalogue',
      time: 'Il y a 3h',
      urgent: false,
      icon: Globe
    },
    {
      id: 3,
      type: 'success' as const,
      title: 'Objectif mensuel',
      message: 'Objectif de réservations atteint à 95%',
      time: 'Hier',
      urgent: false,
      icon: CheckCircle
    }
  ]

  // Données pour événements
  const upcomingEvents = [
    {
      id: 1,
      title: 'Départ vol Paris',
      time: '09:30',
      date: 'Aujourd\'hui',
      client: 'Amadou Diallo',
      type: 'departure',
      typeLabel: 'Départ'
    },
    {
      id: 2,
      title: 'Réservation Abidjan',
      time: '14:00',
      date: 'Demain',
      client: 'Fatou Sow',
      type: 'booking',
      typeLabel: 'Réservation'
    },
    {
      id: 3,
      title: 'Vol retour Casablanca',
      time: '16:45',
      date: '18 Sept',
      client: 'Omar Ba',
      type: 'return',
      typeLabel: 'Retour'
    }
  ]

  // Données pour activités récentes
  const recentActivities = [
    {
      id: 1,
      type: 'booking',
      title: 'Nouvelle réservation',
      description: 'Vol Paris - 15 Septembre',
      client: 'Marie Dieng',
      time: 'Il y a 2h',
      status: 'success' as const,
      icon: Ticket
    },
    {
      id: 2,
      type: 'payment',
      title: 'Paiement reçu',
      description: 'Voyage Abidjan - Fatou Sow',
      client: 'Fatou Sow',
      time: 'Il y a 4h',
      status: 'success' as const,
      icon: CheckCircle
    },
    {
      id: 3,
      type: 'modification',
      title: 'Modification réservation',
      description: 'Changement de date - Vol Rome',
      client: 'Ibrahima Fall',
      time: 'Il y a 6h',
      status: 'pending' as const,
      icon: Settings
    },
    {
      id: 4,
      type: 'consultation',
      title: 'Consultation voyage',
      description: 'Devis voyage groupe - Dubai',
      client: 'Entreprise XYZ',
      time: 'Il y a 8h',
      status: 'scheduled' as const,
      icon: Calendar
    }
  ]

  // Données pour les cartes de secteur
  const sectorCards = [
    {
      name: 'Europe',
      value: destinationsByRegion.find(d => d.name === 'Europe')?.value || 0,
      subtitle: 'Voyages vers l\'Europe',
      details: {
        label: 'Prix moyen',
        value: `${Math.round(averageBookingValue * 1.2).toLocaleString()} FCFA`
      },
      icon: Globe,
      color: 'text-blue-600'
    },
    {
      name: 'CEDEAO',
      value: destinationsByRegion.find(d => d.name === 'CEDEAO')?.value || 0,
      subtitle: 'Voyages CEDEAO',
      details: {
        label: 'Prix moyen',
        value: `${Math.round(averageBookingValue * 0.6).toLocaleString()} FCFA`
      },
      icon: MapPin,
      color: 'text-purple-600'
    },
    {
      name: 'Autres Destinations',
      value: (destinationsByRegion.find(d => d.name === 'Afrique')?.value || 0) + 
             (destinationsByRegion.find(d => d.name === 'Monde')?.value || 0),
      subtitle: 'Afrique & Monde',
      details: {
        label: 'Prix moyen',
        value: `${Math.round(averageBookingValue * 1.5).toLocaleString()} FCFA`
      },
      icon: Plane,
      color: 'text-green-600'
    }
  ]

  return (
    <DashboardLayout
      title="Dashboard Voyage"
      description="Vue d'ensemble de l'activité voyage GMC"
      sectorName="Secteur Voyage"
      sectorIcon={Plane}
    >
      {/* Métriques principales */}
      <MetricsGrid
        metrics={voyageMetrics}
        primaryMetricIcon={Ticket}
        primaryMetricTitle="Réservations Actives"
        primaryMetricValue={activeReservations}
        primaryMetricSubtitle={`${confirmedReservations} confirmées`}
        primaryMetricAlert={upcomingDepartures > 0 ? {
          value: `${upcomingDepartures} départs prochains`,
          isPositive: true
        } : undefined}
      />

      {/* Graphiques et analyses */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="reservations">Réservations</TabsTrigger>
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
            distributionData={destinationsByRegion}
            distributionTitle="Répartition par Destination"
            distributionDescription="Distribution des voyages par région"
            revenueData={monthlyRevenue}
            revenueTitle="Évolution du Chiffre d'Affaires"
            revenueDescription="Revenus mensuels du secteur voyage"
          />

          {/* Activités récentes */}
          <RecentActivities activities={recentActivities} />

          {/* Cartes de secteur */}
          <SectorCards sectors={sectorCards} />
        </TabsContent>

        <TabsContent value="reservations" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Réservations par Statut</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Confirmées</span>
                    <Badge className="bg-green-100 text-green-800">{confirmedReservations}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">En attente</span>
                    <Badge className="bg-yellow-100 text-yellow-800">{activeReservations - confirmedReservations}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Annulées</span>
                    <Badge className="bg-red-100 text-red-800">{Math.floor(activeReservations * 0.05)}</Badge>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="font-medium">Total</span>
                    <Badge variant="outline">{activeReservations}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Chiffre d'Affaires par Destination</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {totalRevenue.toLocaleString()} FCFA
                </div>
                <p className="text-sm text-muted-foreground mb-4">Revenus mensuels voyage</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Europe</span>
                    <span>{Math.round(totalRevenue * 0.55).toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>CEDEAO</span>
                    <span>{Math.round(totalRevenue * 0.25).toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Autres</span>
                    <span>{Math.round(totalRevenue * 0.20).toLocaleString()} FCFA</span>
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
                    <span className="font-medium">{voyageMetrics.objectif_mensuel.toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Réalisé</span>
                    <span className="font-medium text-green-600">{voyageMetrics.chiffre_affaires_mensuel.toLocaleString()} FCFA</span>
                  </div>
                  <Progress value={voyageMetrics.taux_realisation} className="h-2" />
                  <div className="text-center text-sm text-muted-foreground">
                    {voyageMetrics.taux_realisation.toFixed(1)}% réalisé
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
                    <span className="text-sm">Taux de confirmation</span>
                    <span className="font-medium">{activeReservations > 0 ? Math.round((confirmedReservations / activeReservations) * 100) : 0}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Valeur moyenne</span>
                    <span className="font-medium">{Math.round(averageBookingValue).toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Satisfaction</span>
                    <span className="font-medium">{voyageMetrics.taux_satisfaction}/5</span>
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
                  {travelClients.slice(0, 3).map((client) => (
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
                  {travelClients.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Aucun client voyage
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