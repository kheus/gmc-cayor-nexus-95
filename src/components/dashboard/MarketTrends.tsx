import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area } from "recharts"
import { TrendingUp, TrendingDown, BarChart3, Target, Globe } from "lucide-react"

interface MarketTrendsProps {
  monthlyData: any[]
  sectorDistribution: any[]
}

export function MarketTrends({ monthlyData, sectorDistribution }: MarketTrendsProps) {
  const marketInsights = [
    {
      title: "Tendance Immobilier",
      description: "Croissance soutenue sur 6 mois",
      trend: 15.2,
      isPositive: true,
      recommendation: "Maintenir l'investissement marketing"
    },
    {
      title: "Marché Voyage",
      description: "Reprise post-covid excellente",
      trend: 12.8,
      isPositive: true,
      recommendation: "Étendre l'offre destinations"
    },
    {
      title: "Secteur Assurance",
      description: "Stabilisation après restructuration",
      trend: 8.2,
      isPositive: true,
      recommendation: "Renforcer équipe commerciale"
    }
  ]

  const competitiveMetrics = [
    { name: "Part de marché", value: 23, target: 30, unit: "%" },
    { name: "NPS Score", value: 68, target: 75, unit: "/100" },
    { name: "Conversion", value: 12.5, target: 15, unit: "%" },
    { name: "Rétention", value: 89, target: 92, unit: "%" }
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Tendances du marché */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            Tendances du Marché
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`${Number(value).toLocaleString()} FCFA`, 'Revenus']} />
                <Area 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#3b82f6" 
                  fill="#3b82f6" 
                  fillOpacity={0.1} 
                />
                <Line 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#3b82f6" 
                  strokeWidth={2} 
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          <div className="space-y-3">
            {marketInsights.map((insight, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium">{insight.title}</h4>
                  <div className="flex items-center gap-1">
                    {insight.isPositive ? (
                      <TrendingUp className="h-3 w-3 text-green-500" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-500" />
                    )}
                    <span className={`text-xs font-medium ${insight.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                      +{insight.trend}%
                    </span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{insight.description}</p>
                <p className="text-xs text-blue-600 font-medium">{insight.recommendation}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Métriques compétitives */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-green-600" />
            Position Concurrentielle
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {competitiveMetrics.map((metric, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{metric.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {metric.value}{metric.unit} / {metric.target}{metric.unit}
                  </span>
                </div>
                <Progress value={(metric.value / metric.target) * 100} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Performance actuelle</span>
                  <span>{((metric.value / metric.target) * 100).toFixed(0)}% de l'objectif</span>
                </div>
              </div>
            ))}
            
            <div className="pt-4 border-t">
              <div className="flex items-center gap-2 mb-3">
                <Globe className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Positionnement Global</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-xl font-bold text-blue-600">#3</div>
                  <div className="text-xs text-muted-foreground">Classement région</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-xl font-bold text-green-600">A+</div>
                  <div className="text-xs text-muted-foreground">Note qualité</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}