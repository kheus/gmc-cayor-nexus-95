import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { CreditCard, User, Calendar, FileText, Edit } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PaymentDetailsDialogProps {
  payment: any | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onStatusChange?: (paymentId: string, newStatus: string) => void
}

export function PaymentDetailsDialog({ 
  payment, 
  isOpen, 
  onOpenChange, 
  onStatusChange 
}: PaymentDetailsDialogProps) {
  const [isEditingStatus, setIsEditingStatus] = useState(false)
  const [tempStatus, setTempStatus] = useState("")
  const { toast } = useToast()

  console.log("💳 PaymentDetailsDialog rendu avec:", { payment, isOpen, onOpenChange })

  if (!payment) {
    console.log("💳 Pas de payment, on ne rend rien")
    return null
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800"
      case "partial": return "bg-yellow-100 text-yellow-800"  
      case "pending": return "bg-orange-100 text-orange-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getMethodBadge = (method: string) => {
    switch (method) {
      case "virement": return "bg-blue-100 text-blue-800"
      case "especes": return "bg-green-100 text-green-800"
      case "carte": return "bg-purple-100 text-purple-800"
      case "cheque": return "bg-yellow-100 text-yellow-800"
      case "mobile": return "bg-pink-100 text-pink-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const handleStatusUpdate = () => {
    if (tempStatus && onStatusChange) {
      onStatusChange(payment.id, tempStatus)
      setIsEditingStatus(false)
      toast({
        title: "Statut mis à jour",
        description: `Le statut du paiement a été changé en "${tempStatus}"`
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
            <CreditCard className="h-5 w-5" />
            Détails du Paiement
          </DialogTitle>
          <DialogDescription>
            Informations complètes du paiement #{payment.id?.slice(0, 8)}...
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
                <p className="text-lg font-semibold">{payment.client_name}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Secteur</Label>
                <div className="mt-1">
                  <Badge variant="outline" className="capitalize">
                    {payment.secteur}
                  </Badge>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Statut</Label>
                <div className="mt-1 flex items-center gap-2">
                  {!isEditingStatus ? (
                    <>
                      <Badge className={getStatusColor(payment.statut)}>
                        {payment.statut}
                      </Badge>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setIsEditingStatus(true)
                          setTempStatus(payment.statut)
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
                          <SelectItem value="completed">Complété</SelectItem>
                          <SelectItem value="partial">Partiel</SelectItem>
                          <SelectItem value="pending">En attente</SelectItem>
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
                <Label className="text-sm font-medium text-muted-foreground">Type de Paiement</Label>
                <p className="font-medium">{payment.type_paiement}</p>
              </div>
            </CardContent>
          </Card>

          {/* Détails financiers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Détails Financiers
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Montant</Label>
                <p className="text-xl font-bold text-green-600">
                  {payment.montant?.toLocaleString()} FCFA
                </p>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Méthode</Label>
                <div className="mt-1">
                  <Badge className={getMethodBadge(payment.methode)}>
                    {payment.methode}
                  </Badge>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Référence</Label>
                <p className="font-mono bg-muted px-2 py-1 rounded text-sm">
                  {payment.reference || "N/A"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Dates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Informations Temporelles
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Date de paiement</Label>
                <p className="font-medium">{formatDate(payment.date_paiement)}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Date d'enregistrement</Label>
                <p className="font-medium">{formatDate(payment.created_at || new Date().toISOString())}</p>
              </div>
            </CardContent>
          </Card>

          {/* Détails supplémentaires */}
          {(payment.details || payment.observations) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Détails Complémentaires
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {payment.details && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Détails</Label>
                    <div className="mt-1 bg-muted p-3 rounded text-sm">
                      {typeof payment.details === 'object' ? (
                        <pre className="whitespace-pre-wrap">
                          {JSON.stringify(payment.details, null, 2)}
                        </pre>
                      ) : (
                        <p>{String(payment.details)}</p>
                      )}
                    </div>
                  </div>
                )}
                
                {payment.observations && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Observations</Label>
                    <p className="text-sm leading-relaxed mt-1">{payment.observations}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <Separator />
          
          {/* Actions */}
          <div className="flex justify-between">
            <div className="text-sm text-muted-foreground">
              Paiement enregistré le {formatDate(payment.created_at || new Date().toISOString())}
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline">
                Générer Reçu
              </Button>
              <Button variant="outline">
                Modifier
              </Button>
              <Button>
                Dupliquer
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}