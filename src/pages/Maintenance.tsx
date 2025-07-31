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
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-primary">Gestion de la Maintenance</h1>
        <p className="text-muted-foreground">Suivi des interventions et réparations</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="space-y-2">
            <Label htmlFor="search">Rechercher</Label>
            <Input
              id="search"
              placeholder="Propriété, description..."
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
                <SelectItem value="termine">Terminé</SelectItem>
                <SelectItem value="encours">En cours</SelectItem>
                <SelectItem value="attente">En attente</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle Intervention
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>🧰 Formulaire de Maintenance</DialogTitle>
              <DialogDescription>
                Déclarer ou suivre un besoin de réparation
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                
                {/* Section Bien concerné */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">🏘️ Bien concerné</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <FormField
                       control={form.control}
                       name="propriete_id"
                       render={({ field }) => (
                         <FormItem>
                           <FormLabel>ID de la propriété (optionnel)</FormLabel>
                           <FormControl>
                             <Input placeholder="Ex: 12345678-1234-1234-1234-123456789012" {...field} />
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
                           <FormLabel>Coût d'intervention (FCFA)</FormLabel>
                           <FormControl>
                             <Input type="number" placeholder="50000" {...field} />
                           </FormControl>
                           <FormMessage />
                         </FormItem>
                       )}
                     />
                  </div>
                </div>

                {/* Section Locataire concerné */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">🧑‍💼 Locataire concerné (optionnel)</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <FormField
                       control={form.control}
                       name="client_id"
                       render={({ field }) => (
                         <FormItem>
                           <FormLabel>ID du client (optionnel)</FormLabel>
                           <FormControl>
                             <Input placeholder="Ex: 12345678-1234-1234-1234-123456789012" {...field} />
                           </FormControl>
                           <FormMessage />
                         </FormItem>
                       )}
                     />
                  </div>
                </div>

                {/* Section Détails du problème */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">🛠️ Détails du problème</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="type_panne"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type de panne</FormLabel>
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
                          <FormLabel>Urgence</FormLabel>
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
                        <FormLabel>Description du problème</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Description détaillée du problème rencontré" rows={3} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Section Planification */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">📅 Planification</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="technicien_affecte"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Technicien affecté</FormLabel>
                          <FormControl>
                            <Input placeholder="Moussa Plombier" {...field} />
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
                          <FormLabel>Statut</FormLabel>
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
                        <FormLabel>Date d'intervention</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
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
                     name="photo_probleme_url"
                     render={({ field }) => (
                       <FormItem>
                         <FormLabel>Photo / vidéo du problème</FormLabel>
                         <FormControl>
                           <Input placeholder="URL de la photo" {...field} />
                         </FormControl>
                         <FormMessage />
                       </FormItem>
                     )}
                   />
                </div>
                
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                    Annuler
                  </Button>
                  <Button type="submit">Créer l'intervention</Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Interventions de Maintenance</CardTitle>
          <CardDescription>
            {maintenanceItems.length} intervention(s) enregistrée(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <p>Chargement des interventions...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bien</TableHead>
                    <TableHead>Locataire</TableHead>
                    <TableHead>Type de panne</TableHead>
                    <TableHead>Urgence</TableHead>
                    <TableHead>Technicien</TableHead>
                    <TableHead>Date intervention</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                 {maintenanceItems.map((item) => (
                   <TableRow key={item.id}>
                     <TableCell className="font-medium">{item.propriete_id || "Non défini"}</TableCell>
                     <TableCell>{item.client_id || "Non renseigné"}</TableCell>
                     <TableCell>{item.type_panne}</TableCell>
                     <TableCell>{getUrgencyBadge(item.urgence)}</TableCell>
                      <TableCell>{item.technicien_affecte}</TableCell>
                      <TableCell>{item.date_intervention ? new Date(item.date_intervention).toLocaleDateString() : "À définir"}</TableCell>
                      <TableCell>{getStatusBadge(item.statut)}</TableCell>
                      <TableCell>
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