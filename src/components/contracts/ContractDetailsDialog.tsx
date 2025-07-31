import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Calendar, Car, User, Shield, FileText, Edit } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { InsuranceContract } from "@/types/gmc"

interface ContractDetailsDialogProps {
  contract: InsuranceContract | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onStatusChange?: (contractId: string, newStatus: string) => void
}

export function ContractDetailsDialog({ 
  contract, 
  isOpen, 
  onOpenChange, 
  onStatusChange 
}: ContractDetailsDialogProps) {
  const [isEditingStatus, setIsEditingStatus] = useState(false)
  const [tempStatus, setTempStatus] = useState("")
  const { toast } = useToast()

  if (!contract) return null

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

  const handleStatusUpdate = () => {
    if (tempStatus && onStatusChange) {
      onStatusChange(contract.id, tempStatus)
      setIsEditingStatus(false)
      toast({
        title: "Statut mis à jour",
        description: `Le statut du contrat a été changé en "${tempStatus}"`
      })
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR')
  }

  const isExpiringSoon = (dateStr: string) => {
    const expiryDate = new Date(dateStr)
    const today = new Date()
    const timeDiff = expiryDate.getTime() - today.getTime()
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))
    return daysDiff <= 30 && daysDiff > 0
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Détails du Contrat d'Assurance
          </DialogTitle>
          <DialogDescription>
            Informations complètes du contrat #{contract.id?.slice(0, 8)}...
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
                <Label className="text-sm font-medium text-muted-foreground">Client</Label>
                <p className="text-lg font-semibold">{contract.client_name}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Type d'Assurance</Label>
                <div className="mt-1">
                  <Badge className={getTypeColor(contract.type_assurance)}>
                    {contract.type_assurance}
                  </Badge>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Statut</Label>
                <div className="mt-1 flex items-center gap-2">
                  {!isEditingStatus ? (
                    <>
                      <Badge className={getStatusColor(contract.statut)}>
                        {contract.statut}
                      </Badge>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setIsEditingStatus(true)
                          setTempStatus(contract.statut)
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
                          <SelectItem value="expire">Expiré</SelectItem>
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
                <Label className="text-sm font-medium text-muted-foreground">Prime Mensuelle</Label>
                <p className="text-lg font-semibold text-green-600">
                  {contract.prime_mensuelle.toLocaleString()} FCFA
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Informations sur le véhicule (si assurance auto) */}
          {contract.type_assurance === 'auto' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-4 w-4" />
                  Informations Véhicule
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {contract.vehicule_marque && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Marque</Label>
                    <p className="font-medium">{contract.vehicule_marque}</p>
                  </div>
                )}
                
                {contract.vehicule_modele && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Modèle</Label>
                    <p className="font-medium">{contract.vehicule_modele}</p>
                  </div>
                )}
                
                {contract.numero_immatriculation && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Immatriculation</Label>
                    <p className="font-medium font-mono bg-muted px-2 py-1 rounded">
                      {contract.numero_immatriculation}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Dates et validité */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Validité du Contrat
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Date de début</Label>
                <p className="font-medium">{formatDate(contract.date_debut)}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Date de fin</Label>
                <div className="flex items-center gap-2">
                  <p className="font-medium">{formatDate(contract.date_fin)}</p>
                  {isExpiringSoon(contract.date_fin) && (
                    <Badge variant="outline" className="text-orange-600">
                      Expire bientôt
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Détails supplémentaires */}
          {contract.details && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Détails et Conditions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{String(contract.details)}</p>
              </CardContent>
            </Card>
          )}

          <Separator />
          
          {/* Actions */}
          <div className="flex justify-between">
            <div className="text-sm text-muted-foreground">
              Contrat créé le {formatDate(contract.created_at || new Date().toISOString())}
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline">
                Générer PDF
              </Button>
              <Button variant="outline">
                Modifier
              </Button>
              <Button>
                Renouveler
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}