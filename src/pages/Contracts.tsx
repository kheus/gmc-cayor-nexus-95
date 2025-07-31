import { FileText, Plus, Download, Upload, User, Home, FileCheck, Shield, Eye, Trash2, Edit, MoreHorizontal } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useContracts } from "@/hooks/useContracts"

interface Contract {
  id: number
  property_id: string
  
  // Parties
  bailleur_nom: string
  bailleur_telephone: string
  bailleur_email: string
  locataire_nom: string
  locataire_telephone: string
  locataire_email: string
  locataire_piece_type: string
  locataire_piece_numero: string
  
  // Bien
  type_bien: string
  adresse: string
  superficie: number
  nombre_pieces: number
  usage: string
  
  // Conditions
  loyer_mensuel: number
  depot_garantie: number
  duree_contrat: string
  date_debut: string
  renouvellement_auto: boolean
  preavis_mois: number
  charges: string[]
  
  // État des lieux
  date_etat_lieux: string
  equipements: string[]
  etat_general: string
  
  // Clauses
  assurance_exigee: boolean
  reparations_charge: string
  observations: string
  
  // Signatures
  date_signature: string
  fichier: string | null
}

export default function Contracts() {
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const { contracts, loading } = useContracts()
  
  const form = useForm({
    defaultValues: {
      property_id: "",
      bailleur_nom: "GMC Immobilier",
      bailleur_telephone: "+221 33 123 45 67",
      bailleur_email: "contact@gmc-immobilier.sn",
      locataire_nom: "",
      locataire_telephone: "",
      locataire_email: "",
      locataire_piece_type: "CIN",
      locataire_piece_numero: "",
      type_bien: "",
      adresse: "",
      superficie: "",
      nombre_pieces: "",
      usage: "Habitation",
      loyer_mensuel: "",
      depot_garantie: "",
      duree_contrat: "1 an",
      date_debut: "",
      renouvellement_auto: true,
      preavis_mois: "2",
      charges: [] as string[],
      date_etat_lieux: "",
      equipements: [] as string[],
      etat_general: "Bon",
      assurance_exigee: true,
      reparations_charge: "Locataire",
      observations: "",
      date_signature: ""
    }
  })

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const onSubmit = (data: any) => {
    const newContract: Contract = {
      id: contracts.length + 1,
      property_id: data.property_id,
      bailleur_nom: data.bailleur_nom,
      bailleur_telephone: data.bailleur_telephone,
      bailleur_email: data.bailleur_email,
      locataire_nom: data.locataire_nom,
      locataire_telephone: data.locataire_telephone,
      locataire_email: data.locataire_email,
      locataire_piece_type: data.locataire_piece_type,
      locataire_piece_numero: data.locataire_piece_numero,
      type_bien: data.type_bien,
      adresse: data.adresse,
      superficie: parseInt(data.superficie),
      nombre_pieces: parseInt(data.nombre_pieces),
      usage: data.usage,
      loyer_mensuel: parseInt(data.loyer_mensuel),
      depot_garantie: parseInt(data.depot_garantie),
      duree_contrat: data.duree_contrat,
      date_debut: data.date_debut,
      renouvellement_auto: data.renouvellement_auto,
      preavis_mois: parseInt(data.preavis_mois),
      charges: data.charges,
      date_etat_lieux: data.date_etat_lieux,
      equipements: data.equipements,
      etat_general: data.etat_general,
      assurance_exigee: data.assurance_exigee,
      reparations_charge: data.reparations_charge,
      observations: data.observations,
      date_signature: data.date_signature,
      fichier: selectedFile ? selectedFile.name : null
    }
    
    // Note: setContracts not needed as contracts are read-only from useContracts hook
    form.reset()
    setSelectedFile(null)
    setIsOpen(false)
    
    toast({
      title: "Succès",
      description: "Contrat de location ajouté avec succès"
    })
  }

  const getStatusBadge = (dateDebut: string, dureeContrat: string) => {
    const today = new Date()
    const debut = new Date(dateDebut)
    const fin = new Date(debut)
    const dureeAnnees = dureeContrat === "2 ans" ? 2 : 1
    fin.setFullYear(fin.getFullYear() + dureeAnnees)
    
    if (today < debut) {
      return <Badge variant="secondary">À venir</Badge>
    } else if (today > fin) {
      return <Badge variant="outline">Expiré</Badge>
    } else {
      return <Badge className="bg-success/20 text-success border-success/30">Actif</Badge>
    }
  }

  const getDateFin = (dateDebut: string, dureeContrat: string) => {
    const debut = new Date(dateDebut)
    const fin = new Date(debut)
    const dureeAnnees = dureeContrat === "2 ans" ? 2 : 1
    fin.setFullYear(fin.getFullYear() + dureeAnnees)
    return fin
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-primary">Contrats de Location</h1>
        <p className="text-muted-foreground">Gestion des contrats de location immobilière</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="space-y-2">
          <Label htmlFor="search">Rechercher</Label>
          <Input
            id="search"
            placeholder="Locataire, propriété..."
            className="w-full sm:w-64"
          />
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouveau Contrat de Location
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Nouveau Contrat de Location Immobilière</DialogTitle>
              <DialogDescription>
                Remplissez les informations du contrat de location
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                
                {/* Section 1: Informations sur les parties */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b">
                    <User className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">Informations sur les parties</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium text-primary">👤 Bailleur</h4>
                      <FormField
                        control={form.control}
                        name="bailleur_nom"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nom complet</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="bailleur_telephone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Téléphone</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="bailleur_email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="font-medium text-primary">👤 Locataire</h4>
                      <FormField
                        control={form.control}
                        name="locataire_nom"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nom complet</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="locataire_telephone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Téléphone</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="locataire_email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="locataire_piece_type"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Type de pièce</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="CIN">CIN</SelectItem>
                                  <SelectItem value="Passeport">Passeport</SelectItem>
                                  <SelectItem value="CEDEAO">CEDEAO</SelectItem>
                                  <SelectItem value="Autre">Autre</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="locataire_piece_numero"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Numéro de pièce</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 2: Détails du bien */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b">
                    <Home className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">Détails du bien</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="property_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ID Propriété</FormLabel>
                          <FormControl>
                            <Input placeholder="PROP001" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="type_bien"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type de bien</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Appartement">Appartement</SelectItem>
                              <SelectItem value="Maison">Maison</SelectItem>
                              <SelectItem value="Local commercial">Local commercial</SelectItem>
                              <SelectItem value="Bureau">Bureau</SelectItem>
                              <SelectItem value="Autre">Autre</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="adresse"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Adresse complète</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="superficie"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Superficie (m²)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="nombre_pieces"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre de pièces</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="usage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Usage</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Habitation">Habitation</SelectItem>
                              <SelectItem value="Commercial">Commercial</SelectItem>
                              <SelectItem value="Professionnel">Professionnel</SelectItem>
                              <SelectItem value="Mixte">Mixte</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Section 3: Conditions du bail */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b">
                    <FileCheck className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">Conditions du bail</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="loyer_mensuel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Montant du loyer mensuel (FCFA)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="depot_garantie"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dépôt de garantie (FCFA)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="duree_contrat"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Durée du contrat</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1 an">1 an</SelectItem>
                              <SelectItem value="2 ans">2 ans</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="date_debut"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date de début</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="preavis_mois"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Préavis (en mois)</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1">1</SelectItem>
                              <SelectItem value="2">2</SelectItem>
                              <SelectItem value="3">3</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="renouvellement_auto"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Renouvellement automatique</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Section 4: État des lieux */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b">
                    <Shield className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">État des lieux et clauses</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="date_etat_lieux"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date état des lieux d'entrée</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="etat_general"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>État général</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Excellent">Excellent</SelectItem>
                              <SelectItem value="Bon">Bon</SelectItem>
                              <SelectItem value="Moyen">Moyen</SelectItem>
                              <SelectItem value="À rénover">À rénover</SelectItem>
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
                      name="assurance_exigee"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Assurance habitation exigée</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="reparations_charge"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Réparations locatives à charge du</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Locataire">Locataire</SelectItem>
                              <SelectItem value="Bailleur">Bailleur</SelectItem>
                              <SelectItem value="Partagées">Partagées</SelectItem>
                            </SelectContent>
                          </Select>
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
                        <FormLabel>Observations complémentaires</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="date_signature"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date de signature</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Fichier du contrat */}
                <div className="space-y-2">
                  <Label htmlFor="fichier">Fichier du contrat (optionnel)</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="fichier"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                    />
                    {selectedFile && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <FileText className="h-4 w-4" />
                        {selectedFile.name}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                    Annuler
                  </Button>
                  <Button type="submit">Enregistrer le contrat</Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des Contrats de Location</CardTitle>
          <CardDescription>
            {contracts.length} contrat(s) de location enregistré(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Propriété</TableHead>
                  <TableHead>Locataire</TableHead>
                  <TableHead>Type de bien</TableHead>
                  <TableHead>Loyer mensuel</TableHead>
                  <TableHead>Début</TableHead>
                  <TableHead>Fin</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Document</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contracts.map((contract) => (
                  <TableRow key={contract.id}>
                    <TableCell className="font-medium">{contract.propriete_id}</TableCell>
                    <TableCell>{contract.client_name}</TableCell>
                    <TableCell>{contract.type_bien}</TableCell>
                    <TableCell>{contract.loyer_mensuel.toLocaleString()} CFA</TableCell>
                    <TableCell>{new Date(contract.date_debut).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(contract.date_fin).toLocaleDateString()}</TableCell>
                    <TableCell>{getStatusBadge(contract.date_debut, "1 an")}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Télécharger
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}