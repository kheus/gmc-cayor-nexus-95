import { StatCard } from "@/components/StatCard"
import { DollarSign, Users, TrendingUp, LucideIcon } from "lucide-react"

interface MetricsData {
  chiffre_affaires_mensuel: number
  croissance_mensuelle: number
  nombre_clients_actifs: number
  taux_realisation: number
  taux_satisfaction: number
}

interface MetricsGridProps {
  metrics: MetricsData
  primaryMetricIcon?: LucideIcon
  primaryMetricTitle?: string
  primaryMetricValue?: string | number
  primaryMetricSubtitle?: string
  primaryMetricAlert?: {
    value: string
    isPositive: boolean
  }
}

export function MetricsGrid({ 
  metrics, 
  primaryMetricIcon,
  primaryMetricTitle = "Métriques Spécifiques",
  primaryMetricValue,
  primaryMetricSubtitle,
  primaryMetricAlert
}: MetricsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Chiffre d'Affaires"
        value={metrics.chiffre_affaires_mensuel.toLocaleString()}
        change={{
          value: `+${metrics.croissance_mensuelle.toFixed(1)}%`,
          isPositive: metrics.croissance_mensuelle >= 0
        }}
        icon={DollarSign}
        subtitle={`${metrics.taux_realisation.toFixed(1)}% de l'objectif`}
      />
      
      <StatCard
        title="Clients Actifs"
        value={metrics.nombre_clients_actifs}
        icon={Users}
        subtitle="Clients du secteur"
      />
      
      {primaryMetricIcon && primaryMetricValue && (
        <StatCard
          title={primaryMetricTitle}
          value={primaryMetricValue}
          change={primaryMetricAlert}
          icon={primaryMetricIcon}
          subtitle={primaryMetricSubtitle}
        />
      )}
      
      <StatCard
        title="Satisfaction"
        value={`${metrics.taux_satisfaction.toFixed(1)}/5`}
        icon={TrendingUp}
        subtitle="Note moyenne clients"
      />
    </div>
  )
}