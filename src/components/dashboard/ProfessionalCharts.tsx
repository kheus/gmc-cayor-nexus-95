import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ChartData {
  name: string
  value: number
  [key: string]: any
}

interface ChartConfig {
  title: string
  description?: string
  data: ChartData[]
  type: 'line' | 'area' | 'bar' | 'pie'
  colors?: string[]
  dataKey?: string
  xAxisKey?: string
  yAxisKey?: string
  showLegend?: boolean
  showGrid?: boolean
  showTooltip?: boolean
  height?: number
  trend?: {
    value: number
    isPositive: boolean
    period: string
  }
}

interface ProfessionalChartsProps {
  charts: ChartConfig[]
  className?: string
}

const CORPORATE_COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--accent))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))'
]

export function ProfessionalCharts({ charts, className = "" }: ProfessionalChartsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value).replace('XOF', 'FCFA')
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border rounded-lg shadow-lg p-3">
          <p className="font-medium text-sm">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  const renderChart = (config: ChartConfig) => {
    const colors = config.colors || CORPORATE_COLORS
    const height = config.height || 300

    switch (config.type) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={config.data}>
              {config.showGrid && <CartesianGrid strokeDasharray="3 3" className="opacity-30" />}
              <XAxis 
                dataKey={config.xAxisKey || 'name'} 
                className="text-xs"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                className="text-xs"
                tick={{ fontSize: 12 }}
                tickFormatter={formatCurrency}
              />
              {config.showTooltip && <Tooltip content={<CustomTooltip />} />}
              {config.showLegend && <Legend />}
              <Line
                type="monotone"
                dataKey={config.dataKey || 'value'}
                stroke={colors[0]}
                strokeWidth={3}
                dot={{ fill: colors[0], strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: colors[0], strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )

      case 'area':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <AreaChart data={config.data}>
              {config.showGrid && <CartesianGrid strokeDasharray="3 3" className="opacity-30" />}
              <XAxis 
                dataKey={config.xAxisKey || 'name'} 
                className="text-xs"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                className="text-xs"
                tick={{ fontSize: 12 }}
                tickFormatter={formatCurrency}
              />
              {config.showTooltip && <Tooltip content={<CustomTooltip />} />}
              {config.showLegend && <Legend />}
              <Area
                type="monotone"
                dataKey={config.dataKey || 'value'}
                stroke={colors[0]}
                fill={colors[0]}
                fillOpacity={0.1}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        )

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={config.data}>
              {config.showGrid && <CartesianGrid strokeDasharray="3 3" className="opacity-30" />}
              <XAxis 
                dataKey={config.xAxisKey || 'name'} 
                className="text-xs"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                className="text-xs"
                tick={{ fontSize: 12 }}
                tickFormatter={formatCurrency}
              />
              {config.showTooltip && <Tooltip content={<CustomTooltip />} />}
              {config.showLegend && <Legend />}
              <Bar
                dataKey={config.dataKey || 'value'}
                fill={colors[0]}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={config.data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey={config.dataKey || 'value'}
              >
                {config.data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              {config.showTooltip && <Tooltip content={<CustomTooltip />} />}
              {config.showLegend && <Legend />}
            </PieChart>
          </ResponsiveContainer>
        )

      default:
        return null
    }
  }

  return (
    <div className={`grid gap-6 ${className}`}>
      {charts.map((chart, index) => (
        <Card key={index} className="card-corporate">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-lg font-semibold">{chart.title}</CardTitle>
                {chart.description && (
                  <CardDescription>{chart.description}</CardDescription>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                {chart.trend && (
                  <Badge variant={chart.trend.isPositive ? "default" : "destructive"} className="gap-1">
                    {chart.trend.isPositive ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {chart.trend.value}% {chart.trend.period}
                  </Badge>
                )}
                
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            {renderChart(chart)}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Predefined chart configurations
export const getRevenueCharts = (data: any): ChartConfig[] => [
  {
    title: "Évolution du Chiffre d'Affaires",
    description: "Revenus mensuels par secteur d'activité",
    type: 'area',
    data: data.monthlyRevenue || [],
    showGrid: true,
    showTooltip: true,
    showLegend: true,
    trend: {
      value: data.revenueGrowth || 0,
      isPositive: (data.revenueGrowth || 0) > 0,
      period: "vs mois dernier"
    }
  },
  {
    title: "Répartition par Secteur",
    description: "Distribution des revenus par domaine d'activité",
    type: 'pie',
    data: data.sectorDistribution || [],
    showTooltip: true,
    showLegend: true,
    height: 350
  }
]

export const getPerformanceCharts = (data: any): ChartConfig[] => [
  {
    title: "Performance Trimestrielle",
    description: "Comparaison des métriques clés",
    type: 'bar',
    data: data.quarterlyPerformance || [],
    showGrid: true,
    showTooltip: true,
    showLegend: true
  },
  {
    title: "Tendance des Clients",
    description: "Évolution du portefeuille client",
    type: 'line',
    data: data.clientTrends || [],
    showGrid: true,
    showTooltip: true,
    colors: ['hsl(var(--accent))']
  }
]