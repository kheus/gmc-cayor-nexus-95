import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Building, 
  Calendar,
  PieChart,
  BarChart3,
  Target,
  Percent
} from 'lucide-react'
import { LucideIcon } from 'lucide-react'

interface KPIMetric {
  id: string
  title: string
  value: string | number
  previousValue?: string | number
  change?: number
  changeType?: 'increase' | 'decrease' | 'neutral'
  icon: LucideIcon
  color: string
  description?: string
  target?: number
  unit?: string
  format?: 'currency' | 'number' | 'percentage'
}

interface KPICardsProps {
  metrics: KPIMetric[]
  className?: string
}

export function KPICards({ metrics, className = "" }: KPICardsProps) {
  const formatValue = (value: string | number, format?: string, unit?: string) => {
    if (typeof value === 'string') return value
    
    switch (format) {
      case 'currency':
        return `${value.toLocaleString()} FCFA`
      case 'percentage':
        return `${value}%`
      case 'number':
      default:
        return unit ? `${value.toLocaleString()} ${unit}` : value.toLocaleString()
    }
  }

  const getChangeIcon = (changeType?: string) => {
    switch (changeType) {
      case 'increase':
        return <TrendingUp className="h-4 w-4 text-success" />
      case 'decrease':
        return <TrendingDown className="h-4 w-4 text-destructive" />
      default:
        return null
    }
  }

  const getChangeColor = (changeType?: string) => {
    switch (changeType) {
      case 'increase':
        return 'text-success'
      case 'decrease':
        return 'text-destructive'
      default:
        return 'text-muted-foreground'
    }
  }

  return (
    <div className={`grid gap-6 md:grid-cols-2 lg:grid-cols-4 ${className}`}>
      {metrics.map((metric) => (
        <Card key={metric.id} className="kpi-card group hover:shadow-corporate transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {metric.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${metric.color} bg-opacity-10`}>
              <metric.icon className={`h-4 w-4 ${metric.color.replace('bg-', 'text-')}`} />
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-3">
              {/* Main Value */}
              <div className="space-y-1">
                <div className="text-2xl font-bold text-foreground">
                  {formatValue(metric.value, metric.format, metric.unit)}
                </div>
                
                {/* Previous Value & Change */}
                {metric.change !== undefined && (
                  <div className="flex items-center space-x-2">
                    {getChangeIcon(metric.changeType)}
                    <span className={`text-xs font-medium ${getChangeColor(metric.changeType)}`}>
                      {metric.change > 0 ? '+' : ''}{metric.change}%
                    </span>
                    {metric.previousValue && (
                      <span className="text-xs text-muted-foreground">
                        vs {formatValue(metric.previousValue, metric.format, metric.unit)}
                      </span>
                    )}
                  </div>
                )}
              </div>
              
              {/* Description */}
              {metric.description && (
                <p className="text-xs text-muted-foreground">
                  {metric.description}
                </p>
              )}
              
              {/* Target Progress */}
              {metric.target && typeof metric.value === 'number' && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Objectif</span>
                    <span className="font-medium">
                      {Math.round((metric.value / metric.target) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full transition-all duration-500 ${metric.color}`}
                      style={{ width: `${Math.min((metric.value / metric.target) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Predefined KPI sets for different domains
export const getRevenueKPIs = (data: any): KPIMetric[] => [
  {
    id: 'total-revenue',
    title: 'Chiffre d\'Affaires Total',
    value: data.totalRevenue || 0,
    previousValue: data.previousRevenue,
    change: data.revenueChange,
    changeType: data.revenueChange > 0 ? 'increase' : 'decrease',
    icon: DollarSign,
    color: 'bg-primary text-primary',
    format: 'currency',
    target: data.revenueTarget,
    description: 'Revenus de tous les secteurs'
  },
  {
    id: 'total-clients',
    title: 'Clients Actifs',
    value: data.totalClients || 0,
    previousValue: data.previousClients,
    change: data.clientsChange,
    changeType: data.clientsChange > 0 ? 'increase' : 'decrease',
    icon: Users,
    color: 'bg-accent text-accent',
    format: 'number',
    target: data.clientsTarget,
    description: 'Tous secteurs confondus'
  },
  {
    id: 'properties-managed',
    title: 'Propriétés Gérées',
    value: data.propertiesManaged || 0,
    icon: Building,
    color: 'bg-chart-3 text-chart-3',
    format: 'number',
    description: 'Portfolio immobilier total'
  },
  {
    id: 'growth-rate',
    title: 'Taux de Croissance',
    value: data.growthRate || 0,
    change: data.growthChange,
    changeType: data.growthChange > 0 ? 'increase' : 'decrease',
    icon: TrendingUp,
    color: 'bg-success text-success',
    format: 'percentage',
    description: 'Croissance mensuelle'
  }
]

export const getFinancialKPIs = (data: any): KPIMetric[] => [
  {
    id: 'monthly-revenue',
    title: 'Revenus Mensuels',
    value: data.monthlyRevenue || 0,
    previousValue: data.previousMonthRevenue,
    change: data.monthlyChange,
    changeType: data.monthlyChange > 0 ? 'increase' : 'decrease',
    icon: BarChart3,
    color: 'bg-primary text-primary',
    format: 'currency',
    target: data.monthlyTarget
  },
  {
    id: 'expenses',
    title: 'Dépenses',
    value: data.expenses || 0,
    previousValue: data.previousExpenses,
    change: data.expensesChange,
    changeType: data.expensesChange < 0 ? 'increase' : 'decrease',
    icon: PieChart,
    color: 'bg-destructive text-destructive',
    format: 'currency'
  },
  {
    id: 'profit-margin',
    title: 'Marge Bénéficiaire',
    value: data.profitMargin || 0,
    change: data.marginChange,
    changeType: data.marginChange > 0 ? 'increase' : 'decrease',
    icon: Percent,
    color: 'bg-success text-success',
    format: 'percentage',
    target: data.marginTarget
  },
  {
    id: 'collections',
    title: 'Encaissements',
    value: data.collections || 0,
    icon: Target,
    color: 'bg-chart-2 text-chart-2',
    format: 'currency',
    description: 'Paiements reçus ce mois'
  }
]