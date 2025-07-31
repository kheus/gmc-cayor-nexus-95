import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Building, Shield, Plane, FileText, MessageSquare } from "lucide-react"

interface FormSectionProps {
  form: any
  watchedServices: string[]
}

export function GeneralInfoSection({ form }: { form: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Informations générales
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="nom"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom complet</FormLabel>
                <FormControl>
                  <Input placeholder="Nom complet" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="dateNaissance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date de naissance</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="nationalite"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nationalité</FormLabel>
                <FormControl>
                  <Input placeholder="Nationalité" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="telephone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Téléphone</FormLabel>
                <FormControl>
                  <Input placeholder="77 123 45 67" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="email@exemple.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="typePiece"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type de pièce d'identité</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="CNI">CNI</SelectItem>
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
            name="numeroPiece"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Numéro de pièce</FormLabel>
                <FormControl>
                  <Input placeholder="Numéro de pièce" {...field} />
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
              <FormLabel>Adresse actuelle</FormLabel>
              <FormControl>
                <Textarea placeholder="Adresse complète" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="services"
          render={() => (
            <FormItem>
              <FormLabel>Type de service (GMC Assurance)</FormLabel>
              <div className="flex flex-wrap gap-4">
                {[
                  { id: "immobilier", label: "Immobilier", icon: Building },
                  { id: "assurance", label: "Assurance", icon: Shield },
                  { id: "voyage", label: "Voyage", icon: Plane }
                ].map((service) => (
                  <FormField
                    key={service.id}
                    control={form.control}
                    name="services"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(service.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...(field.value || []), service.id])
                                : field.onChange(
                                    field.value?.filter((value: string) => value !== service.id)
                                  )
                            }}
                          />
                        </FormControl>
                        <FormLabel className="flex items-center gap-2 font-normal">
                          <service.icon className="h-4 w-4" />
                          {service.label}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  )
}

export function ImmobilierSection({ form }: { form: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          Service Immobilier
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="immobilier.typeService"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type de service</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="location">Location</SelectItem>
                    <SelectItem value="vente">Vente</SelectItem>
                    <SelectItem value="gestion">Gestion locative</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="immobilier.typeBien"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type de bien</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="appartement">Appartement</SelectItem>
                    <SelectItem value="maison">Maison</SelectItem>
                    <SelectItem value="bureau">Bureau</SelectItem>
                    <SelectItem value="terrain">Terrain</SelectItem>
                    <SelectItem value="autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="immobilier.nombrePieces"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre de pièces</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="3" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="immobilier.superficie"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Superficie (m²)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="100" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="immobilier.dureeContrat"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Durée du contrat</FormLabel>
                <FormControl>
                  <Input placeholder="12 mois" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="immobilier.prix"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Loyer ou prix (FCFA)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="250000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="immobilier.adresseBien"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Adresse du bien</FormLabel>
              <FormControl>
                <Textarea placeholder="Adresse complète du bien" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  )
}

export function AssuranceSection({ form }: { form: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Service Assurance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="assurance.typeContrat"
          render={() => (
            <FormItem>
              <FormLabel>Type de contrat</FormLabel>
              <div className="flex flex-wrap gap-4">
                {[
                  { id: "auto", label: "Auto" },
                  { id: "sante", label: "Santé" },
                  { id: "habitation", label: "Incendie / Habitation" },
                  { id: "voyage", label: "Voyage" }
                ].map((type) => (
                  <FormField
                    key={type.id}
                    control={form.control}
                    name="assurance.typeContrat"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(type.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...(field.value || []), type.id])
                                : field.onChange(
                                    field.value?.filter((value: string) => value !== type.id)
                                  )
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {type.label}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="assurance.numeroContrat"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Numéro du contrat</FormLabel>
                <FormControl>
                  <Input placeholder="Numéro du contrat" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="assurance.dateSouscription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date de souscription</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="assurance.vehicule.marqueModele"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Marque/Modèle véhicule</FormLabel>
                <FormControl>
                  <Input placeholder="Toyota Corolla" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="assurance.vehicule.immatriculation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Immatriculation</FormLabel>
                <FormControl>
                  <Input placeholder="DK-1234-AB" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="assurance.vehicule.valeur"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valeur assurée véhicule (FCFA)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="5000000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="assurance.habitation.valeur"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valeur assurée habitation (FCFA)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="25000000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="assurance.habitation.adresse"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Adresse du bien assuré</FormLabel>
              <FormControl>
                <Textarea placeholder="Adresse complète du bien assuré" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="assurance.voyage.destination"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Destination (assurance voyage)</FormLabel>
              <FormControl>
                <Input placeholder="France, Europe, etc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  )
}

export function VoyageSection({ form }: { form: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plane className="h-5 w-5" />
          Service Voyage
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="voyage.destination"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Destination</FormLabel>
                <FormControl>
                  <Input placeholder="Destination" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="voyage.typeVoyage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type de voyage</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="tourisme">Tourisme</SelectItem>
                    <SelectItem value="affaires">Affaires</SelectItem>
                    <SelectItem value="etudes">Études</SelectItem>
                    <SelectItem value="pelerinage">Pèlerinage</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="voyage.dateDepart"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date de départ</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="voyage.dateRetour"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date de retour</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="voyage.hebergement"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hébergement</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="inclus">Inclus</SelectItem>
                    <SelectItem value="non-inclus">Non inclus</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="voyage.billetReserve"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Billet d'avion réservé</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="oui">Oui</SelectItem>
                    <SelectItem value="non">Non</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="voyage.montantTotal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Montant total du voyage (FCFA)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="1500000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  )
}

export function PiecesJointesSection({ form }: { form: any }) {
  const piecesList = [
    "Copie pièce d'identité",
    "Justificatif de domicile", 
    "Contrat signé",
    "Photo du bien / véhicule",
    "Billet de voyage / visa"
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Pièces jointes (facultatives)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="piecesJointes"
          render={() => (
            <FormItem>
              <FormLabel>Documents requis</FormLabel>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {piecesList.map((piece) => (
                  <FormField
                    key={piece}
                    control={form.control}
                    name="piecesJointes"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(piece)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...(field.value || []), piece])
                                : field.onChange(
                                    field.value?.filter((value: string) => value !== piece)
                                  )
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal text-sm">
                          {piece}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="fichierJoint"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Upload fichier</FormLabel>
              <FormControl>
                <Input type="file" multiple {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  )
}

export function CommentairesSection({ form }: { form: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Commentaires / Observations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <FormField
          control={form.control}
          name="commentaires"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Remarques personnalisées</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Ajouter des remarques, conditions particulières, etc."
                  className="min-h-[100px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  )
}