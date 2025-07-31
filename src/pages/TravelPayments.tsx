import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, Plus, Download, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { TravelPaymentForm } from "@/components/forms/TravelPaymentForm"
import { useToast } from "@/hooks/use-toast"
import { usePayments } from "@/hooks/usePayments"

export function TravelPayments() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const { toast } = useToast()
  const { payments, loading, addPayment } = usePayments()
  
  // Filtrer les paiements voyage
  const travelPayments = payments.filter(payment => payment.secteur === 'voyage')

  const handleNewPayment = async (data: any) => {
    try {
      const paymentData = {
        ...data,
        secteur: 'voyage' as const
      }
      
      await addPayment(paymentData)
      setIsFormOpen(false)
      return { success: true, message: "Paiement enregistré avec succès" }
    } catch (error) {
      return { success: false, message: "Erreur lors de l'enregistrement du paiement" }
    }
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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <CreditCard className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Paiements Voyage</h1>
          <p className="text-muted-foreground">
            Suivi des paiements et encaissements voyage
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Encaissements du Mois</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(travelPayments.filter(p => p.statut === 'completed').reduce((sum, p) => sum + p.montant, 0) / 1000000).toFixed(1)}M
            </div>
            <p className="text-xs text-muted-foreground">FCFA ce mois</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paiements en Attente</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{travelPayments.filter(p => p.statut === 'pending').length}</div>
            <p className="text-xs text-muted-foreground">À encaisser</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paiements Partiels</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{travelPayments.filter(p => p.statut === 'partial').length}</div>
            <p className="text-xs text-muted-foreground">À compléter</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de Recouvrement</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {travelPayments.length > 0 ? Math.round((travelPayments.filter(p => p.statut === 'completed').length / travelPayments.length) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">Ce mois</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Historique des Paiements</CardTitle>
              <CardDescription>Tous les paiements voyage GMC</CardDescription>
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
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Paiement</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Réservation</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Méthode</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center">Chargement...</TableCell>
                </TableRow>
              ) : travelPayments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center">Aucun paiement voyage trouvé</TableCell>
                </TableRow>
              ) : (
                travelPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">{payment.id}</TableCell>
                    <TableCell>{payment.client_name}</TableCell>
                    <TableCell>{payment.reference || '-'}</TableCell>
                    <TableCell>{payment.details?.destination || '-'}</TableCell>
                    <TableCell className="font-semibold">
                      {payment.montant.toLocaleString()} FCFA
                    </TableCell>
                    <TableCell className="capitalize">{payment.methode}</TableCell>
                    <TableCell>{getStatusBadge(payment.statut)}</TableCell>
                    <TableCell>
                      {new Date(payment.date_paiement).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        Détails
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <TravelPaymentForm
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleNewPayment}
      />
    </div>
  )
}