import { Building2, Plus, Search, Filter, Upload, ImageIcon, Eye, Trash2, MoreHorizontal, Edit } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { useProperties } from "@/hooks/useProperties"

export default function Properties() {
  const { properties, loading, addProperty, deleteProperty, updateProperty } = useProperties()
  const [isOpen, setIsOpen] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<any>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isStatusOpen, setIsStatusOpen] = useState(false)
  const [newStatus, setNewStatus] = useState("")
  
  const form = useForm({
    defaultValues: {
      type_bien: "appartement",
      titre_bien: "",
      adresse: "",
      ville_zone: "",
      superficie: "",
      nombre_pieces: "",
      etage: "",
    usage: "habitation",
    statut: "disponible",
    lien_photos: "",
      description: "",
      prix_loyer: "",
      charges_mensuelles: ""
    }
  })

  const onSubmit = async (data: any) => {
    try {
      await addProperty(data)
      form.reset()
      setIsOpen(false)
    } catch (error) {
      console.error('Error adding property:', error)
    }
  }

  const handleViewDetails = (property: any) => {
    setSelectedProperty(property)
    setIsDetailsOpen(true)
  }

  const handleChangeStatus = (property: any) => {
    setSelectedProperty(property)
    setNewStatus(property.statut || 'disponible')
    setIsStatusOpen(true)
  }

  const handleStatusUpdate = async () => {
    if (!selectedProperty || !newStatus) return
    
    try {
      await updateProperty(selectedProperty.id, { statut: newStatus as any })
      setIsStatusOpen(false)
      setSelectedProperty(null)
      setNewStatus("")
    } catch (error) {
      console.error('Error updating property status:', error)
    }
  }

  const handleDelete = async (propertyId: string) => {
    try {
      await deleteProperty(propertyId)
    } catch (error) {
      console.error('Error deleting property:', error)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "loue":
        return <Badge className="bg-success/20 text-success border-success/30">Loué</Badge>
      case "disponible":
        return <Badge variant="secondary">Disponible</Badge>
      case "en_vente":
        return <Badge variant="outline">En vente</Badge>
      case "occupe":
        return <Badge className="bg-warning/20 text-warning border-warning/30">Occupé</Badge>
      case "hors_service":
        return <Badge variant="destructive">Hors service</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-primary">Gestion des Propriétés</h1>
        <p className="text-muted-foreground">Gestion de votre portefeuille immobilier</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="space-y-2">
            <Label htmlFor="search">Rechercher</Label>
            <Input
              id="search"
              placeholder="Adresse, type, ID..."
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
                <SelectItem value="loue">Loué</SelectItem>
                <SelectItem value="disponible">Disponible</SelectItem>
                <SelectItem value="en_vente">En vente</SelectItem>
                <SelectItem value="occupe">Occupé</SelectItem>
                <SelectItem value="hors_service">Hors service</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle Propriété
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>🏠 Formulaire de Propriété Immobilière</DialogTitle>
              <DialogDescription>
                Créer ou modifier une fiche de bien immobilier
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                
                {/* Section Détails du bien */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">🏘️ Détails du bien</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="type_bien"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type de bien</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="appartement">Appartement</SelectItem>
                              <SelectItem value="maison">Maison</SelectItem>
                              <SelectItem value="terrain">Terrain</SelectItem>
                              <SelectItem value="bureau">Bureau</SelectItem>
                              <SelectItem value="autre">Autre</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="titre_bien"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Titre du bien</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Appartement moderne Dakar" {...field} />
                          </FormControl>
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
                        <FormLabel>Adresse</FormLabel>
                        <FormControl>
                          <Input placeholder="Adresse complète du bien" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="ville_zone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ville / Zone</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Dakar, Plateau" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="superficie"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Superficie (m²)</FormLabel>
                          <FormControl>
                            <Input placeholder="75" type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="nombre_pieces"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre de pièces</FormLabel>
                          <FormControl>
                            <Input placeholder="3" type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="etage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Étage</FormLabel>
                          <FormControl>
                            <Input placeholder="2ème étage" {...field} />
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
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Usage" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="habitation">Habitation</SelectItem>
                              <SelectItem value="commercial">Commercial</SelectItem>
                              <SelectItem value="mixte">Mixte</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="statut"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Statut</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner le statut" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="disponible">Disponible</SelectItem>
                            <SelectItem value="loue">Loué</SelectItem>
                            <SelectItem value="en_vente">En vente</SelectItem>
                            <SelectItem value="occupe">Occupé</SelectItem>
                            <SelectItem value="hors_service">Hors service</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Section Médias */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">📸 Médias</h3>
                  
                  <FormField
                    control={form.control}
                    name="lien_photos"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lien photos / dossier Drive</FormLabel>
                        <FormControl>
                          <Input placeholder="https://drive.google.com/..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Description détaillée du bien" rows={3} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Section Données financières */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">💰 Données financières</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="prix_loyer"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Prix / Loyer mensuel (FCFA)</FormLabel>
                          <FormControl>
                            <Input placeholder="450000" type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="charges_mensuelles"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Charges mensuelles (FCFA)</FormLabel>
                          <FormControl>
                            <Input placeholder="25000" type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                    Annuler
                  </Button>
                  <Button type="submit">Ajouter la propriété</Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des Propriétés</CardTitle>
          <CardDescription>
            {properties.length} propriété(s) dans votre portefeuille
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Bien</TableHead>
                  <TableHead>Titre</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Ville</TableHead>
                  <TableHead>Superficie</TableHead>
                  <TableHead>Loyer</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {properties.map((property) => (
                  <TableRow key={property.id}>
                    <TableCell className="font-medium">{property.id || property.id_bien || `PROP${property.id?.slice(-3)}`}</TableCell>
                    <TableCell>{property.titre || property.titre_bien}</TableCell>
                    <TableCell>{property.type_bien}</TableCell>
                    <TableCell>{property.ville || property.ville_zone}</TableCell>
                    <TableCell>{property.superficie} m²</TableCell>
                    <TableCell>{(property.prix_loyer_mensuel || property.prix_loyer || 0).toLocaleString()} CFA</TableCell>
                    <TableCell>{getStatusBadge(property.statut || 'disponible')}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-background border shadow-lg z-50">
                          <DropdownMenuItem onClick={() => handleViewDetails(property)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Voir détails
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleChangeStatus(property)}>
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
                                  Êtes-vous sûr de vouloir supprimer cette propriété ? Cette action ne peut pas être annulée.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(property.id)}>
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
        </CardContent>
      </Card>

      {/* Dialog pour afficher les détails */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>📋 Détails de la Propriété</DialogTitle>
            <DialogDescription>
              Informations complètes de la propriété
            </DialogDescription>
          </DialogHeader>
          {selectedProperty && (
            <div className="space-y-6">
              {/* Informations générales */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">🏘️ Informations générales</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Type de bien</Label>
                    <p className="font-medium">{selectedProperty.type_bien}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Statut</Label>
                    <div className="mt-1">{getStatusBadge(selectedProperty.statut || 'disponible')}</div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Titre</Label>
                    <p className="font-medium">{selectedProperty.titre || selectedProperty.titre_bien}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Usage</Label>
                    <p className="font-medium">{selectedProperty.usage}</p>
                  </div>
                </div>
              </div>

              {/* Localisation */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">📍 Localisation</h3>
                <div className="space-y-2">
                  <div>
                    <Label className="text-muted-foreground">Adresse</Label>
                    <p className="font-medium">{selectedProperty.adresse}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Ville / Zone</Label>
                    <p className="font-medium">{selectedProperty.ville || selectedProperty.ville_zone}</p>
                  </div>
                </div>
              </div>

              {/* Caractéristiques */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">🏠 Caractéristiques</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Superficie</Label>
                    <p className="font-medium">{selectedProperty.superficie} m²</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Nombre de pièces</Label>
                    <p className="font-medium">{selectedProperty.nombre_pieces || 'Non spécifié'}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Étage</Label>
                    <p className="font-medium">{selectedProperty.etage || 'Non spécifié'}</p>
                  </div>
                </div>
              </div>

              {/* Informations financières */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">💰 Informations financières</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Loyer mensuel</Label>
                    <p className="font-medium">{(selectedProperty.prix_loyer_mensuel || selectedProperty.prix_loyer || 0).toLocaleString()} CFA</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Charges mensuelles</Label>
                    <p className="font-medium">{(selectedProperty.charges_mensuelles || 0).toLocaleString()} CFA</p>
                  </div>
                </div>
              </div>

              {/* Description et médias */}
              {(selectedProperty.description || selectedProperty.lien_photos) && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">📝 Description et médias</h3>
                  {selectedProperty.description && (
                    <div>
                      <Label className="text-muted-foreground">Description</Label>
                      <p className="font-medium mt-1">{selectedProperty.description}</p>
                    </div>
                  )}
                  {selectedProperty.lien_photos && (
                    <div>
                      <Label className="text-muted-foreground">Lien photos</Label>
                      <a 
                        href={selectedProperty.lien_photos} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline block mt-1"
                      >
                        Voir les photos
                      </a>
                    </div>
                  )}
                </div>
              )}

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
              Modifier le statut de la propriété "{selectedProperty?.titre || selectedProperty?.titre_bien}"
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
                  <SelectItem value="disponible">Disponible</SelectItem>
                  <SelectItem value="loue">Loué</SelectItem>
                  <SelectItem value="en_vente">En vente</SelectItem>
                  <SelectItem value="occupe">Occupé</SelectItem>
                  <SelectItem value="hors_service">Hors service</SelectItem>
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