import { z } from "zod"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { GMCSmartForm } from "./GMCSmartForm"
import { Users } from "lucide-react"

const travelClientSchema = z.object({
  nom: z.string().min(2, "Le nom doit faire au moins 2 caractères"),
  prenom: z.string().min(2, "Le prénom doit faire au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  telephone: z.string().min(9, "Numéro de téléphone invalide"),
  adresse: z.string().min(5, "Adresse trop courte"),
  ville: z.string().optional(),
  profession: z.string().optional(),
  dateNaissance: z.string().optional(),
  nationalite: z.string().min(2, "Nationalité requise"),
  numeroPasseport: z.string().optional(),
  typeVoyageur: z.enum(["individuel", "groupe", "entreprise"]),
  preferences: z.string().optional(),
  contactUrgence: z.string().optional()
})

interface TravelClientFormProps {
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
  onSubmit: (data: z.infer<typeof travelClientSchema>) => Promise<{ success: boolean; message?: string }>
  defaultValues?: Partial<z.infer<typeof travelClientSchema>>
}

export function TravelClientForm({ isOpen, onOpenChange, onSubmit, defaultValues }: TravelClientFormProps) {
  return (
    <GMCSmartForm
      title="Nouveau Client Voyage"
      description="Ajouter un nouveau client à la base voyage GMC"
      icon={<Users className="h-5 w-5" />}
      schema={travelClientSchema}
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      isModal={true}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      submitLabel="Créer le Client"
    >
      {(form) => (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="nom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom *</FormLabel>
                  <FormControl>
                    <Input placeholder="Nom de famille" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="prenom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prénom *</FormLabel>
                  <FormControl>
                    <Input placeholder="Prénom" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="email@example.com" {...field} />
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
                  <FormLabel>Téléphone *</FormLabel>
                  <FormControl>
                    <Input placeholder="77 123 45 67" {...field} />
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
                <FormLabel>Adresse *</FormLabel>
                <FormControl>
                  <Textarea placeholder="Adresse complète" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="ville"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ville</FormLabel>
                  <FormControl>
                    <Input placeholder="Dakar" {...field} />
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
                  <FormLabel>Nationalité *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="senegalaise">Sénégalaise</SelectItem>
                      <SelectItem value="malienne">Malienne</SelectItem>
                      <SelectItem value="ivoirienne">Ivoirienne</SelectItem>
                      <SelectItem value="francaise">Française</SelectItem>
                      <SelectItem value="autre">Autre</SelectItem>
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
              name="profession"
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
              name="dateNaissance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date de Naissance</FormLabel>
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
              name="numeroPasseport"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Numéro Passeport</FormLabel>
                  <FormControl>
                    <Input placeholder="Numéro de passeport" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="typeVoyageur"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type de Voyageur *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="individuel">Individuel</SelectItem>
                      <SelectItem value="groupe">Groupe</SelectItem>
                      <SelectItem value="entreprise">Entreprise</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="preferences"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Préférences de Voyage</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Préférences alimentaires, type d'hébergement, etc." 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contactUrgence"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact d'Urgence</FormLabel>
                <FormControl>
                  <Input placeholder="Nom et téléphone du contact d'urgence" {...field} />
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