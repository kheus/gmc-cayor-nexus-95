import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Car, User, Shield, Calendar, CreditCard, FileText, PenTool } from "lucide-react"

export function ContratAssuranceForm({ form }: { form: any }) {
  return (
    <div className="space-y-6">
      {/* Section 1: Informations du Souscripteur */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Informations du Souscripteur
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="contrat.souscripteur.nomComplet"
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
              name="contrat.souscripteur.dateNaissance"
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
              name="contrat.souscripteur.lieuNaissance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lieu de naissance</FormLabel>
                  <FormControl>
                    <Input placeholder="Lieu de naissance" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="contrat.souscripteur.nationalite"
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
              name="contrat.souscripteur.profession"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profession</FormLabel>
                  <FormControl>
                    <Input placeholder="Profession" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="contrat.souscripteur.telephone"
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
              name="contrat.souscripteur.email"
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
              name="contrat.souscripteur.typePiece"
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
              name="contrat.souscripteur.numeroPiece"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Numéro de la pièce</FormLabel>
                  <FormControl>
                    <Input placeholder="Numéro de la pièce" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="contrat.souscripteur.adresse"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Adresse</FormLabel>
                <FormControl>
                  <Textarea placeholder="Adresse complète" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Section 2: Informations sur le Véhicule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            Informations sur le Véhicule à Assurer
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="contrat.vehicule.marque"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Marque</FormLabel>
                  <FormControl>
                    <Input placeholder="Toyota" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="contrat.vehicule.modele"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Modèle</FormLabel>
                  <FormControl>
                    <Input placeholder="Corolla" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="contrat.vehicule.immatriculation"
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
              name="contrat.vehicule.anneeCirculation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Année de mise en circulation</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="2020" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="contrat.vehicule.numeroChassis"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Numéro de châssis</FormLabel>
                  <FormControl>
                    <Input placeholder="Numéro de châssis" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="contrat.vehicule.cylindree"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cylindrée (CV fiscaux)</FormLabel>
                  <FormControl>
                    <Input placeholder="7 CV" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="contrat.vehicule.typeVehicule"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type de véhicule</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="moto">Moto</SelectItem>
                      <SelectItem value="moins5cv">&lt; 5CV</SelectItem>
                      <SelectItem value="5a9cv">5-9CV</SelectItem>
                      <SelectItem value="plus9cv">&gt; 9CV</SelectItem>
                      <SelectItem value="utilitaire">Utilitaire</SelectItem>
                      <SelectItem value="autre">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="contrat.vehicule.valeurEstimee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valeur estimée (F CFA)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="5000000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="contrat.vehicule.usage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Usage du véhicule</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="personnel">Personnel</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="taxi">Taxi</SelectItem>
                      <SelectItem value="autre">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Type de Garantie */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Type de Garantie Choisie
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="contrat.garantie"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Garanties disponibles</FormLabel>
                <div className="space-y-3">
                  {[
                    { value: "rc-simple", label: "Responsabilité Civile Simple" },
                    { value: "rc-vol", label: "RC + Vol" },
                    { value: "rc-vol-incendie", label: "RC + Vol + Incendie" },
                    { value: "tous-risques", label: "Tous Risques" }
                  ].map((garantie) => (
                    <div key={garantie.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={garantie.value}
                        checked={field.value === garantie.value}
                        onCheckedChange={() => field.onChange(garantie.value)}
                      />
                      <label htmlFor={garantie.value} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {garantie.label}
                      </label>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  💬 Remarque : Le tarif dépend de la catégorie de véhicule (cf. grille tarifaire).
                </p>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Section 4: Durée du Contrat */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Durée du Contrat
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="contrat.duree.dateDebut"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date de début de couverture</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="contrat.duree.dureeContrat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Durée du contrat</FormLabel>
                  <FormControl>
                    <Input placeholder="1 an par défaut" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="contrat.duree.dateEcheance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date d'échéance</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>

      {/* Section 5: Paiement */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Paiement
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="contrat.paiement.primeAnnuelle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prime annuelle (FCFA)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="450000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="contrat.paiement.modePaiement"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mode de paiement</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="especes">Espèces</SelectItem>
                      <SelectItem value="virement">Virement</SelectItem>
                      <SelectItem value="mobile-money">Mobile Money</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="contrat.paiement.datePaiement"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Paiement effectué le</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="contrat.paiement.numeroRecu"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reçu n°</FormLabel>
                  <FormControl>
                    <Input placeholder="REC-2024-001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>

      {/* Section 6: Pièces à Fournir */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Pièces à Fournir
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="contrat.pieces"
            render={() => (
              <FormItem>
                <FormLabel>Documents requis</FormLabel>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    "Copie de la carte grise",
                    "Copie de la pièce d'identité du propriétaire",
                    "Photos du véhicule (avant / arrière / côtés)",
                    "Ancien contrat (si renouvellement)"
                  ].map((piece) => (
                    <FormField
                      key={piece}
                      control={form.control}
                      name="contrat.pieces"
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
        </CardContent>
      </Card>

      {/* Section 7: Observations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Observations (facultatif)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="contrat.observations"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Remarques, conditions particulières, etc.</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Zone de texte libre pour remarques, conditions particulières, etc."
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

      {/* Section 8: Signatures */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PenTool className="h-5 w-5" />
            Signatures
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="contrat.signatures.lieu"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fait à</FormLabel>
                  <FormControl>
                    <Input placeholder="Dakar" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="contrat.signatures.date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Le</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <div className="text-center p-4 border-2 border-dashed border-muted-foreground rounded-lg">
              <p className="text-sm font-medium mb-2">🖊 Signature du Souscripteur</p>
              <div className="h-20 flex items-center justify-center text-muted-foreground">
                [Espace signature]
              </div>
            </div>
            
            <div className="text-center p-4 border-2 border-dashed border-muted-foreground rounded-lg">
              <p className="text-sm font-medium mb-2">🖊 Signature de l'Assureur</p>
              <div className="h-20 flex items-center justify-center text-muted-foreground">
                [Espace signature]
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}