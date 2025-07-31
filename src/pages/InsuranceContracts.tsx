import { useState } from "react"
import { useGMCData } from "@/hooks/useGMCData"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Search, FileText, Calendar, DollarSign, AlertTriangle, Eye, Info, Trash2, Edit, MoreHorizontal } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { ContractDetailsDialog } from "@/components/contracts/ContractDetailsDialog"
import { supabase } from "@/integrations/supabase/client"
import type { InsuranceContract } from "@/types/gmc"

export default function InsuranceContracts() {
  const { insuranceContracts, insuranceClients } = useGMCData()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterType, setFilterType] = useState("all")
  const [isAddingContract, setIsAddingContract] = useState(false)
  const [selectedContract, setSelectedContract] = useState<InsuranceContract | null>(null)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const { toast } = useToast()

  const [newContract, setNewContract] = useState({
    client_id: "",
    client_name: "",
    type_assurance: "auto" as "auto" | "habitation" | "vie" | "sante",
    vehicule_marque: "",
    vehicule_modele: "",
    numero_immatriculation: "",
    prime_mensuelle: "",
    date_debut: "",
    date_fin: "",
    details: ""
  })

  const filteredContracts = insuranceContracts.filter(contract => {
    const matchesSearch = contract.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.numero_immatriculation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.vehicule_marque?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || contract.statut === filterStatus
    const matchesType = filterType === "all" || contract.type_assurance === filterType
    return matchesSearch && matchesStatus && matchesType
  })

  const handleAddContract = async () => {
    if (!newContract.client_name || !newContract.type_assurance || !newContract.prime_mensuelle) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires"
      })
      return
    }

    try {
      // Générer un ID automatique et créer le contrat
      const contractData = {
        id: crypto.randomUUID(), // ID automatique
        client_name: newContract.client_name,
        type_assurance: newContract.type_assurance,
        vehicule_marque: newContract.vehicule_marque || null,
        vehicule_modele: newContract.vehicule_modele || null,
        numero_immatriculation: newContract.numero_immatriculation || null,
        prime_mensuelle: parseFloat(newContract.prime_mensuelle),
        date_debut: newContract.date_debut,
        date_fin: newContract.date_fin,
        statut: "actif",
        details: newContract.details,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      // Ici vous pouvez ajouter l'insertion en base de données si nécessaire
      console.log("Nouveau contrat:", contractData)

      toast({
        title: "Contrat créé",
        description: `Contrat d'assurance ${newContract.type_assurance} pour ${newContract.client_name} créé avec succès`
      })

      setNewContract({
        client_id: "",
        client_name: "",
        type_assurance: "auto",
        vehicule_marque: "",
        vehicule_modele: "",
        numero_immatriculation: "",
        prime_mensuelle: "",
        date_debut: "",
        date_fin: "",
        details: ""
      })
      setIsAddingContract(false)
    } catch (error) {
      console.error("Erreur lors de la création:", error)
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de créer le contrat"
      })
    }
  }

  const handleViewContract = (contract: InsuranceContract) => {
    setSelectedContract(contract)
    setIsDetailsDialogOpen(true)
  }

  const handleStatusChange = async (contractId: string, newStatus: string) => {
    try {
      // Ici vous pouvez ajouter la mise à jour en base de données
      console.log(`Mise à jour du statut du contrat ${contractId} vers ${newStatus}`)
      
      // Mettre à jour l'état local temporairement
      // Dans une vraie application, vous rechargeriez les données depuis la base
      
      toast({
        title: "Statut mis à jour",
        description: `Le statut du contrat a été changé en "${newStatus}"`
      })
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error)
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le statut"
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "actif": return "bg-green-100 text-green-800"
      case "expire": return "bg-red-100 text-red-800"
      case "suspendu": return "bg-yellow-100 text-yellow-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "auto": return "bg-blue-100 text-blue-800"
      case "habitation": return "bg-purple-100 text-purple-800"
      case "vie": return "bg-green-100 text-green-800"
      case "sante": return "bg-orange-100 text-orange-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const isExpiringSoon = (dateStr: string) => {
    const expiryDate = new Date(dateStr)
    const today = new Date()
    const timeDiff = expiryDate.getTime() - today.getTime()
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))
    return daysDiff <= 30 && daysDiff > 0
  }

  const activeContracts = insuranceContracts.filter(c => c.statut === 'actif').length
  const expiringContracts = insuranceContracts.filter(c => isExpiringSoon(c.date_fin)).length
  const totalPrimes = insuranceContracts.reduce((sum, c) => sum + c.prime_mensuelle, 0)

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">Contrats d'Assurance</h1>
          <p className="text-muted-foreground">
            Gestion des polices d'assurance - {filteredContracts.length} contrat{filteredContracts.length > 1 ? 's' : ''}
          </p>
        </div>
        
        <Dialog open={isAddingContract} onOpenChange={setIsAddingContract}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nouveau Contrat
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Créer un Contrat d'Assurance</DialogTitle>
              <DialogDescription>
                Enregistrer une nouvelle police d'assurance
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="client_name">Client *</Label>
                <Select value={newContract.client_name} onValueChange={(value) => setNewContract(prev => ({ ...prev, client_name: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un client" />
                  </SelectTrigger>
                  <SelectContent>
                    {insuranceClients.map((client) => (
                      <SelectItem key={client.id} value={`${client.prenom} ${client.nom}`}>
                        {client.prenom} {client.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type_assurance">Type d'Assurance *</Label>
                <Select value={newContract.type_assurance} onValueChange={(value: "auto" | "habitation" | "vie" | "sante") => setNewContract(prev => ({ ...prev, type_assurance: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Assurance Auto</SelectItem>
                    <SelectItem value="habitation">Assurance Habitation</SelectItem>
                    <SelectItem value="vie">Assurance Vie</SelectItem>
                    <SelectItem value="sante">Assurance Santé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {newContract.type_assurance === "auto" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="vehicule_marque">Marque du Véhicule</Label>
                    <Input
                      id="vehicule_marque"
                      value={newContract.vehicule_marque}
                      onChange={(e) => setNewContract(prev => ({ ...prev, vehicule_marque: e.target.value }))}
                      placeholder="Toyota, Peugeot..."
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="vehicule_modele">Modèle</Label>
                    <Input
                      id="vehicule_modele"
                      value={newContract.vehicule_modele}
                      onChange={(e) => setNewContract(prev => ({ ...prev, vehicule_modele: e.target.value }))}
                      placeholder="Corolla, 206..."
                    />
                  </div>
                  
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="numero_immatriculation">Numéro d'Immatriculation</Label>
                    <Input
                      id="numero_immatriculation"
                      value={newContract.numero_immatriculation}
                      onChange={(e) => setNewContract(prev => ({ ...prev, numero_immatriculation: e.target.value }))}
                      placeholder="DK-1234-AB"
                    />
                  </div>
                </>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="prime_mensuelle">Prime Mensuelle (FCFA) *</Label>
                <Input
                  id="prime_mensuelle"
                  type="number"
                  value={newContract.prime_mensuelle}
                  onChange={(e) => setNewContract(prev => ({ ...prev, prime_mensuelle: e.target.value }))}
                  placeholder="125000"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="date_debut">Date de Début</Label>
                <Input
                  id="date_debut"
                  type="date"
                  value={newContract.date_debut}
                  onChange={(e) => setNewContract(prev => ({ ...prev, date_debut: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="date_fin">Date de Fin</Label>
                <Input
                  id="date_fin"
                  type="date"
                  value={newContract.date_fin}
                  onChange={(e) => setNewContract(prev => ({ ...prev, date_fin: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2 col-span-2">
                <Label htmlFor="details">Détails / Notes</Label>
                <Textarea
                  id="details"
                  value={newContract.details}
                  onChange={(e) => setNewContract(prev => ({ ...prev, details: e.target.value }))}
                  placeholder="Couverture, franchises, conditions particulières..."
                  rows={3}
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsAddingContract(false)}>
                Annuler
              </Button>
              <Button onClick={handleAddContract}>
                Créer le Contrat
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contrats Actifs</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeContracts}</div>
            <p className="text-xs text-muted-foreground">
              En cours de validité
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expirant Bientôt</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{expiringContracts}</div>
            <p className="text-xs text-muted-foreground">
              Dans les 30 prochains jours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Primes Mensuelles</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPrimes.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              FCFA total mensuel
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contrats</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{insuranceContracts.length}</div>
            <p className="text-xs text-muted-foreground">
              Tous statuts confondus
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
                  placeholder="Rechercher par client, véhicule, immatriculation..."
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
                <SelectItem value="actif">Actif</SelectItem>
                <SelectItem value="expire">Expiré</SelectItem>
                <SelectItem value="suspendu">Suspendu</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="auto">Auto</SelectItem>
                <SelectItem value="habitation">Habitation</SelectItem>
                <SelectItem value="vie">Vie</SelectItem>
                <SelectItem value="sante">Santé</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tableau des contrats */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Contrats d'Assurance</CardTitle>
          <CardDescription>
            Gestion et suivi de votre portefeuille de contrats d'assurance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Détails</TableHead>
                <TableHead>Prime Mensuelle</TableHead>
                <TableHead>Validité</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContracts.map((contract) => (
                <TableRow key={contract.id}>
                  <TableCell>
                    <div className="font-medium">{contract.client_name}</div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getTypeColor(contract.type_assurance)}>
                      {contract.type_assurance}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {contract.type_assurance === 'auto' && contract.vehicule_marque ? (
                      <div>
                        <div className="text-sm font-medium">{contract.vehicule_marque} {contract.vehicule_modele}</div>
                        <div className="text-sm text-muted-foreground">{contract.numero_immatriculation}</div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{contract.prime_mensuelle.toLocaleString()} FCFA</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>Du {new Date(contract.date_debut).toLocaleDateString()}</div>
                      <div>Au {new Date(contract.date_fin).toLocaleDateString()}</div>
                      {isExpiringSoon(contract.date_fin) && (
                        <Badge variant="outline" className="mt-1 text-orange-600">
                          Expire bientôt
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(contract.statut)}>
                      {contract.statut}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewContract(contract)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Voir
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewContract(contract)}
                      >
                        <Info className="h-3 w-3 mr-1" />
                        Détails
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredContracts.length === 0 && (
            <div className="text-center py-10">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">Aucun contrat trouvé</h3>
              <p className="text-muted-foreground">
                {searchTerm || filterStatus !== "all" || filterType !== "all"
                  ? "Aucun contrat ne correspond à vos critères de recherche."
                  : "Commencez par créer votre premier contrat d'assurance."
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog des détails */}
      <ContractDetailsDialog
        contract={selectedContract}
        isOpen={isDetailsDialogOpen}
        onOpenChange={setIsDetailsDialogOpen}
        onStatusChange={handleStatusChange}
      />
    </div>
  )
}