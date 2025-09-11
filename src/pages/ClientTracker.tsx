import { ClientTracker } from '@/components/clients/ClientTracker'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, UserCheck, UserPlus, AlertTriangle, Clock, TrendingUp } from 'lucide-react'
import { useClients } from '@/hooks/useClients'
import { useClientFollowUp } from '@/hooks/useClientFollowUp'
import { useMemo } from 'react'

export default function ClientTrackerPage() {
  const { clients } = useClients()
  const { followUps } = useClientFollowUp()

  // Calculer les statistiques réelles
  const stats = useMemo(() => {
    return {
      total: clients.length,
      actifs: followUps.filter(f => f.status === 'actif').length,
      prospects: followUps.filter(f => f.status === 'prospect').length,
      relancer: followUps.filter(f => f.status === 'a_relancer').length,
      contacter: followUps.filter(f => {
        return f.next_contact && new Date(f.next_contact) <= new Date()
      }).length
    }
  }, [clients, followUps])
  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Suivi des Clients</h1>
            <p className="text-muted-foreground">
              Gérez vos clients actifs, prospects et relances avec communication professionnelle
            </p>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="hover:shadow-elegant transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Clients</p>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-elegant transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Actifs</p>
                <p className="text-2xl font-bold text-foreground">{stats.actifs}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-elegant transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">
                <UserPlus className="w-5 h-5 text-info" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Prospects</p>
                <p className="text-2xl font-bold text-foreground">{stats.prospects}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-elegant transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">À Relancer</p>
                <p className="text-2xl font-bold text-foreground">{stats.relancer}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-elegant transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">À Contacter</p>
                <p className="text-2xl font-bold text-foreground">{stats.contacter}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <ClientTracker />
    </div>
  )
}