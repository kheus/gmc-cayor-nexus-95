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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Détails de l'Intervention
          </DialogTitle>
          <DialogDescription>
            Informations complètes de l'intervention #{maintenance.id?.slice(0, 8)}...
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informations générales */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Informations Générales
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Type de Panne</Label>
                <p className="text-lg font-semibold capitalize">{maintenance.type_panne}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Urgence</Label>
                <div className="mt-1">
                  <Badge className={getUrgencyColor(maintenance.urgence)}>
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    {maintenance.urgence}
                  </Badge>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Statut</Label>
                <div className="mt-1 flex items-center gap-2">
                  {!isEditingStatus ? (
                    <>
                      <Badge className={getStatusColor(maintenance.statut)}>
                        {maintenance.statut}
                      </Badge>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setIsEditingStatus(true)
                          setTempStatus(maintenance.statut)
                        }}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                    </>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Select value={tempStatus} onValueChange={setTempStatus}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en_attente">En attente</SelectItem>
                          <SelectItem value="en_cours">En cours</SelectItem>
                          <SelectItem value="termine">Terminé</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button size="sm" onClick={handleStatusUpdate}>
                        OK
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setIsEditingStatus(false)}
                      >
                        Annuler
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Technicien Affecté</Label>
                <p className="font-medium">{maintenance.technicien_affecte || "Non assigné"}</p>
              </div>
            </CardContent>
          </Card>

          {/* Identifiants */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Références
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Propriété ID</Label>
                <p className="font-mono bg-muted px-2 py-1 rounded text-sm">
                  {maintenance.propriete_id || "Non renseigné"}
                </p>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Client ID</Label>
                <p className="font-mono bg-muted px-2 py-1 rounded text-sm">
                  {maintenance.client_id || "Non renseigné"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Coût et dates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Planification et Coût
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Coût d'Intervention</Label>
                <p className="text-xl font-bold text-green-600">
                  {maintenance.cout_intervention?.toLocaleString() || "0"} FCFA
                </p>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Date d'Intervention</Label>
                <p className="font-medium">
                  {maintenance.date_intervention ? formatDate(maintenance.date_intervention) : "À définir"}
                </p>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Date de Demande</Label>
                <p className="font-medium">
                  {maintenance.date_demande ? formatDate(maintenance.date_demande) : "N/A"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Description du problème */}
          {maintenance.description_probleme && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Description du Problème
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed bg-muted p-3 rounded">
                  {maintenance.description_probleme || "Aucune description fournie"}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Photo du problème */}
          {maintenance.photo_probleme_url && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Documentation Visuelle
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Photo/Vidéo du problème</Label>
                  <div className="mt-2">
                    <a 
                      href={maintenance.photo_probleme_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
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
          <div className="flex justify-between">
            <div className="text-sm text-muted-foreground">
              Intervention créée le {formatDate(maintenance.created_at || new Date().toISOString())}
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline">
                Générer Rapport
              </Button>
              <Button variant="outline">
                Modifier
              </Button>
              <Button>
                Clôturer
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}