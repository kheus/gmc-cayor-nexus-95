import { useState } from "react"
import { useForm } from "react-hook-form"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface UnifiedPaymentFormProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: any) => Promise<{ success: boolean; message: string }>
}

interface PaymentFormData {
  secteur: 'immobilier' | 'voyage' | 'assurance'
  client_name: string
  type_paiement: string
  montant: string
  methode: string
  date_paiement: string
  reference?: string
  details?: string
  
  // Champs spécifiques par secteur
  property_name?: string
  contract_id?: string
  destination?: string
  reservation_id?: string
  vehicule_marque?: string
  vehicule_modele?: string
  numero_immatriculation?: string
}

export function UnifiedPaymentForm({ isOpen, onOpenChange, onSubmit }: UnifiedPaymentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const form = useForm<PaymentFormData>({
    defaultValues: {
      secteur: "immobilier",
      client_name: "",
      type_paiement: "",
      montant: "",
      methode: "virement",
      date_paiement: "",
      reference: "",
      details: ""
    }
  })

  const watchedSector = form.watch("secteur")

  const handleSubmit = async (data: PaymentFormData) => {
    setIsSubmitting(true)
    try {
      const result = await onSubmit(data)
      if (result.success) {
        form.reset()
        onOpenChange(false)
      }
    } catch (error) {
      console.error('Erreur lors de la soumission:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getPaymentTypes = (secteur: string) => {
    switch (secteur) {
      case "immobilier":
        return ["Loyer", "Caution", "Charges", "Entretien", "Assurance Propriété"]
      case "voyage":
        return ["Réservation Vol", "Réservation Hôtel", "Location Voiture", "Package Complet", "Assurance Voyage"]
      case "assurance":
        return ["Prime Auto", "Prime Habitation", "Prime Vie", "Prime Santé", "Franchise"]
      default:
        return []
    }
  }

  const getSectorInfo = (secteur: string) => {
    switch (secteur) {
      case "immobilier":
        return {
          icon: "🏠",
          description: "Paiements liés aux propriétés et contrats de location",
          color: "bg-blue-100 text-blue-800 border-blue-300"
        }
      case "voyage":
        return {
          icon: "✈️",
          description: "Paiements pour réservations et services de voyage",
          color: "bg-green-100 text-green-800 border-green-300"
        }
      case "assurance":
        return {
          icon: "🛡️",
          description: "Paiements de primes et services d'assurance",
          color: "bg-purple-100 text-purple-800 border-purple-300"
        }
      default:
        return { icon: "💳", description: "", color: "" }
    }
  }

  const renderSectorSpecificFields = () => {
    switch (watchedSector) {
      case "immobilier":
        return (
          <div className="space-y-4">
            <h4 className="font-medium text-sm text-muted-foreground">Détails Immobilier</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="property_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom de la propriété</FormLabel>
                    <FormControl>
                      <Input placeholder="Appartement Plateau" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contract_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID Contrat</FormLabel>
                    <FormControl>
                      <Input placeholder="CONT001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        )

      case "voyage":
        return (
          <div className="space-y-4">
            <h4 className="font-medium text-sm text-muted-foreground">Détails Voyage</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="destination"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destination</FormLabel>
                    <FormControl>
                      <Input placeholder="Paris, France" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="reservation_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID Réservation</FormLabel>
                    <FormControl>
                      <Input placeholder="RES001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        )

      case "assurance":
        return (
          <div className="space-y-4">
            <h4 className="font-medium text-sm text-muted-foreground">Détails Assurance</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="vehicule_marque"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marque véhicule</FormLabel>
                    <FormControl>
                      <Input placeholder="Toyota" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="vehicule_modele"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Modèle véhicule</FormLabel>
                    <FormControl>
                      <Input placeholder="Corolla" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="numero_immatriculation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Numéro d'immatriculation</FormLabel>
                  <FormControl>
                    <Input placeholder="DK-1234-AB" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )

      default:
        return null
    }
  }

  const sectorInfo = getSectorInfo(watchedSector)

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nouveau Paiement Unifié</DialogTitle>
          <DialogDescription>
            Enregistrer un paiement pour tous secteurs d'activité GMC
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            
            {/* Sélection du secteur */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base">1. Secteur d'activité</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="secteur"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Secteur</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Choisir un secteur" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="immobilier">🏠 Immobilier</SelectItem>
                          <SelectItem value="voyage">✈️ Voyage</SelectItem>
                          <SelectItem value="assurance">🛡️ Assurance</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {sectorInfo.description && (
                  <div className="flex items-center gap-2">
                    <Badge className={sectorInfo.color}>
                      {sectorInfo.icon} {watchedSector.charAt(0).toUpperCase() + watchedSector.slice(1)}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{sectorInfo.description}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Informations client */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base">2. Informations client</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="client_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom du client</FormLabel>
                      <FormControl>
                        <Input placeholder="Amadou Diallo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type_paiement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type de paiement</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Choisir le type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {getPaymentTypes(watchedSector).map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Détails du paiement */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base">3. Détails du paiement</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="montant"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Montant (FCFA)</FormLabel>
                        <FormControl>
                          <Input placeholder="450000" type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="methode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Méthode de paiement</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Méthode" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="virement">Virement bancaire</SelectItem>
                            <SelectItem value="especes">Espèces</SelectItem>
                            <SelectItem value="carte">Carte bancaire</SelectItem>
                            <SelectItem value="cheque">Chèque</SelectItem>
                            <SelectItem value="mobile">Mobile Money</SelectItem>
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
                    name="date_paiement"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date de paiement</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="reference"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Référence</FormLabel>
                        <FormControl>
                          <Input placeholder="REF001" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Champs spécifiques au secteur */}
            {renderSectorSpecificFields() && (
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-base">4. Détails spécifiques</CardTitle>
                </CardHeader>
                <CardContent>
                  {renderSectorSpecificFields()}
                </CardContent>
              </Card>
            )}

            {/* Notes */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base">5. Notes (optionnel)</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="details"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Détails et observations</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Notes supplémentaires sur ce paiement..." 
                          rows={3} 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Enregistrement..." : "Enregistrer le paiement"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}