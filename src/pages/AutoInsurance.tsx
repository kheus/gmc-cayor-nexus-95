import { useState, useEffect } from "react"
import { useDataSync } from '@/hooks/useDataSync'
import { Car, Plus, AlertTriangle, Calendar, Users, Euro, Shield, Save, Printer, Search, Eye, Trash2, Edit, MoreHorizontal } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAutoInsurances } from "@/hooks/useAutoInsurances"
import { useClients } from "@/hooks/useClients"
import { supabase } from "@/integrations/supabase/client"
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

interface AutoInsurancePolicy {
  id: string
  client_id: string
  client_name: string
  marque_vehicule: string
  modele_vehicule: string
  annee_vehicule: number
  immatriculation: string
  numero_police: string
  date_debut: string
  date_fin: string
  prime_mensuelle: number
  statut: string
  type_couverture: string
}

export function AutoInsurance() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [policies, setPolicies] = useState<AutoInsurancePolicy[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPolicy, setSelectedPolicy] = useState<AutoInsurancePolicy | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isStatusOpen, setIsStatusOpen] = useState(false)
  const [newStatus, setNewStatus] = useState("")
  const [newPolicy, setNewPolicy] = useState({
    client_id: '',
    marque_vehicule: '',
    modele_vehicule: '',
    annee_vehicule: new Date().getFullYear(),
    immatriculation: '',
    numero_police: '',
    date_debut: '',
    date_fin: '',
    prime_mensuelle: 0,
    type_couverture: 'tous_risques'
  })
  
  const { toast } = useToast()
  const { clients } = useClients()
  const { 
    insurances, 
    loading: autoInsurancesLoading,
    addInsurance 
  } = useAutoInsurances()

  const fetchAutoInsurances = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('assurances_auto')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      // Enrichir avec les informations clients
      const enrichedPolicies = (data || []).map(policy => {
        const client = clients.find(c => c.id === policy.client_id)
        return {
          id: policy.id,
          client_id: policy.client_id || '',
          client_name: client ? `${client.prenom} ${client.nom}` : 'Client inconnu',
          marque_vehicule: policy.marque_vehicule || '',
          modele_vehicule: policy.modele_vehicule || '',
          annee_vehicule: policy.annee_vehicule || 0,
          immatriculation: policy.immatriculation || '',
          numero_police: policy.numero_police || '',
          date_debut: policy.date_debut || '',
          date_fin: policy.date_fin || '',
          prime_mensuelle: Number(policy.prime_mensuelle) || 0,
          statut: policy.statut || 'actif',
          type_couverture: policy.type_couverture || 'tous_risques'
        }
      })

      setPolicies(enrichedPolicies)
    } catch (error) {
      console.error('Erreur lors du chargement des assurances auto:', error)
      toast({
        title: "Erreur",
        description: "Impossible de charger les assurances auto",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (clients.length > 0) {
      fetchAutoInsurances()
    }
  }, [clients])

  const filteredPolicies = policies.filter(policy =>
    policy.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    policy.numero_police.toLowerCase().includes(searchTerm.toLowerCase()) ||
    policy.immatriculation.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleNewContract = async () => {
    try {
      const result = await addInsurance({
        client_id: newPolicy.client_id,
        marque_vehicule: newPolicy.marque_vehicule,
        modele_vehicule: newPolicy.modele_vehicule,
        annee_vehicule: newPolicy.annee_vehicule,
        immatriculation: newPolicy.immatriculation,
        numero_police: newPolicy.numero_police,
        date_debut: newPolicy.date_debut,
        date_fin: newPolicy.date_fin,
        prime_mensuelle: newPolicy.prime_mensuelle,
        type_couverture: newPolicy.type_couverture as "tous_risques" | "responsabilite" | "tiers_collision",
        statut: 'active' as "active" | "expiree" | "suspendue" | "resiliee"
      })

      if (result) {
        await fetchAutoInsurances()
        setIsFormOpen(false)
        setNewPolicy({
          client_id: '',
          marque_vehicule: '',
          modele_vehicule: '',
          annee_vehicule: new Date().getFullYear(),
          immatriculation: '',
          numero_police: '',
          date_debut: '',
          date_fin: '',
          prime_mensuelle: 0,
          type_couverture: 'tous_risques'
        })
        
        toast({
          title: "Succès",
          description: "Contrat d'assurance créé avec succès"
        })
      }
    } catch (error) {
      console.error('Erreur lors de la création du contrat:', error)
      toast({
        title: "Erreur",
        description: "Erreur lors de la création du contrat",
        variant: "destructive"
      })
    }
  }

  const handleViewDetails = (policy: AutoInsurancePolicy) => {
    setSelectedPolicy(policy)
    setIsDetailsOpen(true)
  }

  const handleChangeStatus = (policy: AutoInsurancePolicy) => {
    setSelectedPolicy(policy)
    setNewStatus(policy.statut || 'actif')
    setIsStatusOpen(true)
  }

  const handleStatusUpdate = async () => {
    if (!selectedPolicy || !newStatus) return
    
    try {
      const { error } = await supabase
        .from('assurances_auto')
        .update({ statut: newStatus as any })
        .eq('id', selectedPolicy.id)

      if (error) throw error

      await fetchAutoInsurances()
      setIsStatusOpen(false)
      setSelectedPolicy(null)
      setNewStatus("")
      
      toast({
        title: "Statut mis à jour",
        description: "Le statut du contrat a été mis à jour avec succès"
      })
    } catch (error) {
      console.error('Error updating policy status:', error)
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive"
      })
    }
  }

  const handleDelete = async (policyId: string) => {
    try {
      const { error } = await supabase
        .from('assurances_auto')
        .delete()
        .eq('id', policyId)

      if (error) throw error

      await fetchAutoInsurances()
      toast({
        title: "Succès",
        description: "Contrat supprimé avec succès"
      })
    } catch (error) {
      console.error('Error deleting policy:', error)
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le contrat",
        variant: "destructive"
      })
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      actif: "default",
      active: "default",
      expire: "destructive",
      expiree: "destructive",
      suspendu: "secondary",
      suspendue: "secondary",
      resiliee: "outline"
    } as const
    
    const labels = {
      actif: "Actif",
      active: "Actif",
      expire: "Expiré",
      expiree: "Expiré",
      suspendu: "Suspendu",
      suspendue: "Suspendu",
      resiliee: "Résilié"
    }
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || "outline"}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    )
  }

  // Calculer les statistiques
  const totalPolicies = policies.length
  const activePolicies = policies.filter(p => p.statut === 'actif').length
  const expiredPolicies = policies.filter(p => p.statut === 'expire').length
  const totalPremiums = policies.reduce((sum, p) => sum + p.prime_mensuelle, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Shield className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Assurance Auto</h1>
          <p className="text-muted-foreground">
            Gestion des contrats d'assurance automobile
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Polices</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPolicies}</div>
            <p className="text-xs text-muted-foreground">Toutes catégories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Polices Actives</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activePolicies}</div>
            <p className="text-xs text-muted-foreground">En vigueur</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Polices Expirées</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{expiredPolicies}</div>
            <p className="text-xs text-muted-foreground">À renouveler</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Primes Mensuelles</CardTitle>
            <Euro className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPremiums.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">FCFA/mois</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Contrats d'Assurance Auto</CardTitle>
              <CardDescription>Suivi des polices d'assurance automobile</CardDescription>
            </div>
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nouveau Contrat
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Nouveau Contrat d'Assurance Auto</DialogTitle>
                  <DialogDescription>
                    Créer un nouveau contrat d'assurance automobile
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="client">Client</Label>
                      <Select 
                        value={newPolicy.client_id} 
                        onValueChange={(value) => setNewPolicy(prev => ({ ...prev, client_id: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un client" />
                        </SelectTrigger>
                        <SelectContent>
                          {clients.filter(c => c.secteurs.includes('assurance')).map(client => (
                            <SelectItem key={client.id} value={client.id}>
                              {client.prenom} {client.nom}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="numero_police">Numéro de Police</Label>
                      <Input
                        id="numero_police"
                        value={newPolicy.numero_police}
                        onChange={(e) => setNewPolicy(prev => ({ ...prev, numero_police: e.target.value }))}
                        placeholder="AUTO-001"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="marque">Marque du Véhicule</Label>
                      <Input
                        id="marque"
                        value={newPolicy.marque_vehicule}
                        onChange={(e) => setNewPolicy(prev => ({ ...prev, marque_vehicule: e.target.value }))}
                        placeholder="Toyota, Peugeot..."
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="modele">Modèle</Label>
                      <Input
                        id="modele"
                        value={newPolicy.modele_vehicule}
                        onChange={(e) => setNewPolicy(prev => ({ ...prev, modele_vehicule: e.target.value }))}
                        placeholder="Corolla, 308..."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="annee">Année</Label>
                      <Input
                        id="annee"
                        type="number"
                        value={newPolicy.annee_vehicule}
                        onChange={(e) => setNewPolicy(prev => ({ ...prev, annee_vehicule: parseInt(e.target.value) }))}
                        placeholder="2024"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="immatriculation">Immatriculation</Label>
                      <Input
                        id="immatriculation"
                        value={newPolicy.immatriculation}
                        onChange={(e) => setNewPolicy(prev => ({ ...prev, immatriculation: e.target.value }))}
                        placeholder="AB-123-CD"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date_debut">Date de Début</Label>
                      <Input
                        id="date_debut"
                        type="date"
                        value={newPolicy.date_debut}
                        onChange={(e) => setNewPolicy(prev => ({ ...prev, date_debut: e.target.value }))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="date_fin">Date de Fin</Label>
                      <Input
                        id="date_fin"
                        type="date"
                        value={newPolicy.date_fin}
                        onChange={(e) => setNewPolicy(prev => ({ ...prev, date_fin: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="prime">Prime Mensuelle (FCFA)</Label>
                      <Input
                        id="prime"
                        type="number"
                        value={newPolicy.prime_mensuelle}
                        onChange={(e) => setNewPolicy(prev => ({ ...prev, prime_mensuelle: parseFloat(e.target.value) }))}
                        placeholder="50000"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="couverture">Type de Couverture</Label>
                      <Select 
                        value={newPolicy.type_couverture} 
                        onValueChange={(value) => setNewPolicy(prev => ({ ...prev, type_couverture: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tous_risques">Tous Risques</SelectItem>
                          <SelectItem value="tiers_plus">Tiers Plus</SelectItem>
                          <SelectItem value="tiers_simple">Tiers Simple</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsFormOpen(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleNewContract}>
                    <Save className="mr-2 h-4 w-4" />
                    Créer le Contrat
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <Input
              placeholder="Rechercher un contrat..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button variant="outline" size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-8">Chargement des contrats...</div>
          ) : filteredPolicies.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {policies.length === 0 ? "Aucun contrat trouvé" : "Aucun résultat pour cette recherche"}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Police</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Véhicule</TableHead>
                  <TableHead>Immatriculation</TableHead>
                  <TableHead>Période</TableHead>
                  <TableHead>Prime/Mois</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPolicies.map((policy) => (
                  <TableRow key={policy.id}>
                    <TableCell className="font-medium">{policy.numero_police}</TableCell>
                    <TableCell>{policy.client_name}</TableCell>
                    <TableCell>
                      <div className="font-medium">{policy.marque_vehicule} {policy.modele_vehicule}</div>
                      <div className="text-sm text-muted-foreground">{policy.annee_vehicule}</div>
                    </TableCell>
                    <TableCell>{policy.immatriculation}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>Du: {new Date(policy.date_debut).toLocaleDateString()}</div>
                        <div>Au: {new Date(policy.date_fin).toLocaleDateString()}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">
                      {policy.prime_mensuelle.toLocaleString()} FCFA
                    </TableCell>
                    <TableCell>{getStatusBadge(policy.statut)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-background border shadow-lg z-50">
                          <DropdownMenuItem onClick={() => handleViewDetails(policy)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Voir détails
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleChangeStatus(policy)}>
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
                                  Êtes-vous sûr de vouloir supprimer ce contrat d'assurance ? Cette action ne peut pas être annulée.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(policy.id)}>
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
          )}
        </CardContent>
      </Card>

      {/* Dialog pour afficher les détails */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>🚗 Détails du Contrat d'Assurance Auto</DialogTitle>
            <DialogDescription>
              Informations complètes du contrat d'assurance automobile
            </DialogDescription>
          </DialogHeader>
          {selectedPolicy && (
            <div className="space-y-6">
              {/* Informations du client */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">👤 Client</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Nom du client</Label>
                    <p className="font-medium">{selectedPolicy.client_name}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Numéro de police</Label>
                    <p className="font-medium">{selectedPolicy.numero_police}</p>
                  </div>
                </div>
              </div>

              {/* Informations du véhicule */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">🚗 Véhicule</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Marque</Label>
                    <p className="font-medium">{selectedPolicy.marque_vehicule}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Modèle</Label>
                    <p className="font-medium">{selectedPolicy.modele_vehicule}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Année</Label>
                    <p className="font-medium">{selectedPolicy.annee_vehicule}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Immatriculation</Label>
                    <p className="font-medium">{selectedPolicy.immatriculation}</p>
                  </div>
                </div>
              </div>

              {/* Détails du contrat */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">📋 Contrat</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Type de couverture</Label>
                    <p className="font-medium">{selectedPolicy.type_couverture}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Prime mensuelle</Label>
                    <p className="font-medium text-lg">{selectedPolicy.prime_mensuelle.toLocaleString()} FCFA</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Date de début</Label>
                    <p className="font-medium">{new Date(selectedPolicy.date_debut).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Date de fin</Label>
                    <p className="font-medium">{new Date(selectedPolicy.date_fin).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Statut</Label>
                    <div className="mt-1">{getStatusBadge(selectedPolicy.statut)}</div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
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
              Modifier le statut du contrat d'assurance de "{selectedPolicy?.client_name}"
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
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="expiree">Expiré</SelectItem>
                  <SelectItem value="suspendue">Suspendu</SelectItem>
                  <SelectItem value="resiliee">Résilié</SelectItem>
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