import { Wrench, Plus, AlertCircle, Upload, Camera, Eye, Info } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useMaintenance } from "@/hooks/useMaintenance"
import { MaintenanceDetailsDialog } from "@/components/maintenance/MaintenanceDetailsDialog"

export default function Maintenance() {
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [selectedMaintenance, setSelectedMaintenance] = useState<any>(null)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const { maintenanceItems, loading, addMaintenanceItem } = useMaintenance()
  
  const form = useForm({
    defaultValues: {
      propriete_id: "",
      client_id: "",
      type_panne: "plomberie",
      urgence: "moyenne",
      description_probleme: "",
      technicien_affecte: "",
      statut: "en_attente",
      date_intervention: "",
      photo_probleme_url: "",
      cout_intervention: ""
    }
  })

  const onSubmit = async (data: any) => {
    try {
      const maintenanceData: any = {
        type_panne: data.type_panne,
        urgence: data.urgence,
        description_probleme: data.description_probleme,
        technicien_affecte: data.technicien_affecte || null,
        statut: data.statut,
        date_intervention: data.date_intervention || null,
        photo_probleme_url: data.photo_probleme_url || null,
        cout_intervention: parseFloat(data.cout_intervention) || 0
      }

      // Ajouter propriete_id seulement s'il est fourni et non vide
      if (data.propriete_id && data.propriete_id.trim() !== "") {
        maintenanceData.propriete_id = data.propriete_id
      }

      // Ajouter client_id seulement s'il est fourni et non vide  
      if (data.client_id && data.client_id.trim() !== "") {
        maintenanceData.client_id = data.client_id
      }

      await addMaintenanceItem(maintenanceData)
      
      form.reset()
      setIsOpen(false)
    } catch (error) {
      // L'erreur est déjà gérée dans le hook useMaintenance
    }
  }

  const handleViewMaintenance = (maintenance: any) => {
    setSelectedMaintenance(maintenance)
    setIsDetailsDialogOpen(true)
  }

  const handleStatusChange = async (maintenanceId: string, newStatus: string) => {
    try {
      // Ici vous pouvez ajouter la mise à jour en base de données
      console.log(`Mise à jour du statut de l'intervention ${maintenanceId} vers ${newStatus}`)
      
      toast({
        title: "Statut mis à jour",
        description: `Le statut de l'intervention a été changé en "${newStatus}"`
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

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case "termine":
        return <Badge className="bg-success/20 text-success border-success/30">Terminé</Badge>
      case "en_cours":
        return <Badge variant="secondary">En cours</Badge>
      case "en_attente":
        return <Badge variant="outline">En attente</Badge>
      default:
        return <Badge variant="outline">{status || "Non défini"}</Badge>
    }
  }

  const getUrgencyBadge = (urgency: string | null) => {
    switch (urgency) {
      case "urgente":
        return <Badge variant="destructive">Urgente</Badge>
      case "moyenne":
        return <Badge className="bg-warning/20 text-warning border-warning/30">Moyenne</Badge>
      case "faible":
        return <Badge variant="outline">Faible</Badge>
      default:
        return <Badge variant="outline">{urgency || "Non défini"}</Badge>
    }
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-6 p-3 sm:p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary">Gestion de la Maintenance</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Suivi des interventions et réparations</p>
      </div>

      <div className="flex flex-col gap-3 sm:gap-4">{/* Recherche et filtres sur mobile */}
        <div className="gmc-form-grid">
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="search" className="text-xs sm:text-sm">Rechercher</Label>
            <Input
              id="search"
              placeholder="Propriété, description..."
              className="gmc-input-focus text-sm"
            />
          </div>
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="status" className="text-xs sm:text-sm">Statut</Label>
            <Select>
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="Tous" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="termine">Terminé</SelectItem>
                <SelectItem value="encours">En cours</SelectItem>
                <SelectItem value="attente">En attente</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Bouton d'ajout optimisé mobile */}

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto gmc-button-primary">
              <Plus className="mr-2 h-4 w-4" />
              <span className="hidden xs:inline">Nouvelle Intervention</span>
              <span className="xs:hidden">Nouvelle</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="gmc-dialog-mobile">
            <DialogHeader className="space-y-2">
              <DialogTitle className="text-lg sm:text-xl">🧰 Formulaire de Maintenance</DialogTitle>
              <DialogDescription className="text-sm">
                Déclarer ou suivre un besoin de réparation
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="gmc-dialog-content">
                
                {/* Section Bien concerné */}
                <div className="gmc-form-section">
                  <h3 className="text-base sm:text-lg font-semibold">🏘️ Bien concerné</h3>
                  
                  <div className="gmc-form-grid">
                     <FormField
                       control={form.control}
                       name="propriete_id"
                       render={({ field }) => (
                         <FormItem>
                            <FormLabel className="text-sm">ID de la propriété (optionnel)</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Ex: 12345..." 
                                className="gmc-input-focus text-sm" 
                                {...field} 
                              />
                            </FormControl>
                           <FormMessage />
                         </FormItem>
                       )}
                     />

                     <FormField
                       control={form.control}
                       name="cout_intervention"
                       render={({ field }) => (
                         <FormItem>
                            <FormLabel className="text-sm">Coût d'intervention (FCFA)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="50000" 
                                className="gmc-input-focus text-sm" 
                                {...field} 
                              />
                            </FormControl>
                           <FormMessage />
                         </FormItem>
                       )}
                     />
                  </div>
                </div>

                {/* Section Locataire concerné */}
                <div className="gmc-form-section">
                  <h3 className="text-base sm:text-lg font-semibold">🧑‍💼 Locataire concerné (optionnel)</h3>
                  
                  <div className="gmc-form-grid-full">
                     <FormField
                       control={form.control}
                       name="client_id"
                       render={({ field }) => (
                         <FormItem>
                            <FormLabel className="text-sm">ID du client (optionnel)</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Ex: 12345..." 
                                className="gmc-input-focus text-sm" 
                                {...field} 
                              />
                            </FormControl>
                           <FormMessage />
                         </FormItem>
                       )}
                     />
                  </div>
                </div>

                {/* Section Détails du problème */}
                <div className="gmc-form-section">
                  <h3 className="text-base sm:text-lg font-semibold">🛠️ Détails du problème</h3>
                  
                  <div className="gmc-form-grid">
                    <FormField
                      control={form.control}
                      name="type_panne"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm">Type de panne</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Type" />
                              </SelectTrigger>
                            </FormControl>
                             <SelectContent>
                               <SelectItem value="plomberie">Plomberie</SelectItem>
                               <SelectItem value="electricite">Électricité</SelectItem>
                               <SelectItem value="climatisation">Climatisation</SelectItem>
                               <SelectItem value="peinture">Peinture</SelectItem>
                               <SelectItem value="autre">Autre</SelectItem>
                             </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="urgence"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm">Urgence</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Urgence" />
                              </SelectTrigger>
                            </FormControl>
                             <SelectContent>
                               <SelectItem value="faible">Faible</SelectItem>
                               <SelectItem value="moyenne">Moyenne</SelectItem>
                               <SelectItem value="urgente">Urgente</SelectItem>
                             </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description_probleme"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">Description du problème</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Description détaillée du problème rencontré" 
                            rows={3} 
                            className="gmc-input-focus text-sm resize-none" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Section Planification */}
                <div className="gmc-form-section">
                  <h3 className="text-base sm:text-lg font-semibold">📅 Planification</h3>
                  
                  <div className="gmc-form-grid">
                    <FormField
                      control={form.control}
                      name="technicien_affecte"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm">Technicien affecté</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Moussa Plombier" 
                              className="gmc-input-focus text-sm" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="statut"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm">Statut</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Statut" />
                              </SelectTrigger>
                            </FormControl>
                             <SelectContent>
                               <SelectItem value="en_attente">En attente</SelectItem>
                               <SelectItem value="en_cours">En cours</SelectItem>
                               <SelectItem value="termine">Terminé</SelectItem>
                             </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="date_intervention"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">Date d'intervention</FormLabel>
                        <FormControl>
                          <Input 
                            type="date" 
                            className="gmc-input-focus text-sm" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Section Pièce jointe */}
                <div className="gmc-form-section">
                  <h3 className="text-base sm:text-lg font-semibold">📎 Pièce jointe</h3>
                  
                   <FormField
                     control={form.control}
                     name="photo_probleme_url"
                     render={({ field }) => (
                       <FormItem>
                          <FormLabel className="text-sm">Photo / vidéo du problème</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="URL de la photo" 
                              className="gmc-input-focus text-sm" 
                              {...field} 
                            />
                          </FormControl>
                         <FormMessage />
                       </FormItem>
                     )}
                   />
                </div>
                
                <div className="gmc-form-actions">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsOpen(false)}
                    className="text-sm"
                  >
                    Annuler
                  </Button>
                  <Button type="submit" className="gmc-button-primary text-sm">
                    Créer l'intervention
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="gmc-card-elevated">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl">Interventions de Maintenance</CardTitle>
          <CardDescription className="text-sm">
            {maintenanceItems.length} intervention(s) enregistrée(s)
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <p className="text-sm">Chargement des interventions...</p>
            </div>
          ) : (
            <div className="gmc-table-container">
              <Table className="gmc-table-mobile">
                <TableHeader>
                  <TableRow>
                    <TableHead className="gmc-table-cell text-xs sm:text-sm">Bien</TableHead>
                    <TableHead className="gmc-table-cell text-xs sm:text-sm hidden sm:table-cell">Locataire</TableHead>
                    <TableHead className="gmc-table-cell text-xs sm:text-sm">Type</TableHead>
                    <TableHead className="gmc-table-cell text-xs sm:text-sm">Urgence</TableHead>
                    <TableHead className="gmc-table-cell text-xs sm:text-sm hidden md:table-cell">Technicien</TableHead>
                    <TableHead className="gmc-table-cell text-xs sm:text-sm hidden lg:table-cell">Date</TableHead>
                    <TableHead className="gmc-table-cell text-xs sm:text-sm">Statut</TableHead>
                    <TableHead className="gmc-table-cell text-xs sm:text-sm">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                 {maintenanceItems.map((item) => (
                   <TableRow key={item.id} className="hover:bg-muted/30 transition-colors">
                     <TableCell className="gmc-table-cell font-medium text-xs sm:text-sm">
                       <div className="truncate max-w-[100px] sm:max-w-[150px]">
                         {item.propriete_id?.slice(0, 8) || "Non défini"}...
                       </div>
                     </TableCell>
                     <TableCell className="gmc-table-cell text-xs sm:text-sm hidden sm:table-cell">
                       <div className="truncate max-w-[120px]">
                         {item.client_id?.slice(0, 8) || "Non renseigné"}...
                       </div>
                     </TableCell>
                     <TableCell className="gmc-table-cell text-xs sm:text-sm">
                       <span className="capitalize">{item.type_panne}</span>
                     </TableCell>
                     <TableCell className="gmc-table-cell">{getUrgencyBadge(item.urgence)}</TableCell>
                      <TableCell className="gmc-table-cell text-xs sm:text-sm hidden md:table-cell">
                        <div className="truncate max-w-[100px]">
                          {item.technicien_affecte || "Non assigné"}
                        </div>
                      </TableCell>
                      <TableCell className="gmc-table-cell text-xs sm:text-sm hidden lg:table-cell">
                        {item.date_intervention ? new Date(item.date_intervention).toLocaleDateString() : "À définir"}
                      </TableCell>
                      <TableCell className="gmc-table-cell">{getStatusBadge(item.statut)}</TableCell>
                      <TableCell className="gmc-table-cell">
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewMaintenance(item)}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Voir
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewMaintenance(item)}
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
          </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog des détails */}
      <MaintenanceDetailsDialog
        maintenance={selectedMaintenance}
        isOpen={isDetailsDialogOpen}
        onOpenChange={setIsDetailsDialogOpen}
        onStatusChange={handleStatusChange}
      />
    </div>
  )
}