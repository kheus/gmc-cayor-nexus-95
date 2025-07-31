import { useState } from "react"
import { useGMCData } from "@/hooks/useGMCData"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Plus, Search, CreditCard, DollarSign, Calendar, TrendingUp, CheckCircle, Clock, XCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { InsurancePayment } from "@/types/gmc"

export default function InsurancePayments() {
  const { insurancePayments, insuranceContracts } = useGMCData()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterMethod, setFilterMethod] = useState("all")
  const [isAddingPayment, setIsAddingPayment] = useState(false)
  const { toast } = useToast()

  const [newPayment, setNewPayment] = useState({
    contract_id: "",
    client_name: "",
    type_assurance: "",
    montant: "",
    methode: "virement" as "virement" | "especes" | "carte" | "cheque" | "mobile",
    date_paiement: new Date().toISOString().split('T')[0],
    reference: ""
  })

  const filteredPayments = insurancePayments.filter(payment => {
    const matchesSearch = payment.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.type_assurance.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || payment.statut === filterStatus
    const matchesMethod = filterMethod === "all" || payment.methode === filterMethod
    return matchesSearch && matchesStatus && matchesMethod
  })

  const handleAddPayment = () => {
    if (!newPayment.client_name || !newPayment.montant || !newPayment.type_assurance) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires"
      })
      return
    }

    const reference = newPayment.reference || `ASS-${Date.now().toString().slice(-6)}`

    toast({
      title: "Paiement enregistré",
      description: `Paiement de ${parseInt(newPayment.montant).toLocaleString()} FCFA pour ${newPayment.client_name} enregistré avec succès`
    })

    setNewPayment({
      contract_id: "",
      client_name: "",
      type_assurance: "",
      montant: "",
      methode: "virement",
      date_paiement: new Date().toISOString().split('T')[0],
      reference: ""
    })
    setIsAddingPayment(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800"
      case "partial": return "bg-yellow-100 text-yellow-800"
      case "pending": return "bg-blue-100 text-blue-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getMethodColor = (method: string) => {
    switch (method) {
      case "virement": return "bg-blue-100 text-blue-800"
      case "carte": return "bg-purple-100 text-purple-800"
      case "especes": return "bg-green-100 text-green-800"
      case "cheque": return "bg-orange-100 text-orange-800"
      case "mobile": return "bg-pink-100 text-pink-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-4 w-4 text-green-600" />
      case "partial": return <Clock className="h-4 w-4 text-yellow-600" />
      case "pending": return <Clock className="h-4 w-4 text-blue-600" />
      default: return <XCircle className="h-4 w-4 text-gray-600" />
    }
  }

  const totalPayments = insurancePayments.reduce((sum, p) => sum + p.montant, 0)
  const completedPayments = insurancePayments.filter(p => p.statut === 'completed')
  const pendingPayments = insurancePayments.filter(p => p.statut === 'pending')

  // Calculs pour ce mois
  const thisMonth = new Date().getMonth()
  const thisYear = new Date().getFullYear()
  const monthlyPayments = insurancePayments.filter(p => {
    const paymentDate = new Date(p.date_paiement)
    return paymentDate.getMonth() === thisMonth && paymentDate.getFullYear() === thisYear
  })
  const monthlyRevenue = monthlyPayments.reduce((sum, p) => sum + p.montant, 0)

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">Paiements Assurance</h1>
          <p className="text-muted-foreground">
            Suivi des paiements et primes d'assurance - {filteredPayments.length} paiement{filteredPayments.length > 1 ? 's' : ''}
          </p>
        </div>
        
        <Dialog open={isAddingPayment} onOpenChange={setIsAddingPayment}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nouveau Paiement
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Enregistrer un Paiement d'Assurance</DialogTitle>
              <DialogDescription>
                Saisir un nouveau paiement de prime d'assurance
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="client_name">Client *</Label>
                <Select value={newPayment.client_name} onValueChange={(value) => setNewPayment(prev => ({ ...prev, client_name: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un client" />
                  </SelectTrigger>
                  <SelectContent>
                    {insuranceContracts.map((contract) => (
                      <SelectItem key={contract.id} value={contract.client_name}>
                        {contract.client_name} - {contract.type_assurance}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type_assurance">Type d'Assurance *</Label>
                <Select value={newPayment.type_assurance} onValueChange={(value) => setNewPayment(prev => ({ ...prev, type_assurance: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Type d'assurance" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Assurance Auto</SelectItem>
                    <SelectItem value="habitation">Assurance Habitation</SelectItem>
                    <SelectItem value="vie">Assurance Vie</SelectItem>
                    <SelectItem value="sante">Assurance Santé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="montant">Montant (FCFA) *</Label>
                <Input
                  id="montant"
                  type="number"
                  value={newPayment.montant}
                  onChange={(e) => setNewPayment(prev => ({ ...prev, montant: e.target.value }))}
                  placeholder="125000"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="methode">Méthode de Paiement</Label>
                <Select value={newPayment.methode} onValueChange={(value: "virement" | "especes" | "carte" | "cheque" | "mobile") => setNewPayment(prev => ({ ...prev, methode: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="virement">Virement Bancaire</SelectItem>
                    <SelectItem value="especes">Espèces</SelectItem>
                    <SelectItem value="carte">Carte Bancaire</SelectItem>
                    <SelectItem value="cheque">Chèque</SelectItem>
                    <SelectItem value="mobile">Paiement Mobile</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="date_paiement">Date de Paiement</Label>
                <Input
                  id="date_paiement"
                  type="date"
                  value={newPayment.date_paiement}
                  onChange={(e) => setNewPayment(prev => ({ ...prev, date_paiement: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reference">Référence</Label>
                <Input
                  id="reference"
                  value={newPayment.reference}
                  onChange={(e) => setNewPayment(prev => ({ ...prev, reference: e.target.value }))}
                  placeholder="ASS-001 (auto-généré si vide)"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsAddingPayment(false)}>
                Annuler
              </Button>
              <Button onClick={handleAddPayment}>
                Enregistrer le Paiement
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Collecté</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalPayments.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              FCFA - Tous paiements
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ce Mois</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{monthlyRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {monthlyPayments.length} paiement{monthlyPayments.length > 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paiements Confirmés</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedPayments.length}</div>
            <p className="text-xs text-muted-foreground">
              {completedPayments.reduce((sum, p) => sum + p.montant, 0).toLocaleString()} FCFA
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Attente</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{pendingPayments.length}</div>
            <p className="text-xs text-muted-foreground">
              {pendingPayments.reduce((sum, p) => sum + p.montant, 0).toLocaleString()} FCFA
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardHeader>
          <CardTitle>Recherche et Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[250px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Rechercher par client, référence, type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="completed">Confirmé</SelectItem>
                <SelectItem value="partial">Partiel</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterMethod} onValueChange={setFilterMethod}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Méthode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les méthodes</SelectItem>
                <SelectItem value="virement">Virement</SelectItem>
                <SelectItem value="especes">Espèces</SelectItem>
                <SelectItem value="carte">Carte</SelectItem>
                <SelectItem value="cheque">Chèque</SelectItem>
                <SelectItem value="mobile">Mobile</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tableau des paiements */}
      <Card>
        <CardHeader>
          <CardTitle>Historique des Paiements</CardTitle>
          <CardDescription>
            Suivi de tous les paiements de primes d'assurance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Méthode</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Référence</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>
                    {new Date(payment.date_paiement).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{payment.client_name}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {payment.type_assurance}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{payment.montant.toLocaleString()} FCFA</div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getMethodColor(payment.methode)}>
                      {payment.methode}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(payment.statut)}
                      <Badge className={getStatusColor(payment.statut)}>
                        {payment.statut === 'completed' ? 'Confirmé' : 
                         payment.statut === 'partial' ? 'Partiel' : 'En attente'}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-sm">{payment.reference}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Modifier
                      </Button>
                      <Button variant="outline" size="sm">
                        Reçu
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredPayments.length === 0 && (
            <div className="text-center py-10">
              <CreditCard className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">Aucun paiement trouvé</h3>
              <p className="text-muted-foreground">
                {searchTerm || filterStatus !== "all" || filterMethod !== "all"
                  ? "Aucun paiement ne correspond à vos critères de recherche."
                  : "Commencez par enregistrer votre premier paiement d'assurance."
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}