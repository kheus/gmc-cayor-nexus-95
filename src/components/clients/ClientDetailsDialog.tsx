import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { User, MapPin, Calendar, FileText, Edit, Mail, Phone } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ClientDetailsDialogProps {
  client: any | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onStatusChange?: (clientId: string, newStatus: string) => void
}

export function ClientDetailsDialog({ 
  client, 
  isOpen, 
  onOpenChange, 
  onStatusChange 
}: ClientDetailsDialogProps) {
  const [isEditingStatus, setIsEditingStatus] = useState(false)
  const [tempStatus, setTempStatus] = useState("")
  const { toast } = useToast()

  if (!client) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case "actif": return "bg-gmc-success-light text-gmc-success border border-gmc-success/20"
      case "inactif": return "bg-muted text-muted-foreground border border-border"
      case "suspendu": return "bg-gmc-danger-light text-gmc-danger border border-gmc-danger/20"
      default: return "bg-gmc-primary-soft text-gmc-primary border border-gmc-primary/20"
    }
  }

  const getSecteurColor = (secteur: string) => {
    switch (secteur) {
      case "immobilier": return "bg-gmc-primary-soft text-gmc-primary border border-gmc-primary/20"
      case "voyage": return "bg-gmc-success-light text-gmc-success border border-gmc-success/20"
      case "assurance": return "bg-purple-50 text-purple-700 border border-purple-200"
      default: return "bg-muted text-muted-foreground border border-border"
    }
  }

  const handleStatusUpdate = () => {
    if (tempStatus && onStatusChange) {
      onStatusChange(client.id, tempStatus)
      setIsEditingStatus(false)
      toast({
        title: "Statut mis à jour",
        description: `Le statut du client a été changé en "${tempStatus}"`
      })
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR')
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto gmc-card-elevated">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Fiche Client Détaillée
          </DialogTitle>
          <DialogDescription>
            Informations complètes du client {client.prenom} {client.nom}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informations personnelles */}
          <Card className="gmc-card-elevated border-border/30">
            <CardHeader className="bg-gradient-to-r from-gmc-primary-soft/30 to-transparent rounded-t-xl">
              <CardTitle className="flex items-center gap-3 text-gmc-primary">
                <User className="h-5 w-5" />
                Informations Personnelles
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Nom Complet</Label>
                <p className="text-xl font-bold">{client.prenom} {client.nom}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Statut</Label>
                <div className="mt-1 flex items-center gap-2">
                  {!isEditingStatus ? (
                    <>
                      <Badge className={getStatusColor(client.statut || "actif")}>
                        {client.statut || "actif"}
                      </Badge>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setIsEditingStatus(true)
                          setTempStatus(client.statut || "actif")
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
                          <SelectItem value="actif">Actif</SelectItem>
                          <SelectItem value="inactif">Inactif</SelectItem>
                          <SelectItem value="suspendu">Suspendu</SelectItem>
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
                <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium">{client.email}</p>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Téléphone</Label>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium">{client.telephone}</p>
                </div>
              </div>

              {client.date_naissance && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Date de Naissance</Label>
                  <p className="font-medium">{formatDate(client.date_naissance)}</p>
                </div>
              )}

              {client.nationalite && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Nationalité</Label>
                  <p className="font-medium">{client.nationalite}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Adresse */}
          <Card className="gmc-card-elevated border-border/30">
            <CardHeader className="bg-gradient-to-r from-blue-50/50 to-transparent rounded-t-xl">
              <CardTitle className="flex items-center gap-3 text-blue-700">
                <MapPin className="h-5 w-5" />
                Localisation
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Adresse</Label>
                <p className="font-medium">{client.adresse}</p>
              </div>
              
              {client.ville && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Ville</Label>
                  <p className="font-medium">{client.ville}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Secteurs d'activité */}
          <Card className="gmc-card-elevated border-border/30">
            <CardHeader className="bg-gradient-to-r from-emerald-50/50 to-transparent rounded-t-xl">
              <CardTitle className="flex items-center gap-3 text-emerald-700">
                <FileText className="h-5 w-5" />
                Secteurs d'Activité
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {client.secteurs?.map((secteur: string) => (
                  <Badge key={secteur} className={getSecteurColor(secteur)}>
                    {secteur}
                  </Badge>
                )) || <span className="text-muted-foreground">Aucun secteur défini</span>}
              </div>
            </CardContent>
          </Card>

          {/* Informations spécifiques par secteur */}
          {client.secteurs?.includes('immobilier') && client.profession && (
            <Card>
              <CardHeader>
                <CardTitle className="text-blue-600">Informations Immobilier</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Profession</Label>
                  <p className="font-medium">{client.profession}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {client.secteurs?.includes('voyage') && (client.type_voyageur || client.numero_passeport) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600">Informations Voyage</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {client.type_voyageur && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Type de Voyageur</Label>
                    <p className="font-medium capitalize">{client.type_voyageur}</p>
                  </div>
                )}
                {client.numero_passeport && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Numéro de Passeport</Label>
                    <p className="font-mono bg-muted px-2 py-1 rounded text-sm">
                      {client.numero_passeport}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {client.secteurs?.includes('assurance') && (client.type_client || client.numero_permis) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-purple-600">Informations Assurance</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {client.type_client && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Type de Client</Label>
                    <p className="font-medium capitalize">{client.type_client}</p>
                  </div>
                )}
                {client.numero_permis && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Numéro de Permis</Label>
                    <p className="font-mono bg-muted px-2 py-1 rounded text-sm">
                      {client.numero_permis}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Préférences et notes */}
          {client.preferences && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Préférences et Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed bg-muted p-3 rounded">
                  {client.preferences}
                </p>
              </CardContent>
            </Card>
          )}

          <Separator />
          
          {/* Actions */}
          <div className="flex justify-between">
            <div className="text-sm text-muted-foreground">
              Client enregistré le {formatDate(client.created_at || new Date().toISOString())}
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline">
                Exporter Fiche
              </Button>
              <Button variant="outline">
                Modifier
              </Button>
              <Button>
                Contacter
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}