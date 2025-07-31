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
  Shield, 
  Users, 
  FileText, 
  Calendar,
  AlertTriangle,
  Car,
  Home,
  Heart,
  CheckCircle,
  Plus,
  Settings
} from "lucide-react"

export default function InsuranceDashboard() {
  const { 
    insuranceClients, 
    insuranceContracts, 
    insurancePayments,
    getAssurancePerformance,
    financialSummary
  } = useGMCData()

  const assuranceMetrics = getAssurancePerformance()

  // Données pour les graphiques
  const contractsByType = [
    { name: 'Auto', value: Math.floor(insurancePayments.length * 0.6), color: '#3b82f6' },
    { name: 'Habitation', value: Math.floor(insurancePayments.length * 0.25), color: '#8b5cf6' },
    { name: 'Vie', value: Math.floor(insurancePayments.length * 0.1), color: '#10b981' },
    { name: 'Santé', value: Math.floor(insurancePayments.length * 0.05), color: '#f59e0b' }
  ]

  const monthlyRevenue = [
    { month: 'Jan', revenue: 180000 },
    { month: 'Fév', revenue: 220000 },
    { month: 'Mar', revenue: 265000 },
    { month: 'Avr', revenue: 285000 },
    { month: 'Mai', revenue: 310000 },
    { month: 'Juin', revenue: 350000 }
  ]

  const activeContracts = insurancePayments.length
  const confirmedPayments = insurancePayments.filter(p => p.statut === 'completed').length
  const expiringContracts = Math.floor(activeContracts * 0.15)
  const totalRevenue = financialSummary.revenus.assurance
  const averagePremium = totalRevenue / Math.max(insurancePayments.length, 1)

  // Données pour actions rapides
  const quickActions = [
    { name: 'Nouveau Contrat', icon: Plus, color: 'bg-blue-500' },
    { name: 'Nouveau Client', icon: Users, color: 'bg-green-500' },
    { name: 'Renouveler Contrat', icon: Calendar, color: 'bg-purple-500' },
    { name: 'Générer Rapport', icon: FileText, color: 'bg-orange-500' }
  ]

  // Données pour notifications
  const notifications = [
    {
      id: 1,
      type: 'warning' as const,
      title: 'Contrats expirent bientôt',
      message: `${expiringContracts} contrats d'assurance expirent dans les 30 prochains jours`,
      time: 'Il y a 1h',
      urgent: true,
      icon: AlertTriangle
    },
    {
      id: 2,
      type: 'info' as const,
      title: 'Nouvelles offres',
      message: '3 nouvelles polices d\'assurance disponibles',
      time: 'Il y a 3h',
      urgent: false,
      icon: Shield
    },
    {
      id: 3,
      type: 'success' as const,
      title: 'Objectif primes',
      message: 'Objectif de collecte de primes atteint à 92%',
      time: 'Hier',
      urgent: false,
      icon: CheckCircle
    }
  ]

  // Données pour événements
  const upcomingEvents = [
    {
      id: 1,
      title: 'Échéance contrat auto',
      time: '10:00',
      date: 'Aujourd\'hui',
      client: 'Moussa Ndiaye',
      type: 'expiry',
      typeLabel: 'Échéance'
    },
    {
      id: 2,
      title: 'Nouveau contrat habitation',
      time: '15:30',
      date: 'Demain',
      client: 'Aissatou Kane',
      type: 'contract',
      typeLabel: 'Contrat'
    },
    {
      id: 3,
      title: 'Renouvellement assurance vie',
      time: '09:00',
      date: '20 Sept',
      client: 'Ibrahima Diop',
      type: 'renewal',
      typeLabel: 'Renouvellement'
    }
  ]

  // Données pour activités récentes
  const recentActivities = [
    {
      id: 1,
      type: 'contract',
      title: 'Nouveau contrat signé',
      description: 'Assurance auto - Moussa Ndiaye',
      client: 'Moussa Ndiaye',
      time: 'Il y a 2h',
      status: 'success' as const,
      icon: FileText
    },
    {
      id: 2,
      type: 'payment',
      title: 'Prime reçue',
      description: 'Assurance habitation - Aissatou Kane',
      client: 'Aissatou Kane',
      time: 'Il y a 4h',
      status: 'success' as const,
      icon: CheckCircle
    },
    {
      id: 3,
      type: 'renewal',
      title: 'Renouvellement en cours',
      description: 'Assurance vie - Famille Diop',
      client: 'Ibrahima Diop',
      time: 'Il y a 6h',
      status: 'pending' as const,
      icon: Settings
    },
    {
      id: 4,
      type: 'consultation',
      title: 'Consultation prévue',
      description: 'Devis assurance entreprise',
      client: 'Société SARL',
      time: 'Il y a 8h',
      status: 'scheduled' as const,
      icon: Calendar
    }
  ]

  // Données pour les cartes de secteur
  const sectorCards = [
    {
      name: 'Assurance Auto',
      value: contractsByType.find(c => c.name === 'Auto')?.value || 0,
      subtitle: 'Contrats auto actifs',
      details: {
        label: 'Prime moyenne',
        value: `${Math.round(averagePremium * 1.2).toLocaleString()} FCFA/mois`
      },
      icon: Car,
      color: 'text-blue-600'
    },
    {
      name: 'Assurance Habitation',
      value: contractsByType.find(c => c.name === 'Habitation')?.value || 0,
      subtitle: 'Contrats habitation',
      details: {
        label: 'Prime moyenne',
        value: `${Math.round(averagePremium * 0.8).toLocaleString()} FCFA/mois`
      },
      icon: Home,
      color: 'text-purple-600'
    },
    {
      name: 'Assurance Vie & Santé',
      value: (contractsByType.find(c => c.name === 'Vie')?.value || 0) + 
             (contractsByType.find(c => c.name === 'Santé')?.value || 0),
      subtitle: 'Contrats vie & santé',
      details: {
        label: 'Prime moyenne',
        value: `${Math.round(averagePremium * 1.5).toLocaleString()} FCFA/mois`
      },
      icon: Heart,
      color: 'text-green-600'
    }
  ]

  return (
    <DashboardLayout
      title="Dashboard Assurance"
      description="Vue d'ensemble de l'activité assurance GMC"
      sectorName="Secteur Assurance"
      sectorIcon={Shield}
    >
      {/* Métriques principales */}
      <MetricsGrid
        metrics={assuranceMetrics}
        primaryMetricIcon={FileText}
        primaryMetricTitle="Contrats Actifs"
        primaryMetricValue={activeContracts}
        primaryMetricSubtitle={`${confirmedPayments} paiements confirmés`}
        primaryMetricAlert={expiringContracts > 0 ? {
          value: `${expiringContracts} expirent bientôt`,
          isPositive: false
        } : undefined}
      />

      {/* Graphiques et analyses */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="contracts">Contrats</TabsTrigger>
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
            distributionData={contractsByType}
            distributionTitle="Répartition par Type d'Assurance"
            distributionDescription="Distribution des contrats par type"
            revenueData={monthlyRevenue}
            revenueTitle="Évolution du Chiffre d'Affaires"
            revenueDescription="Revenus mensuels du secteur assurance"
          />

          {/* Activités récentes */}
          <RecentActivities activities={recentActivities} />

          {/* Cartes de secteur */}
          <SectorCards sectors={sectorCards} />
        </TabsContent>

        <TabsContent value="contracts" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Contrats par Statut</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Actifs</span>
                    <Badge className="bg-green-100 text-green-800">{confirmedPayments}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">En attente</span>
                    <Badge className="bg-yellow-100 text-yellow-800">{activeContracts - confirmedPayments}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Expirés</span>
                    <Badge className="bg-red-100 text-red-800">{Math.floor(activeContracts * 0.05)}</Badge>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="font-medium">Total</span>
                    <Badge variant="outline">{activeContracts}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Primes Mensuelles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {totalRevenue.toLocaleString()} FCFA
                </div>
                <p className="text-sm text-muted-foreground mb-4">Revenus mensuels assurance</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Auto</span>
                    <span>{Math.round(totalRevenue * 0.60).toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Habitation</span>
                    <span>{Math.round(totalRevenue * 0.25).toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Vie & Santé</span>
                    <span>{Math.round(totalRevenue * 0.15).toLocaleString()} FCFA</span>
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
                    <span className="font-medium">{assuranceMetrics.objectif_mensuel.toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Réalisé</span>
                    <span className="font-medium text-green-600">{assuranceMetrics.chiffre_affaires_mensuel.toLocaleString()} FCFA</span>
                  </div>
                  <Progress value={assuranceMetrics.taux_realisation} className="h-2" />
                  <div className="text-center text-sm text-muted-foreground">
                    {assuranceMetrics.taux_realisation.toFixed(1)}% réalisé
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
                    <span className="text-sm">Taux de paiement</span>
                    <span className="font-medium">{activeContracts > 0 ? Math.round((confirmedPayments / activeContracts) * 100) : 0}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Prime moyenne</span>
                    <span className="font-medium">{Math.round(averagePremium).toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Satisfaction</span>
                    <span className="font-medium">{assuranceMetrics.taux_satisfaction}/5</span>
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
                  {insuranceClients.slice(0, 3).map((client) => (
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
                  {insuranceClients.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Aucun client assurance
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