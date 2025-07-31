import { z } from "zod"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { GMCSmartForm } from "./GMCSmartForm"
import { CreditCard } from "lucide-react"

const travelPaymentSchema = z.object({
  clientName: z.string().min(2, "Nom du client requis"),
  reservationId: z.string().min(1, "ID de réservation requis"),
  destination: z.string().min(2, "Destination requise"),
  amount: z.number().min(1, "Montant requis"),
  method: z.enum(["virement", "especes", "carte", "cheque", "mobile"]),
  status: z.enum(["completed", "partial", "pending"]),
  reference: z.string().optional(),
  notes: z.string().optional(),
  dueDate: z.string().optional()
})

interface TravelPaymentFormProps {
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
  onSubmit: (data: z.infer<typeof travelPaymentSchema>) => Promise<{ success: boolean; message?: string }>
  defaultValues?: Partial<z.infer<typeof travelPaymentSchema>>
}

export function TravelPaymentForm({ isOpen, onOpenChange, onSubmit, defaultValues }: TravelPaymentFormProps) {
  return (
    <GMCSmartForm
      title="Nouveau Paiement Voyage"
      description="Enregistrer un nouveau paiement voyage"
      icon={<CreditCard className="h-5 w-5" />}
      schema={travelPaymentSchema}
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      isModal={true}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      submitLabel="Enregistrer le Paiement"
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
              name="reservationId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID Réservation *</FormLabel>
                  <FormControl>
                    <Input placeholder="RES001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="destination"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Destination *</FormLabel>
                  <FormControl>
                    <Input placeholder="Paris, France" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Montant (FCFA) *</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="850000" 
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
              name="method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Méthode de Paiement *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="virement">Virement Bancaire</SelectItem>
                      <SelectItem value="especes">Espèces</SelectItem>
                      <SelectItem value="carte">Carte Bancaire</SelectItem>
                      <SelectItem value="cheque">Chèque</SelectItem>
                      <SelectItem value="mobile">Paiement Mobile</SelectItem>
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
                      <SelectItem value="completed">Payé Intégralement</SelectItem>
                      <SelectItem value="partial">Paiement Partiel</SelectItem>
                      <SelectItem value="pending">En Attente</SelectItem>
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
              name="reference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Référence</FormLabel>
                  <FormControl>
                    <Input placeholder="Numéro de transaction" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date d'Échéance</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Commentaires ou notes supplémentaires" 
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