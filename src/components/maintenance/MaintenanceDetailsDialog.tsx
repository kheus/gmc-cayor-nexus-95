import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Wrench, User, Calendar, FileText, Edit, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface MaintenanceDetailsDialogProps {
  maintenance: any | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onStatusChange?: (maintenanceId: string, newStatus: string) => void
}

export function MaintenanceDetailsDialog({ 
  maintenance, 
  isOpen, 
  onOpenChange, 
  onStatusChange 
}: MaintenanceDetailsDialogProps) {
  const [isEditingStatus, setIsEditingStatus] = useState(false)
  const [tempStatus, setTempStatus] = useState("")
  const { toast } = useToast()

  if (!maintenance) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case "termine": return "bg-green-100 text-green-800"
      case "en_cours": return "bg-blue-100 text-blue-800"
      case "en_attente": return "bg-orange-100 text-orange-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "urgente": return "bg-red-100 text-red-800"
      case "moyenne": return "bg-yellow-100 text-yellow-800"
      case "faible": return "bg-green-100 text-green-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const handleStatusUpdate = () => {
    if (tempStatus && onStatusChange) {
      onStatusChange(maintenance.id, tempStatus)
      setIsEditingStatus(false)
      toast({
        title: "Statut mis à jour",
        description: `Le statut de l'intervention a été changé en "${tempStatus}"`
      })
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR')
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="gmc-dialog-mobile">
        <DialogHeader className="space-y-2">
          <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Wrench className="h-4 w-4 sm:h-5 sm:w-5" />
            Détails de l'Intervention
          </DialogTitle>
          <DialogDescription className="text-sm">
            Informations complètes de l'intervention #{maintenance.id?.slice(0, 8)}...
          </DialogDescription>
        </DialogHeader>

        <div className="gmc-dialog-content">
          {/* Informations générales */}
          <Card className="gmc-card-mobile">
            <CardHeader className="p-3 sm:p-4">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <User className="h-4 w-4" />
                Informations Générales
              </CardTitle>
            </CardHeader>
            <CardContent className="gmc-form-grid p-3 sm:p-4 pt-0">
              <div>
                <Label className="text-xs sm:text-sm font-medium text-muted-foreground">Type de Panne</Label>
                <p className="text-base sm:text-lg font-semibold capitalize">{maintenance.type_panne}</p>
              </div>
              
              <div>
                <Label className="text-xs sm:text-sm font-medium text-muted-foreground">Urgence</Label>
                <div className="mt-1">
                  <Badge className={`${getUrgencyColor(maintenance.urgence)} text-xs`}>
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    {maintenance.urgence}
                  </Badge>
                </div>
              </div>
              
              <div className="col-span-full">
                <Label className="text-xs sm:text-sm font-medium text-muted-foreground">Statut</Label>
                <div className="mt-1 flex items-center gap-2 flex-wrap">
                  {!isEditingStatus ? (
                    <>
                      <Badge className={`${getStatusColor(maintenance.statut)} text-xs`}>
                        {maintenance.statut}
                      </Badge>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setIsEditingStatus(true)
                          setTempStatus(maintenance.statut)
                        }}
                        className="h-6 w-6 p-0"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                    </>
                  ) : (
                    <div className="flex items-center gap-2 flex-wrap">
                      <Select value={tempStatus} onValueChange={setTempStatus}>
                        <SelectTrigger className="w-24 sm:w-32 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en_attente">En attente</SelectItem>
                          <SelectItem value="en_cours">En cours</SelectItem>
                          <SelectItem value="termine">Terminé</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button size="sm" onClick={handleStatusUpdate} className="text-xs h-7">
                        OK
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setIsEditingStatus(false)}
                        className="text-xs h-7"
                      >
                        Annuler
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="col-span-full">
                <Label className="text-xs sm:text-sm font-medium text-muted-foreground">Technicien Affecté</Label>
                <p className="font-medium text-sm sm:text-base">{maintenance.technicien_affecte || "Non assigné"}</p>
              </div>
            </CardContent>
          </Card>

          {/* Identifiants */}
          <Card className="gmc-card-mobile">
            <CardHeader className="p-3 sm:p-4">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <FileText className="h-4 w-4" />
                Références
              </CardTitle>
            </CardHeader>
            <CardContent className="gmc-form-grid p-3 sm:p-4 pt-0">
              <div>
                <Label className="text-xs sm:text-sm font-medium text-muted-foreground">Propriété ID</Label>
                <p className="font-mono bg-muted px-2 py-1 rounded text-xs sm:text-sm break-all">
                  {maintenance.propriete_id || "Non renseigné"}
                </p>
              </div>
              
              <div>
                <Label className="text-xs sm:text-sm font-medium text-muted-foreground">Client ID</Label>
                <p className="font-mono bg-muted px-2 py-1 rounded text-xs sm:text-sm break-all">
                  {maintenance.client_id || "Non renseigné"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Coût et dates */}
          <Card className="gmc-card-mobile">
            <CardHeader className="p-3 sm:p-4">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Calendar className="h-4 w-4" />
                Planification et Coût
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 p-3 sm:p-4 pt-0">
              <div className="sm:col-span-3 md:col-span-1">
                <Label className="text-xs sm:text-sm font-medium text-muted-foreground">Coût d'Intervention</Label>
                <p className="text-lg sm:text-xl font-bold text-gmc-success">
                  {maintenance.cout_intervention?.toLocaleString() || "0"} FCFA
                </p>
              </div>
              
              <div>
                <Label className="text-xs sm:text-sm font-medium text-muted-foreground">Date d'Intervention</Label>
                <p className="font-medium text-sm sm:text-base">
                  {maintenance.date_intervention ? formatDate(maintenance.date_intervention) : "À définir"}
                </p>
              </div>
              
              <div>
                <Label className="text-xs sm:text-sm font-medium text-muted-foreground">Date de Demande</Label>
                <p className="font-medium text-sm sm:text-base">
                  {maintenance.date_demande ? formatDate(maintenance.date_demande) : "N/A"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Description du problème */}
          {maintenance.description_probleme && (
            <Card className="gmc-card-mobile">
              <CardHeader className="p-3 sm:p-4">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <FileText className="h-4 w-4" />
                  Description du Problème
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 pt-0">
                <p className="text-xs sm:text-sm leading-relaxed bg-muted p-3 rounded">
                  {maintenance.description_probleme || "Aucune description fournie"}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Photo du problème */}
          {maintenance.photo_probleme_url && (
            <Card className="gmc-card-mobile">
              <CardHeader className="p-3 sm:p-4">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <FileText className="h-4 w-4" />
                  Documentation Visuelle
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 pt-0">
                <div>
                  <Label className="text-xs sm:text-sm font-medium text-muted-foreground">Photo/Vidéo du problème</Label>
                  <div className="mt-2">
                    <a 
                      href={maintenance.photo_probleme_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gmc-primary hover:underline text-sm break-all"
                    >
                      Voir le fichier
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Separator />
          
          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4">
            <div className="text-xs sm:text-sm text-muted-foreground">
              Intervention créée le {formatDate(maintenance.created_at || new Date().toISOString())}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Button variant="outline" className="text-xs sm:text-sm h-8 sm:h-9">
                Générer Rapport
              </Button>
              <Button variant="outline" className="text-xs sm:text-sm h-8 sm:h-9">
                Modifier
              </Button>
              <Button className="gmc-button-primary text-xs sm:text-sm h-8 sm:h-9">
                Clôturer
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}