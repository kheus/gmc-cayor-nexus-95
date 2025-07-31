import { TrendingUp, DollarSign, TrendingDown, BarChart3, Building2, Plane, Shield } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RevenueChart } from "@/components/charts/RevenueChart"
import { useGMCData } from '@/hooks/useGMCData'

export default function Finance() {
  const { 
    financialSummary, 
    getImmobilierPerformance, 
    getVoyagePerformance,
    getTotalRevenue,
    getTotalExpenses,
    getTotalProfit,
    getProfitMargin
  } = useGMCData()

  const immobilierPerf = getImmobilierPerformance()
  const voyagePerf = getVoyagePerformance()
  
  const financeData = {
    revenus: {
      total: getTotalRevenue(),
      immobilier: financialSummary.revenus.immobilier,
      voyage: financialSummary.revenus.voyage
    },
    depenses: {
      total: getTotalExpenses(),
      immobilier: financialSummary.depenses.immobilier,
      voyage: financialSummary.depenses.voyage,
      administratif: Math.floor(getTotalExpenses() * 0.15) // 15% frais admin
    },
    benefice: getTotalProfit(),
    rentabilite: getProfitMargin()
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-primary">Suivi Financier GMC</h1>
        <p className="text-muted-foreground">Analyse consolidée Immobilier + Voyage + Assurance - Revenus, dépenses et rentabilité</p>
      </div>

      {/* Statistiques principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenus Totaux</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{financeData.revenus.total.toLocaleString()} CFA</div>
            <p className="text-xs text-muted-foreground">Immobilier + Voyage + Assurance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dépenses Totales</CardTitle>
            <TrendingDown className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{financeData.depenses.total.toLocaleString()} CFA</div>
            <p className="text-xs text-muted-foreground">Charges opérationnelles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bénéfice Net</CardTitle>
            <DollarSign className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{financeData.benefice.toLocaleString()} CFA</div>
            <p className="text-xs text-muted-foreground">Revenus - Dépenses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rentabilité</CardTitle>
            <BarChart3 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{financeData.rentabilite.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Marge bénéficiaire</p>
          </CardContent>
        </Card>
      </div>

      {/* Détail par secteur */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenus par Secteur</CardTitle>
            <CardDescription>Répartition des revenus mensuels GMC</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-primary" />
                  <div>
                    <p className="font-medium">Immobilier</p>
                    <p className="text-sm text-muted-foreground">{immobilierPerf.part_ca.toFixed(0)}% du CA total</p>
                  </div>
                </div>
                <span className="text-lg font-bold text-success">{financeData.revenus.immobilier.toLocaleString()} CFA</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Plane className="h-4 w-4 text-primary" />
                  <div>
                    <p className="font-medium">Voyage</p>
                    <p className="text-sm text-muted-foreground">{voyagePerf.part_ca.toFixed(0)}% du CA total</p>
                  </div>
                </div>
                <span className="text-lg font-bold text-success">{financeData.revenus.voyage.toLocaleString()} CFA</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  <div>
                    <p className="font-medium">Assurance</p>
                    <p className="text-sm text-muted-foreground">0% du CA total</p>
                  </div>
                </div>
                <span className="text-lg font-bold text-success">0 CFA</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dépenses par Secteur</CardTitle>
            <CardDescription>Répartition des coûts mensuels GMC</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-destructive" />
                  <div>
                    <p className="font-medium">Charges Immobilier</p>
                    <p className="text-sm text-muted-foreground">Maintenance, assurances, taxes</p>
                  </div>
                </div>
                <span className="text-lg font-bold text-destructive">{financeData.depenses.immobilier.toLocaleString()} CFA</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Plane className="h-4 w-4 text-destructive" />
                  <div>
                    <p className="font-medium">Charges Voyage</p>
                    <p className="text-sm text-muted-foreground">Commissions, carburant, assurances</p>
                  </div>
                </div>
                <span className="text-lg font-bold text-destructive">{financeData.depenses.voyage.toLocaleString()} CFA</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-destructive" />
                  <div>
                    <p className="font-medium">Charges Assurance</p>
                    <p className="text-sm text-muted-foreground">Commissions, gestion, administratif</p>
                  </div>
                </div>
                <span className="text-lg font-bold text-destructive">0 CFA</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">Frais Administratifs</p>
                  <p className="text-sm text-muted-foreground">Personnel, bureaux, informatique</p>
                </div>
                <span className="text-lg font-bold text-destructive">{financeData.depenses.administratif.toLocaleString()} CFA</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graphique d'évolution */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Évolution Financière GMC</CardTitle>
            <CardDescription>Performance consolidée Immobilier + Voyage + Assurance sur 12 mois</CardDescription>
          </div>
          <div className="flex gap-2">
            <Select defaultValue="12months">
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3months">3 mois</SelectItem>
                <SelectItem value="6months">6 mois</SelectItem>
                <SelectItem value="12months">12 mois</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              Exporter PDF
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <RevenueChart />
        </CardContent>
      </Card>
    </div>
  )
}