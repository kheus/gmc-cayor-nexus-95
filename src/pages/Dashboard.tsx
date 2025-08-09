import { useState, useEffect } from "react"
import { useGMCData } from "@/hooks/useGMCData"
import { useFinancialAnalytics } from '@/hooks/useFinancialAnalytics'
import { useDataSync } from "@/hooks/useDataSync"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExecutiveSummary } from "@/components/dashboard/ExecutiveSummary"
import { PerformanceIndicators } from "@/components/dashboard/PerformanceIndicators"
import { AlertsAndInsights } from "@/components/dashboard/AlertsAndInsights"
import { MarketTrends } from "@/components/dashboard/MarketTrends"
import { 
  Building2, 
  Users, 
  Euro, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  Calendar,
  Home,
  Building,
  Activity,
  Plane,
  Shield,
  BarChart3,
  PieChart as PieChartIcon,
  Target,
  Clock,
  CheckCircle,
  FileText
} from "lucide-react"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, LineChart, Line, ComposedChart, Area, AreaChart } from "recharts"

export default function Dashboard() {
  const { 
    propertyClients, 
    propertyPayments,
    getImmobilierPerformance,
    financialSummary,
    loading: gmcLoading,
    lastSync: gmcLastSync,
    isStale: gmcIsStale
  } = useGMCData()

  const immobilierMetrics = getImmobilierPerformance()
  
  // État de synchronisation unifié
  const { 
    clients: realClients, 
    loading: dataLoading, 
    lastSync: dataLastSync,
    isStale: dataIsStale 
  } = useDataSync()
  
  // Vérification globale de synchronisation
  const isSyncing = gmcLoading || dataLoading
  const lastGlobalSync = gmcLastSync && dataLastSync 
    ? new Date(Math.max(gmcLastSync.getTime(), dataLastSync.getTime()))
    : gmcLastSync || dataLastSync
  const isDataStale = gmcIsStale || dataIsStale
  
  // État temps réel
  const [currentTime, setCurrentTime] = useState(new Date())
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Données unifiées tous secteurs
  const allSectorsRevenue = {
    immobilier: financialSummary.revenus.immobilier,
    voyage: financialSummary.revenus.voyage,
    assurance: financialSummary.revenus.assurance
  }

  const totalRevenue = Object.values(allSectorsRevenue).reduce((a, b) => a + b, 0)
  
  // Utiliser les données financières réelles ou calculées
  const { monthlyData, getSectorDistribution } = useFinancialAnalytics()
  const sectorDistribution = getSectorDistribution(allSectorsRevenue)
  
  const sectorMetrics = {
    immobilier: {
      clients: realClients.filter(c => c.secteurs?.includes('immobilier')).length,
      croissance: immobilierMetrics.croissance_mensuelle,
      satisfaction: immobilierMetrics.taux_satisfaction
    },
    voyage: {
      clients: realClients.filter(c => c.secteurs?.includes('voyage')).length,
      croissance: 12.5,
      satisfaction: 4.6
    },
    assurance: {
      clients: realClients.filter(c => c.secteurs?.includes('assurance')).length,
      croissance: 8.2,
      satisfaction: 4.3
    }
  }

  const totalClients = realClients.length // Utiliser le nombre total de vrais clients
  const avgSatisfaction = Object.values(sectorMetrics).reduce((sum, sector) => sum + sector.satisfaction, 0) / 3

  // Données KPI consolidés
  const kpiData = [
    { name: 'Immo', value: sectorMetrics.immobilier.clients, growth: sectorMetrics.immobilier.croissance },
    { name: 'Voyage', value: sectorMetrics.voyage.clients, growth: sectorMetrics.voyage.croissance },
    { name: 'Assurance', value: sectorMetrics.assurance.clients, growth: sectorMetrics.assurance.croissance }
  ]

  // Données pour le résumé exécutif - utiliser données temps réel
  const currentMonth = currentTime.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
  const monthlyTarget = 9000000
  const revenueGrowth = 15.3
  const clientGrowth = Math.floor(totalClients * 0.12)
  const targetProgress = (totalRevenue / monthlyTarget) * 100

  // KPIs professionnels détaillés
  const performanceKPIs = [
    {
      name: "CA Mensuel",
      value: totalRevenue,
      target: monthlyTarget,
      unit: "FCFA",
      trend: revenueGrowth,
      category: 'financial' as const,
      priority: 'high' as const
    },
    {
      name: "Nouveaux Clients",
      value: clientGrowth,
      target: Math.floor(totalClients * 0.15),
      unit: "clients",
      trend: 8.5,
      category: 'operational' as const,
      priority: 'high' as const
    },
    {
      name: "Taux de Satisfaction",
      value: Math.round(avgSatisfaction * 100) / 100,
      target: 4.5,
      unit: "/5",
      trend: 2.1,
      category: 'satisfaction' as const,
      priority: 'medium' as const
    },
    {
      name: "Contrats Signés",
      value: propertyClients.length + Math.floor(totalClients * 0.6),
      target: totalClients,
      unit: "contrats",
      trend: 12.8,
      category: 'operational' as const,
      priority: 'medium' as const
    },
    {
      name: "Délai Moyen",
      value: 3.2,
      target: 2.5,
      unit: "jours",
      trend: -15.2,
      category: 'operational' as const,
      priority: 'low' as const
    },
    {
      name: "Rentabilité",
      value: 68,
      target: 75,
      unit: "%",
      trend: 4.7,
      category: 'financial' as const,
      priority: 'medium' as const
    }
  ]

  // Alertes et notifications
  const alerts = [
    {
      id: '1',
      type: 'warning' as const,
      title: 'Objectif mensuel en retard',
      message: `Il reste ${(monthlyTarget - totalRevenue).toLocaleString()} FCFA pour atteindre l'objectif`,
      action: 'Voir détails',
      priority: 'high' as const,
      category: 'financial' as const,
      timestamp: 'Il y a 2h'
    },
    {
      id: '2',
      type: 'success' as const,
      title: 'Secteur voyage en croissance',
      message: 'Performance exceptionnelle avec +12.5% de croissance',
      priority: 'medium' as const,
      category: 'operational' as const,
      timestamp: 'Il y a 4h'
    },
    {
      id: '3',
      type: 'info' as const,
      title: 'Nouveau rapport disponible',
      message: 'Analyse mensuelle des performances secteurs',
      action: 'Télécharger',
      priority: 'low' as const,
      category: 'operational' as const,
      timestamp: 'Hier'
    }
  ]

  // Insights et recommandations
  const insights = [
    {
      id: '1',
      title: 'Opportunité secteur immobilier',
      description: 'Le secteur immobilier montre une forte demande avec une croissance de 15.2%',
      impact: 'positive' as const,
      recommendation: 'Augmenter l\'allocation des ressources marketing sur ce secteur',
      sector: 'Immobilier'
    },
    {
      id: '2',
      title: 'Optimisation délais voyage',
      description: 'Les délais de traitement des réservations peuvent être réduits',
      impact: 'neutral' as const,
      recommendation: 'Automatiser certaines étapes du processus de réservation',
      sector: 'Voyage'
    },
    {
      id: '3',
      title: 'Satisfaction assurance',
      description: 'Le secteur assurance présente le plus faible taux de satisfaction',
      impact: 'negative' as const,
      recommendation: 'Renforcer la formation équipe et améliorer le suivi client',
      sector: 'Assurance'
    }
  ]

  return (
    <div className="space-y-6">
      {/* En-tête unifié */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">Vue d'Ensemble GMC</h1>
          <p className="text-muted-foreground">
            Dashboard unifié de tous les secteurs d'activité
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            {currentTime.toLocaleDateString('fr-FR')} {currentTime.toLocaleTimeString('fr-FR')}
          </Badge>
          
          {/* Indicateur de synchronisation */}
          <Badge 
            variant={isSyncing ? "default" : isDataStale ? "destructive" : "secondary"} 
            className="gap-2"
          >
            <Activity className={`h-4 w-4 ${isSyncing ? 'animate-pulse' : ''}`} />
            {isSyncing ? 'Synchronisation...' : 
             isDataStale ? 'Données obsolètes' : 
             'Synchronisé'}
          </Badge>
          
          {lastGlobalSync && (
            <Badge variant="outline" className="gap-2 text-xs">
              <Clock className="h-3 w-3" />
              Dernière sync: {lastGlobalSync.toLocaleTimeString('fr-FR')}
            </Badge>
          )}
          
          <Badge variant="outline" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Métriques Globales
          </Badge>
        </div>
      </div>

      {/* Résumé Exécutif avec indicateurs de sync */}
      <ExecutiveSummary
        totalRevenue={totalRevenue}
        revenueGrowth={revenueGrowth}
        totalClients={totalClients}
        clientGrowth={clientGrowth}
        monthlyTarget={monthlyTarget}
        targetProgress={targetProgress}
        currentMonth={currentMonth}
        isLoading={isSyncing}
        lastSync={lastGlobalSync}
      />

      {/* Indicateurs de Performance */}
      <PerformanceIndicators kpis={performanceKPIs} />

      {/* Alertes et Insights */}
      <AlertsAndInsights alerts={alerts} insights={insights} />

      {/* Tendances de marché avec sync */}
      <MarketTrends 
        monthlyData={monthlyData} 
        sectorDistribution={sectorDistribution} 
        isLoading={isSyncing}
        lastSync={lastGlobalSync}
      />

      {/* Répartition par secteur */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Building2 className="h-4 w-4 text-blue-600" />
              Immobilier
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-blue-600">
              {(allSectorsRevenue.immobilier / 1000000).toFixed(1)}M FCFA
            </div>
            <p className="text-xs text-muted-foreground">
              {sectorDistribution[0].percentage}% du total
            </p>
            <div className="mt-2">
              <div className="text-xs text-muted-foreground">Clients: {sectorMetrics.immobilier.clients}</div>
              <div className="text-xs text-green-600">+{sectorMetrics.immobilier.croissance}% croissance</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Plane className="h-4 w-4 text-green-600" />
              Voyage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-green-600">
              {(allSectorsRevenue.voyage / 1000000).toFixed(1)}M FCFA
            </div>
            <p className="text-xs text-muted-foreground">
              {sectorDistribution[1].percentage}% du total
            </p>
            <div className="mt-2">
              <div className="text-xs text-muted-foreground">Clients: {sectorMetrics.voyage.clients}</div>
              <div className="text-xs text-green-600">+{sectorMetrics.voyage.croissance}% croissance</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Shield className="h-4 w-4 text-purple-600" />
              Assurance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-purple-600">
              {(allSectorsRevenue.assurance / 1000000).toFixed(1)}M FCFA
            </div>
            <p className="text-xs text-muted-foreground">
              {sectorDistribution[2].percentage}% du total
            </p>
            <div className="mt-2">
              <div className="text-xs text-muted-foreground">Clients: {sectorMetrics.assurance.clients}</div>
              <div className="text-xs text-green-600">+{sectorMetrics.assurance.croissance}% croissance</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques et analyses */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="sectors">Par Secteur</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Répartition des Revenus par Secteur</CardTitle>
                <CardDescription>Distribution du chiffre d'affaires GMC</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sectorDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name} ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {sectorDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${Number(value).toLocaleString()} FCFA`, 'Revenus']} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Évolution Mensuelle Global</CardTitle>
                <CardDescription>Revenus combinés de tous les secteurs</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${Number(value).toLocaleString()} FCFA`, 'Revenus']} />
                    <Area type="monotone" dataKey="total" stackId="1" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Évolution par Secteur</CardTitle>
              <CardDescription>Comparaison mensuelle des trois secteurs</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${Number(value).toLocaleString()} FCFA`, 'Revenus']} />
                  <Bar dataKey="immobilier" fill="#3b82f6" name="Immobilier" />
                  <Bar dataKey="voyage" fill="#10b981" name="Voyage" />
                  <Bar dataKey="assurance" fill="#8b5cf6" name="Assurance" />
                  <Line type="monotone" dataKey="total" stroke="#ef4444" strokeWidth={3} name="Total" />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sectors" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-blue-600" />
                  Immobilier
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Revenus</span>
                    <span className="font-medium">{(allSectorsRevenue.immobilier / 1000000).toFixed(1)}M FCFA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Clients</span>
                    <span className="font-medium">{sectorMetrics.immobilier.clients}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Satisfaction</span>
                    <span className="font-medium">{sectorMetrics.immobilier.satisfaction}/5</span>
                  </div>
                  <Progress value={(allSectorsRevenue.immobilier / totalRevenue) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plane className="h-5 w-5 text-green-600" />
                  Voyage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Revenus</span>
                    <span className="font-medium">{(allSectorsRevenue.voyage / 1000000).toFixed(1)}M FCFA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Clients</span>
                    <span className="font-medium">{sectorMetrics.voyage.clients}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Satisfaction</span>
                    <span className="font-medium">{sectorMetrics.voyage.satisfaction}/5</span>
                  </div>
                  <Progress value={(allSectorsRevenue.voyage / totalRevenue) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-purple-600" />
                  Assurance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Revenus</span>
                    <span className="font-medium">{(allSectorsRevenue.assurance / 1000000).toFixed(1)}M FCFA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Clients</span>
                    <span className="font-medium">{sectorMetrics.assurance.clients}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Satisfaction</span>
                    <span className="font-medium">{sectorMetrics.assurance.satisfaction}/5</span>
                  </div>
                  <Progress value={(allSectorsRevenue.assurance / totalRevenue) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="clients" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Clients par Secteur</CardTitle>
                <CardDescription>Répartition de la clientèle</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={kpiData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [value, 'Clients']} />
                    <Bar dataKey="value" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Croissance par Secteur</CardTitle>
                <CardDescription>Taux de croissance mensuel</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={kpiData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}%`, 'Croissance']} />
                    <Bar dataKey="growth" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Globale</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Objectif Total</span>
                    <span className="font-medium">12M FCFA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Réalisé</span>
                    <span className="font-medium text-green-600">{(totalRevenue / 1000000).toFixed(1)}M FCFA</span>
                  </div>
                  <Progress value={75} className="h-2" />
                  <div className="text-xs text-center text-muted-foreground">
                    75% de l'objectif atteint
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Croissance Moyenne</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600 mb-2">
                  +{Object.values(sectorMetrics).reduce((sum, sector) => sum + sector.croissance, 0) / 3}%
                </div>
                <p className="text-sm text-muted-foreground">
                  Croissance tous secteurs
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Secteur Leader</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600 mb-2">
                  Immobilier
                </div>
                <p className="text-sm text-muted-foreground">
                  {sectorDistribution[0].percentage}% du CA total
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}