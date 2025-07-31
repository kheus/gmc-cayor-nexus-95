import { z } from "zod"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { GMCSmartForm } from "./GMCSmartForm"
import { Car } from "lucide-react"
import { useClients } from "@/hooks/useClients"

const carRentalSchema = z.object({
  clientId: z.string().min(1, "Client requis"),
  vehicle: z.string().min(2, "Véhicule requis"),
  vehicleType: z.enum(["economique", "intermediaire", "luxe", "suv", "minibus"]),
  pickupDate: z.string().min(1, "Date de prise en charge requise"),
  returnDate: z.string().min(1, "Date de retour requise"),
  pickupLocation: z.string().min(2, "Lieu de prise en charge requis"),
  returnLocation: z.string().min(2, "Lieu de retour requis"),
  dailyRate: z.number().min(1, "Tarif journalier requis"),
  totalDays: z.number().min(1, "Durée requise"),
  totalPrice: z.number().min(1, "Prix total requis"),
  driverLicense: z.string().min(1, "Numéro de permis requis"),
  driverAge: z.number().min(18, "Âge minimum 18 ans"),
  insurance: z.enum(["basic", "comprehensive", "premium"]),
  status: z.enum(["active", "reserved", "completed", "cancelled"]),
  fuelPolicy: z.enum(["full_to_full", "full_to_empty", "prepaid"]),
  additionalDrivers: z.number().min(0).default(0),
  specialEquipment: z.string().optional(),
  notes: z.string().optional()
})

interface CarRentalFormProps {
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
  onSubmit: (data: z.infer<typeof carRentalSchema>) => Promise<{ success: boolean; message?: string }>
  defaultValues?: Partial<z.infer<typeof carRentalSchema>>
}

export function CarRentalForm({ isOpen, onOpenChange, onSubmit, defaultValues }: CarRentalFormProps) {
  const { clients, loading: clientsLoading } = useClients()
  
  // Filtrer les clients qui ont le secteur "voyage"
  const travelClients = clients.filter(client => 
    client.secteurs.includes('voyage')
  )
  
  return (
    <GMCSmartForm
      title="Nouvelle Location de Véhicule"
      description="Créer une nouvelle location de véhicule"
      icon={<Car className="h-5 w-5" />}
      schema={carRentalSchema}
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      isModal={true}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      submitLabel="Créer la Location"
    >
      {(form) => (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="clientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={
                          clientsLoading ? "Chargement..." :
                          travelClients.length === 0 ? "Aucun client voyage trouvé" :
                          "Sélectionner un client"
                        } />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {travelClients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.prenom} {client.nom} - {client.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="vehicle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Véhicule *</FormLabel>
                  <FormControl>
                    <Input placeholder="Toyota Corolla, Nissan Sentra..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="vehicleType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type de Véhicule *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="economique">Économique</SelectItem>
                      <SelectItem value="intermediaire">Intermédiaire</SelectItem>
                      <SelectItem value="luxe">Luxe</SelectItem>
                      <SelectItem value="suv">SUV</SelectItem>
                      <SelectItem value="minibus">Minibus</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Statut *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="reserved">Réservé</SelectItem>
                      <SelectItem value="active">En cours</SelectItem>
                      <SelectItem value="completed">Terminé</SelectItem>
                      <SelectItem value="cancelled">Annulé</SelectItem>
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
              name="pickupDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date de Prise en Charge *</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="returnDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date de Retour *</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="pickupLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lieu de Prise en Charge *</FormLabel>
                  <FormControl>
                    <Input placeholder="Aéroport LSS, Centre-ville..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="returnLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lieu de Retour *</FormLabel>
                  <FormControl>
                    <Input placeholder="Aéroport LSS, Centre-ville..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="dailyRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tarif/Jour (FCFA) *</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="25000" 
                      {...field}
                      onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="totalDays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Durée (jours) *</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="1" 
                      {...field}
                      onChange={e => field.onChange(parseInt(e.target.value) || 1)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="totalPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prix Total (FCFA) *</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="75000" 
                      {...field}
                      onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="driverLicense"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Numéro de Permis *</FormLabel>
                  <FormControl>
                    <Input placeholder="Numéro du permis de conduire" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="driverAge"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Âge du Conducteur *</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="18" 
                      placeholder="25" 
                      {...field}
                      onChange={e => field.onChange(parseInt(e.target.value) || 18)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="insurance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assurance *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="basic">Assurance de Base</SelectItem>
                      <SelectItem value="comprehensive">Assurance Complète</SelectItem>
                      <SelectItem value="premium">Assurance Premium</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fuelPolicy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Politique Carburant *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="full_to_full">Plein à Plein</SelectItem>
                      <SelectItem value="full_to_empty">Plein à Vide</SelectItem>
                      <SelectItem value="prepaid">Prépayé</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="additionalDrivers"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Conducteurs Additionnels</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0" 
                    placeholder="0" 
                    {...field}
                    onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="specialEquipment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Équipements Spéciaux</FormLabel>
                <FormControl>
                  <Input placeholder="GPS, siège bébé, chaînes..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Informations supplémentaires" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      )}
    </GMCSmartForm>
  )
}