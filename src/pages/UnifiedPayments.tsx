import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, Plus, Download, Filter, TrendingUp, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UnifiedPaymentForm } from "@/components/forms/UnifiedPaymentForm"
import { useToast } from "@/hooks/use-toast"
import { usePayments } from "@/hooks/usePayments"

// Type unifié pour tous les paiements
interface UnifiedPayment {
  id: string
  secteur: 'immobilier' | 'voyage' | 'assurance'
  client_name: string
  type_paiement: string
  montant: number
  methode: string
  statut: 'completed' | 'partial' | 'pending'
  date_paiement: string
  reference?: string
  details?: {
    destination?: string
    property_name?: string
    vehicule?: string
    contract_id?: string
  }
}

export function UnifiedPayments() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedSector, setSelectedSector] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()
  const { payments, loading, addPayment } = usePayments()

  const handleNewPayment = async (data: any) => {
    try {
      await addPayment(data)
      setIsFormOpen(false)
      return { success: true, message: "Paiement enregistré avec succès" }
    } catch (error) {
      return { success: false, message: "Erreur lors de l'enregistrement du paiement" }
    }
  }

  const getSectorBadge = (secteur: string) => {
    const variants = {
      immobilier: "default",
      voyage: "secondary", 
      assurance: "outline"
    } as const
    
    const colors = {
      immobilier: "bg-blue-100 text-blue-800 border-blue-300",
      voyage: "bg-green-100 text-green-800 border-green-300",
      assurance: "bg-purple-100 text-purple-800 border-purple-300"
    }
    
    return (
      <Badge className={colors[secteur as keyof typeof colors]}>
        {secteur.charAt(0).toUpperCase() + secteur.slice(1)}
      </Badge>
    )
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: "default",
      partial: "secondary",
      pending: "destructive"
    } as const
    
    const labels = {
      completed: "Payé",
      partial: "Partiel", 
      pending: "En attente"
    }
    
    return (
      <Badge variant={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    )
  }

  // Calculs des métriques
  const totalPayments = payments.length
  const completedPayments = payments.filter(p => p.statut === "completed")
  const totalRevenue = completedPayments.reduce((sum, p) => sum + p.montant, 0)
  const pendingPayments = payments.filter(p => p.statut === "pending").length
  const partialPayments = payments.filter(p => p.statut === "partial").length

  // Revenus par secteur
  const revenuesBySector = {
    immobilier: completedPayments.filter(p => p.secteur === "immobilier").reduce((sum, p) => sum + p.montant, 0),
    voyage: completedPayments.filter(p => p.secteur === "voyage").reduce((sum, p) => sum + p.montant, 0),
    assurance: completedPayments.filter(p => p.secteur === "assurance").reduce((sum, p) => sum + p.montant, 0)
  }

  // Filtrage des paiements
  const filteredPayments = payments.filter(payment => {
    const matchesSector = selectedSector === "all" || payment.secteur === selectedSector
    const matchesSearch = payment.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.type_paiement.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.reference?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSector && matchesSearch
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <CreditCard className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Paiements Unifiés</h1>
          <p className="text-muted-foreground">
            Gestion centralisée de tous les paiements GMC
          </p>
        </div>
      </div>

      {/* Métriques globales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Encaissé</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(totalRevenue / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">FCFA ce mois</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Attente</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingPayments}</div>
            <p className="text-xs text-muted-foreground">Paiements</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Partiels</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{partialPayments}</div>
            <p className="text-xs text-muted-foreground">À compléter</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux Recouvrement</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((completedPayments.length / totalPayments) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">Ce mois</p>
          </CardContent>
        </Card>
      </div>

      {/* Répartition par secteur */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              {getSectorBadge("immobilier")} 
              Immobilier
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{(revenuesBySector.immobilier / 1000000).toFixed(1)}M FCFA</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              {getSectorBadge("voyage")}
              Voyage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{(revenuesBySector.voyage / 1000000).toFixed(1)}M FCFA</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              {getSectorBadge("assurance")}
              Assurance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{(revenuesBySector.assurance / 1000000).toFixed(1)}M FCFA</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Historique des Paiements</CardTitle>
              <CardDescription>Tous les paiements de tous les secteurs</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filtrer
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Exporter
              </Button>
              <Button size="sm" onClick={() => setIsFormOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Nouveau Paiement
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <Input
              placeholder="Rechercher un paiement..."
              className="flex-1"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select value={selectedSector} onValueChange={setSelectedSector}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Tous les secteurs" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les secteurs</SelectItem>
                <SelectItem value="immobilier">Immobilier</SelectItem>
                <SelectItem value="voyage">Voyage</SelectItem>
                <SelectItem value="assurance">Assurance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Secteur</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Méthode</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Détails</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center">Chargement...</TableCell>
                </TableRow>
              ) : filteredPayments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center">Aucun paiement trouvé</TableCell>
                </TableRow>
              ) : (
                filteredPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">{payment.id}</TableCell>
                    <TableCell>{getSectorBadge(payment.secteur)}</TableCell>
                    <TableCell>{payment.client_name}</TableCell>
                    <TableCell>{payment.type_paiement}</TableCell>
                    <TableCell className="font-semibold">
                      {payment.montant.toLocaleString()} FCFA
                    </TableCell>
                    <TableCell className="capitalize">{payment.methode}</TableCell>
                    <TableCell>{getStatusBadge(payment.statut)}</TableCell>
                    <TableCell>
                      {new Date(payment.date_paiement).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {payment.details?.destination && `Dest: ${payment.details.destination}`}
                      {payment.details?.property_name && `Prop: ${payment.details.property_name}`}
                      {payment.details?.vehicule && `Véh: ${payment.details.vehicule}`}
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        Voir
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <UnifiedPaymentForm
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleNewPayment}
      />
    </div>
  )
}