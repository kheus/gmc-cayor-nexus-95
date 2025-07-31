import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Activity, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  BarChart3
} from "lucide-react"

interface KPI {
  name: string
  value: number
  target: number
  unit: string
  trend: number
  category: 'financial' | 'operational' | 'satisfaction'
  priority: 'high' | 'medium' | 'low'
}

interface PerformanceIndicatorsProps {
  kpis: KPI[]
}

export function PerformanceIndicators({ kpis }: PerformanceIndicatorsProps) {
  const getKPIStatus = (value: number, target: number) => {
    const percentage = (value / target) * 100
    if (percentage >= 100) return 'excellent'
    if (percentage >= 80) return 'good'
    if (percentage >= 60) return 'warning'
    return 'critical'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-50 border-green-200'
      case 'good': return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'critical': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'financial': return BarChart3
      case 'operational': return Activity
      case 'satisfaction': return CheckCircle
      default: return Target
    }
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Indicateurs de Performance Clés (KPI)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {kpis.map((kpi, index) => {
            const status = getKPIStatus(kpi.value, kpi.target)
            const percentage = (kpi.value / kpi.target) * 100
            const Icon = getCategoryIcon(kpi.category)
            
            return (
              <div 
                key={index}
                className={`p-4 rounded-lg border ${getStatusColor(status)}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{kpi.name}</span>
                  </div>
                  <Badge 
                    variant={kpi.priority === 'high' ? 'destructive' : 'outline'}
                    className="text-xs"
                  >
                    {kpi.priority}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold">
                      {kpi.value.toLocaleString()} {kpi.unit}
                    </span>
                    <div className="flex items-center gap-1">
                      {kpi.trend >= 0 ? (
                        <TrendingUp className="h-3 w-3 text-green-500" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-500" />
                      )}
                      <span className={`text-xs ${kpi.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {kpi.trend >= 0 ? '+' : ''}{kpi.trend}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Objectif: {kpi.target.toLocaleString()} {kpi.unit}</span>
                      <span>{percentage.toFixed(0)}%</span>
                    </div>
                    <Progress value={Math.min(percentage, 100)} className="h-2" />
                  </div>
                  
                  {status === 'critical' && (
                    <div className="flex items-center gap-1 mt-2">
                      <AlertTriangle className="h-3 w-3 text-red-500" />
                      <span className="text-xs text-red-600">Action requise</span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}