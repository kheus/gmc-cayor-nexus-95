import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, DollarSign, Users, Target, Calendar } from "lucide-react"

interface ExecutiveSummaryProps {
  totalRevenue: number
  revenueGrowth: number
  totalClients: number
  clientGrowth: number
  monthlyTarget: number
  targetProgress: number
  currentMonth: string
}

export function ExecutiveSummary({
  totalRevenue,
  revenueGrowth,
  totalClients,
  clientGrowth,
  monthlyTarget,
  targetProgress,
  currentMonth
}: ExecutiveSummaryProps) {
  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M FCFA`
    }
    return `${(amount / 1000).toFixed(0)}K FCFA`
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* Résumé financier */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            Résumé Financier - {currentMonth}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">
                {formatCurrency(totalRevenue)}
              </div>
              <p className="text-sm text-muted-foreground mb-3">Chiffre d'affaires mensuel</p>
              <div className="flex items-center gap-2">
                {revenueGrowth >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
                <span className={`text-sm font-medium ${revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {revenueGrowth >= 0 ? '+' : ''}{revenueGrowth.toFixed(1)}% vs mois précédent
                </span>
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600 mb-2">
                {formatCurrency(monthlyTarget)}
              </div>
              <p className="text-sm text-muted-foreground mb-3">Objectif mensuel</p>
              <Progress value={targetProgress} className="h-3 mb-2" />
              <p className="text-xs text-muted-foreground">
                {targetProgress.toFixed(1)}% de l'objectif atteint
              </p>
              {targetProgress >= 100 && (
                <Badge className="mt-2 bg-green-100 text-green-800">
                  Objectif dépassé !
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Aperçu clients */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            Base Clients
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600 mb-2">
            {totalClients.toLocaleString()}
          </div>
          <p className="text-sm text-muted-foreground mb-3">Clients actifs</p>
          <div className="flex items-center gap-2 mb-4">
            {clientGrowth >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
            <span className={`text-sm font-medium ${clientGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {clientGrowth >= 0 ? '+' : ''}{clientGrowth} nouveaux clients
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span>Rétention clients</span>
              <span className="font-medium">94%</span>
            </div>
            <div className="flex justify-between text-xs">
              <span>Satisfaction moyenne</span>
              <span className="font-medium">4.3/5</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}