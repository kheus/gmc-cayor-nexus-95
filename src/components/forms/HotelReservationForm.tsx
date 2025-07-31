import { z } from "zod"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { GMCSmartForm } from "./GMCSmartForm"
import { Hotel } from "lucide-react"

const hotelReservationSchema = z.object({
  clientName: z.string().min(2, "Nom du client requis"),
  hotel: z.string().min(2, "Nom de l'hôtel requis"),
  destination: z.string().min(2, "Destination requise"),
  checkIn: z.string().min(1, "Date d'arrivée requise"),
  checkOut: z.string().min(1, "Date de départ requise"),
  rooms: z.number().min(1, "Au moins 1 chambre"),
  guests: z.number().min(1, "Au moins 1 invité"),
  roomType: z.enum(["simple", "double", "suite", "deluxe"]),
  pricePerNight: z.number().min(1, "Prix par nuit requis"),
  totalPrice: z.number().min(1, "Prix total requis"),
  board: z.enum(["room_only", "breakfast", "half_board", "full_board"]),
  status: z.enum(["confirmed", "pending", "cancelled"]),
  specialRequests: z.string().optional(),
  paymentStatus: z.enum(["paid", "partial", "pending"]),
  confirmationNumber: z.string().optional()
})

interface HotelReservationFormProps {
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
  onSubmit: (data: z.infer<typeof hotelReservationSchema>) => Promise<{ success: boolean; message?: string }>
  defaultValues?: Partial<z.infer<typeof hotelReservationSchema>>
}

export function HotelReservationForm({ isOpen, onOpenChange, onSubmit, defaultValues }: HotelReservationFormProps) {
  return (
    <GMCSmartForm
      title="Nouvelle Réservation Hôtel"
      description="Créer une nouvelle réservation hôtelière"
      icon={<Hotel className="h-5 w-5" />}
      schema={hotelReservationSchema}
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      isModal={true}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      submitLabel="Créer la Réservation"
    >
      {(form) => (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="clientName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom du Client *</FormLabel>
                  <FormControl>
                    <Input placeholder="Nom complet du client" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hotel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hôtel *</FormLabel>
                  <FormControl>
                    <Input placeholder="Nom de l'hôtel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="destination"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Destination *</FormLabel>
                <FormControl>
                  <Input placeholder="Ville, Pays" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="checkIn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date d'Arrivée *</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="checkOut"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date de Départ *</FormLabel>
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
              name="rooms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de Chambres *</FormLabel>
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
              name="guests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre d'Invités *</FormLabel>
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="roomType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type de Chambre *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="simple">Chambre Simple</SelectItem>
                      <SelectItem value="double">Chambre Double</SelectItem>
                      <SelectItem value="suite">Suite</SelectItem>
                      <SelectItem value="deluxe">Chambre Deluxe</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="board"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Formule *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="room_only">Chambre Seule</SelectItem>
                      <SelectItem value="breakfast">Petit Déjeuner</SelectItem>
                      <SelectItem value="half_board">Demi-Pension</SelectItem>
                      <SelectItem value="full_board">Pension Complète</SelectItem>
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
              name="pricePerNight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prix par Nuit (FCFA) *</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="60000" 
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
              name="totalPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prix Total (FCFA) *</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="180000" 
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
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Statut Réservation *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="confirmed">Confirmée</SelectItem>
                      <SelectItem value="pending">En Attente</SelectItem>
                      <SelectItem value="cancelled">Annulée</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="paymentStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Statut Paiement *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="paid">Payé</SelectItem>
                      <SelectItem value="partial">Partiel</SelectItem>
                      <SelectItem value="pending">En Attente</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="confirmationNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Numéro de Confirmation</FormLabel>
                <FormControl>
                  <Input placeholder="HTL-2024-001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="specialRequests"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Demandes Spéciales</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Lit bébé, étage élevé, vue mer, etc." 
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