import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus, DollarSign, PieChart, BarChart3 } from "lucide-react"

interface MetricData {
  label: string
  value: number
  target: number
  format: 'currency' | 'percentage' | 'number'
  trend?: {
    value: number
    isPositive: boolean
  }
}

// Métriques basées sur les données réelles (1 client actuel)
const metricsData: MetricData[] = [
  {
    label: "Revenus Locatifs",
    value: 1200000, // Basé sur 1 client actif
    target: 10000000, // Objectif pour plus de clients
    format: 'currency',
    trend: { value: 15.8, isPositive: true }
  },
  {
    label: "Primes Assurances",
    value: 0, // Secteur à développer
    target: 2000000,
    format: 'currency',
    trend: { value: 0, isPositive: true }
  },
  {
    label: "Taux de Recouvrement",
    value: 100, // 1 client = 100% recouvrement
    target: 98,
    format: 'percentage',
    trend: { value: 2.0, isPositive: true }
  },
  {
    label: "Coûts de Maintenance",
    value: 500000, // Coûts système de base
    target: 800000,
    format: 'currency',
    trend: { value: -37.5, isPositive: true }
  }
]

function formatValue(value: number, format: MetricData['format']): string {
  switch (format) {
    case 'currency':
      return `${(value / 1000000).toFixed(1)}M CFA`
    case 'percentage':
      return `${value}%`
    case 'number':
      return value.toLocaleString('fr-FR')
    default:
      return value.toString()
  }
}

export function FinancialMetrics() {
  return (
    <Card className="gmc-card-elevated">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Métriques Financières
            </CardTitle>
            <CardDescription>Performance par rapport aux objectifs mensuels</CardDescription>
          </div>
          <Badge variant="outline" className="gmc-badge">
            <PieChart className="h-3 w-3 mr-1" />
            En temps réel
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {metricsData.map((metric, index) => {
          const progressPercentage = (metric.value / metric.target) * 100
          const isOverTarget = progressPercentage > 100
          
          return (
            <div key={index} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h4 className="font-semibold text-sm">{metric.label}</h4>
                  {metric.trend && (
                    <div className="flex items-center gap-1">
                      {metric.trend.isPositive ? (
                        <TrendingUp className="h-3 w-3 text-green-500" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-500" />
                      )}
                      <span className={`text-xs font-medium ${
                        metric.trend.isPositive ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {metric.trend.isPositive ? '+' : ''}{metric.trend.value}%
                      </span>
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div className="font-bold text-sm">
                    {formatValue(metric.value, metric.format)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    sur {formatValue(metric.target, metric.format)}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Progress 
                  value={Math.min(progressPercentage, 100)} 
                  className="h-2"
                />
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">
                    {Math.round(progressPercentage)}% de l'objectif
                  </span>
                  {isOverTarget && (
                    <Badge variant="secondary" className="text-xs px-2 py-0">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Dépassé
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          )
        })}
        
        <div className="border-t pt-4 mt-6">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
              <div className="text-2xl font-bold text-green-600">58%</div>
              <div className="text-xs text-green-700 dark:text-green-300">Rentabilité actuelle</div>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">+∞%</div>
              <div className="text-xs text-blue-700 dark:text-blue-300">Croissance depuis le lancement</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}