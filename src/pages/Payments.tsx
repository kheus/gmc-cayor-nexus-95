import { useState } from "react"
import { CreditCard, Plus, Calendar, Upload, FileText, Eye, Info, Trash2, Edit, MoreHorizontal } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { useForm } from "react-hook-form"
import { useToast } from "@/hooks/use-toast"
import { usePayments } from "@/hooks/usePayments"
// import { PaymentDetailsDialog } from "@/components/payments/PaymentDetailsDialog"

interface Payment {
  id: number
  nom_client: string
  contrat_concerne: string
  type_paiement: string
  montant_paye: number
  mode_paiement: string
  date_paiement: string
  reference_recu: string
  observations: string
  justificatif: string
}

export default function Payments() {
  const { toast } = useToast()
  const { payments, loading, addPayment, updatePayment, deletePayment } = usePayments()

  const [isAddingPayment, setIsAddingPayment] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<any>(null)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [isStatusOpen, setIsStatusOpen] = useState(false)
  const [newStatus, setNewStatus] = useState("")
  
  const form = useForm({
    defaultValues: {
      nom_client: "",
      contrat_concerne: "",
      type_paiement: "Loyer",
      montant_paye: "",
      mode_paiement: "virement",
      date_paiement: "",
      reference_recu: "",
      observations: "",
      justificatif: ""
    }
  })

  const onSubmit = async (data: any) => {
    try {
      const paymentData = {
        client_id: data.nom_client, // Temporaire - devrait être l'ID du client
        client_name: data.nom_client, // Nom du client
        secteur: 'immobilier' as const, // Par défaut immobilier
        type_paiement: data.type_paiement,
        montant: parseInt(data.montant_paye),
        methode: data.mode_paiement as "especes" | "virement" | "carte" | "cheque" | "mobile",
        date_paiement: data.date_paiement,
        reference: data.reference_recu,
        observations: data.observations,
        details: {
          contrat_concerne: data.contrat_concerne,
          justificatif: data.justificatif
        }
      }
      
      await addPayment(paymentData)
      form.reset()
      setIsAddingPayment(false)
    } catch (error) {
      // Error handling is done in the hook
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "Loyer":
        return <Badge className="bg-primary/20 text-primary border-primary/30">Loyer</Badge>
      case "Caution":
        return <Badge variant="secondary">Caution</Badge>
      case "Entretien":
        return <Badge variant="outline">Entretien</Badge>
      case "Assurance":
        return <Badge className="bg-warning/20 text-warning border-warning/30">Assurance</Badge>
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  const handleViewPayment = (payment: any) => {
    setSelectedPayment(payment)
    setIsDetailsDialogOpen(true)
  }

  const handleChangeStatus = (payment: any) => {
    setSelectedPayment(payment)
    setNewStatus(payment.statut || 'pending')
    setIsStatusOpen(true)
  }

  const handleStatusUpdate = async () => {
    if (!selectedPayment || !newStatus) return
    
    try {
      await updatePayment(selectedPayment.id, { statut: newStatus as any })
      setIsStatusOpen(false)
      setSelectedPayment(null)
      setNewStatus("")
    } catch (error) {
      console.error('Error updating payment status:', error)
    }
  }

  const handleDelete = async (paymentId: string) => {
    try {
      await deletePayment(paymentId)
    } catch (error) {
      console.error('Error deleting payment:', error)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-success/20 text-success border-success/30">Terminé</Badge>
      case "pending":
        return <Badge variant="secondary">En attente</Badge>
      case "partial":
        return <Badge className="bg-warning/20 text-warning border-warning/30">Partiel</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  console.log("🔍 Page Payments rendue, payments:", payments.length, "isDetailsDialogOpen:", isDetailsDialogOpen)
  
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-primary">Gestion des Paiements</h1>
        <p className="text-muted-foreground">Suivi des loyers et paiements</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="space-y-2">
            <Label htmlFor="search">Rechercher</Label>
            <Input
              id="search"
              placeholder="Propriété, mois..."
              className="w-full sm:w-64"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Statut</Label>
            <Select>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Tous" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="paye">Payé</SelectItem>
                <SelectItem value="attente">En attente</SelectItem>
                <SelectItem value="retard">En retard</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Dialog open={isAddingPayment} onOpenChange={setIsAddingPayment}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouveau Paiement
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>💳 Formulaire de Paiement</DialogTitle>
              <DialogDescription>
                Enregistrer un nouveau paiement (loyer, assurance, service)
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                
                {/* Section Client */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">👤 Locataire / Client</h3>
                  
                  <FormField
                    control={form.control}
                    name="nom_client"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom du client</FormLabel>
                        <FormControl>
                          <Input placeholder="Amadou Diallo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contrat_concerne"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contrat concerné</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner un contrat" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="CONT001 - Appartement Plateau">CONT001 - Appartement Plateau</SelectItem>
                            <SelectItem value="CONT002 - Villa Fann">CONT002 - Villa Fann</SelectItem>
                            <SelectItem value="CONT003 - Bureau Centre">CONT003 - Bureau Centre</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="type_paiement"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type de paiement</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Loyer">Loyer</SelectItem>
                            <SelectItem value="Caution">Caution</SelectItem>
                            <SelectItem value="Entretien">Entretien</SelectItem>
                            <SelectItem value="Assurance">Assurance</SelectItem>
                            <SelectItem value="Autre">Autre</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Section Détails du paiement */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">💳 Détails du paiement</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="montant_paye"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Montant payé (FCFA)</FormLabel>
                          <FormControl>
                            <Input placeholder="450000" type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="mode_paiement"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mode de paiement</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Mode" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="especes">Espèces</SelectItem>
                              <SelectItem value="virement">Virement</SelectItem>
                              <SelectItem value="carte">Carte</SelectItem>
                              <SelectItem value="cheque">Chèque</SelectItem>
                              <SelectItem value="mobile">Mobile Money</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="date_paiement"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date de paiement</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="reference_recu"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Référence / Reçu</FormLabel>
                          <FormControl>
                            <Input placeholder="REC001" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="observations"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Observations</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Observations sur ce paiement" rows={3} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Section Pièce jointe */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">📎 Pièce jointe</h3>
                  
                  <FormField
                    control={form.control}
                    name="justificatif"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Justificatif de paiement (optionnel)</FormLabel>
                        <FormControl>
                          <Input placeholder="Nom du fichier ou URL" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsAddingPayment(false)}>
                    Annuler
                  </Button>
                  <Button type="submit">Enregistrer le paiement</Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historique des Paiements</CardTitle>
          <CardDescription>
            {payments.length} paiement(s) enregistré(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-4">Chargement des paiements...</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Contrat</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Mode</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">{payment.client_name}</TableCell>
                      <TableCell>{payment.details?.contrat_concerne || '-'}</TableCell>
                      <TableCell>{getTypeBadge(payment.type_paiement)}</TableCell>
                      <TableCell>{payment.montant?.toLocaleString()} CFA</TableCell>
                      <TableCell>{payment.methode}</TableCell>
                      <TableCell>{payment.date_paiement ? new Date(payment.date_paiement).toLocaleDateString() : '-'}</TableCell>
                      <TableCell>{getStatusBadge(payment.statut || 'pending')}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-background border shadow-lg z-50">
                            <DropdownMenuItem onClick={() => handleViewPayment(payment)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Voir détails
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleChangeStatus(payment)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Changer statut
                            </DropdownMenuItem>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Supprimer
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Êtes-vous sûr de vouloir supprimer ce paiement ? Cette action ne peut pas être annulée.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDelete(payment.id)}>
                                    Supprimer
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog pour afficher les détails */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>💳 Détails du Paiement</DialogTitle>
            <DialogDescription>
              Informations complètes du paiement
            </DialogDescription>
          </DialogHeader>
          {selectedPayment && (
            <div className="space-y-6">
              {/* Informations générales */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">👤 Client et contrat</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Client</Label>
                    <p className="font-medium">{selectedPayment.client_name}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Secteur</Label>
                    <p className="font-medium">{selectedPayment.secteur}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Contrat concerné</Label>
                    <p className="font-medium">{selectedPayment.details?.contrat_concerne || 'Non spécifié'}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Type de paiement</Label>
                    <div className="mt-1">{getTypeBadge(selectedPayment.type_paiement)}</div>
                  </div>
                </div>
              </div>

              {/* Détails financiers */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">💰 Détails financiers</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Montant</Label>
                    <p className="font-medium text-lg">{selectedPayment.montant?.toLocaleString()} CFA</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Mode de paiement</Label>
                    <p className="font-medium">{selectedPayment.methode}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Date de paiement</Label>
                    <p className="font-medium">{selectedPayment.date_paiement ? new Date(selectedPayment.date_paiement).toLocaleDateString() : 'Non spécifiée'}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Statut</Label>
                    <div className="mt-1">{getStatusBadge(selectedPayment.statut || 'pending')}</div>
                  </div>
                </div>
              </div>

              {/* Référence et observations */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">📋 Informations complémentaires</h3>
                <div className="space-y-2">
                  <div>
                    <Label className="text-muted-foreground">Référence</Label>
                    <p className="font-medium">{selectedPayment.reference || 'Aucune référence'}</p>
                  </div>
                  {selectedPayment.observations && (
                    <div>
                      <Label className="text-muted-foreground">Observations</Label>
                      <p className="font-medium">{selectedPayment.observations}</p>
                    </div>
                  )}
                  {selectedPayment.details?.justificatif && (
                    <div>
                      <Label className="text-muted-foreground">Justificatif</Label>
                      <p className="font-medium">{selectedPayment.details.justificatif}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)}>
                  Fermer
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog pour changer le statut */}
      <Dialog open={isStatusOpen} onOpenChange={setIsStatusOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>✏️ Changer le Statut</DialogTitle>
            <DialogDescription>
              Modifier le statut du paiement de "{selectedPayment?.client_name}"
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="status-select">Nouveau statut</Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent className="bg-background border shadow-lg z-50">
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="partial">Partiel</SelectItem>
                  <SelectItem value="completed">Terminé</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {newStatus && (
              <div className="space-y-2">
                <Label>Aperçu du nouveau statut</Label>
                <div>{getStatusBadge(newStatus)}</div>
              </div>
            )}
            
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsStatusOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleStatusUpdate} disabled={!newStatus}>
                Mettre à jour
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}