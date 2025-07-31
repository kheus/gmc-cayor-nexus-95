import { Plus, Mail, Phone, RefreshCw, Users, Loader2, Eye, Info } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { useClients, type Client } from "@/hooks/useClients"
import { useDataSync } from "@/hooks/useDataSync"
import { GMCSmartForm } from "@/components/forms/GMCSmartForm"
import { GMCTextField, GMCSelectField, GMCDateField, FormGrid, FormSection } from "@/components/forms/GMCFormFields"
import { ClientDetailsDialog } from "@/components/clients/ClientDetailsDialog"
import { useToast } from "@/hooks/use-toast"
import { z } from "zod"

// Schéma de validation pour le formulaire client unifié
const clientSchema = z.object({
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  prenom: z.string().min(1, "Le prénom est requis"),
  email: z.string().email("Email invalide"),
  telephone: z.string().min(8, "Numéro de téléphone invalide"),
  adresse: z.string().min(5, "Adresse trop courte"),
  ville: z.string().optional().or(z.literal("")),
  secteurs: z.array(z.enum(["immobilier", "voyage", "assurance"])).min(1, "Au moins un secteur requis"),
  statut: z.enum(["actif", "inactif", "suspendu"]).default("actif"),
  // Champs optionnels
  profession: z.string().optional().or(z.literal("")),
  date_naissance: z.date().optional(),
  nationalite: z.string().optional().or(z.literal("")),
  type_voyageur: z.enum(["individuel", "groupe", "entreprise"]).optional(),
  numero_passeport: z.string().optional().or(z.literal("")),
  numero_permis: z.string().optional().or(z.literal("")),
  type_client: z.enum(["particulier", "entreprise"]).optional(),
  preferences: z.string().optional().or(z.literal(""))
})

type ClientFormData = z.infer<typeof clientSchema>

export default function Clients() {
  const { clients, loading, addClient } = useClients()
  const { syncAllData, lastSync, isStale } = useDataSync()
  const { toast } = useToast()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedClient, setSelectedClient] = useState<any>(null)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)

  const handleSubmit = async (data: ClientFormData) => {
    // Transformation des données pour correspondre au type Client unifié
    const clientData = {
      nom: data.nom,
      prenom: data.prenom,
      email: data.email,
      telephone: data.telephone,
      adresse: data.adresse,
      ville: data.ville || "",
      secteurs: data.secteurs,
      statut: data.statut,
      profession: data.profession || "",
      date_naissance: data.date_naissance?.toISOString().split('T')[0] || "",
      nationalite: data.nationalite || "",
      type_voyageur: data.type_voyageur,
      numero_passeport: data.numero_passeport || "",
      numero_permis: data.numero_permis || "",
      type_client: data.type_client,
      preferences: data.preferences || ""
    }
    return await addClient(clientData)
  }

  const handleViewClient = (client: any) => {
    setSelectedClient(client)
    setIsDetailsDialogOpen(true)
  }

  const handleStatusChange = async (clientId: string, newStatus: string) => {
    try {
      // Ici vous pouvez ajouter la mise à jour en base de données
      console.log(`Mise à jour du statut du client ${clientId} vers ${newStatus}`)
      
      toast({
        title: "Statut mis à jour",
        description: `Le statut du client a été changé en "${newStatus}"`
      })
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error)
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le statut"
      })
    }
  }

  // Filtrage des clients
  const filteredClients = clients.filter(client => {
    const search = searchTerm.toLowerCase()
    return (
      client.nom?.toLowerCase().includes(search) ||
      client.prenom?.toLowerCase().includes(search) ||
      client.email?.toLowerCase().includes(search) ||
      client.telephone?.toLowerCase().includes(search)
    )
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Chargement des clients...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 p-3 sm:p-4">
      {/* Header mobile-first */}
      <div className="gmc-card-header-mobile">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-primary">Gestion des Clients</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">Gestion de votre base clients</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={syncAllData}
            className="text-xs"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            <span className="hidden sm:inline">Sync</span>
          </Button>
          {isStale && (
            <Badge variant="destructive" className="text-xs">
              <span className="hidden sm:inline">Données anciennes</span>
              <span className="sm:hidden">Ancien</span>
            </Badge>
          )}
        </div>
      </div>

      {/* Barre de recherche et bouton d'ajout */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="space-y-1 flex-1">
          <Label htmlFor="search" className="text-sm">Rechercher</Label>
          <Input
            id="search"
            placeholder="Nom, email, téléphone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full gmc-input-focus text-sm"
          />
        </div>

        <div className="flex items-end">
          <Button 
            size="sm" 
            className="gmc-button-primary w-full sm:w-auto"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            <span className="sm:hidden">Ajouter</span>
            <span className="hidden sm:inline">Nouveau Client</span>
          </Button>
        </div>
      </div>

      {/* Formulaire modal optimisé */}
      <GMCSmartForm<ClientFormData>
        title="Ajouter un nouveau client"
        description="Créer une fiche client dans la base de données"
        icon={<Users className="h-5 w-5" />}
        schema={clientSchema}
        defaultValues={{
          nom: "",
          prenom: "",
          email: "",
          telephone: "",
          adresse: "",
          ville: "",
          secteurs: ["immobilier"],
          statut: "actif",
          profession: "",
          nationalite: "",
          numero_passeport: "",
          numero_permis: "",
          preferences: ""
        }}
        onSubmit={handleSubmit}
        isModal={true}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        submitLabel="Enregistrer le client"
      >
        {(form) => (
          <>
            <FormSection title="Informations personnelles" icon={<Users className="h-4 w-4" />}>
              <FormGrid cols={2}>
                <GMCTextField
                  form={form}
                  name="nom"
                  label="Nom"
                  placeholder="Nom de famille"
                  required
                />
                <GMCTextField
                  form={form}
                  name="prenom"
                  label="Prénom"
                  placeholder="Prénom"
                  required
                />
              </FormGrid>

              <FormGrid cols={2}>
                <GMCTextField
                  form={form}
                  name="email"
                  label="Email"
                  type="email"
                  placeholder="email@exemple.com"
                  required
                />
                <GMCTextField
                  form={form}
                  name="telephone"
                  label="Téléphone"
                  type="tel"
                  placeholder="77 123 45 67"
                  required
                />
              </FormGrid>

              <GMCTextField
                form={form}
                name="adresse"
                label="Adresse"
                placeholder="Adresse complète"
                required
              />

              <FormGrid cols={2}>
                <GMCTextField
                  form={form}
                  name="ville"
                  label="Ville"
                  placeholder="Ville"
                />
                <GMCTextField
                  form={form}
                  name="nationalite"
                  label="Nationalité"
                  placeholder="Nationalité"
                />
              </FormGrid>

              <FormGrid cols={2}>
                <GMCDateField
                  form={form}
                  name="date_naissance"
                  label="Date de naissance"
                  placeholder="Sélectionner la date"
                  maxDate={new Date()}
                />
                <GMCSelectField
                  form={form}
                  name="statut"
                  label="Statut"
                  placeholder="Sélectionner un statut"
                  options={[
                    { value: "actif", label: "Actif" },
                    { value: "inactif", label: "Inactif" },
                    { value: "suspendu", label: "Suspendu" }
                  ]}
                  required
                />
              </FormGrid>
            </FormSection>

            <FormSection title="Secteurs d'activité" icon={<Users className="h-4 w-4" />}>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Secteurs (sélectionnez un ou plusieurs) *</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {(['immobilier', 'voyage', 'assurance'] as const).map((secteur) => (
                      <Button
                        key={secteur}
                        type="button"
                        variant={form.watch('secteurs')?.includes(secteur) ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          const currentSecteurs = form.getValues('secteurs') || []
                          if (currentSecteurs.includes(secteur)) {
                            form.setValue('secteurs', currentSecteurs.filter(s => s !== secteur))
                          } else {
                            form.setValue('secteurs', [...currentSecteurs, secteur])
                          }
                        }}
                        className="capitalize"
                      >
                        {secteur}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Champs conditionnels selon les secteurs sélectionnés */}
                {form.watch('secteurs')?.includes('immobilier') && (
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium text-sm mb-3">Informations Immobilier</h4>
                    <GMCTextField
                      form={form}
                      name="profession"
                      label="Profession"
                      placeholder="Profession"
                    />
                  </div>
                )}

                {form.watch('secteurs')?.includes('voyage') && (
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium text-sm mb-3">Informations Voyage</h4>
                    <FormGrid cols={2}>
                      <GMCSelectField
                        form={form}
                        name="type_voyageur"
                        label="Type de voyageur"
                        placeholder="Sélectionner le type"
                        options={[
                          { value: "individuel", label: "Individuel" },
                          { value: "groupe", label: "Groupe" },
                          { value: "entreprise", label: "Entreprise" }
                        ]}
                      />
                      <GMCTextField
                        form={form}
                        name="numero_passeport"
                        label="Numéro de passeport"
                        placeholder="Numéro de passeport"
                      />
                    </FormGrid>
                  </div>
                )}

                {form.watch('secteurs')?.includes('assurance') && (
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium text-sm mb-3">Informations Assurance</h4>
                    <FormGrid cols={2}>
                      <GMCSelectField
                        form={form}
                        name="type_client"
                        label="Type de client"
                        placeholder="Sélectionner le type"
                        options={[
                          { value: "particulier", label: "Particulier" },
                          { value: "entreprise", label: "Entreprise" }
                        ]}
                      />
                      <GMCTextField
                        form={form}
                        name="numero_permis"
                        label="Numéro de permis de conduire"
                        placeholder="Numéro de permis"
                      />
                    </FormGrid>
                  </div>
                )}

                <GMCTextField
                  form={form}
                  name="preferences"
                  label="Préférences et notes"
                  placeholder="Notes, préférences, remarques..."
                />
              </div>
            </FormSection>
          </>
        )}
      </GMCSmartForm>

      {/* Liste des clients avec design mobile-first */}
      <Card className="gmc-card-elevated">
        <CardHeader className="pb-3">
          <div className="gmc-card-header-mobile">
            <div>
              <CardTitle className="text-lg sm:text-xl">Liste des Clients</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                {filteredClients.length} client(s) {searchTerm && `trouvé(s) sur ${clients.length}`}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filteredClients.length === 0 ? (
            <div className="text-center py-8 px-4">
              {searchTerm ? (
                <>
                  <p className="text-muted-foreground">Aucun client trouvé</p>
                  <p className="text-sm text-muted-foreground">Essayez avec d'autres mots-clés</p>
                </>
              ) : (
                <>
                  <p className="text-muted-foreground">Aucun client enregistré</p>
                  <p className="text-sm text-muted-foreground">Ajoutez votre premier client pour commencer</p>
                </>
              )}
            </div>
          ) : (
            <>
              {/* Vue desktop - tableau */}
              <div className="hidden md:block gmc-table-container border-0 rounded-none">
                <Table className="gmc-table-mobile">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="gmc-table-cell">Nom</TableHead>
                      <TableHead className="gmc-table-cell">Email</TableHead>
                      <TableHead className="gmc-table-cell">Téléphone</TableHead>
                      <TableHead className="gmc-table-cell">Secteurs</TableHead>
                      <TableHead className="gmc-table-cell">Statut</TableHead>
                      <TableHead className="gmc-table-cell">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClients.map((client) => (
                      <TableRow key={client.id} className="hover:bg-muted/50">
                        <TableCell className="gmc-table-cell font-medium">
                          {client.nom} {client.prenom}
                        </TableCell>
                        <TableCell className="gmc-table-cell">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <span className="truncate">{client.email}</span>
                          </div>
                        </TableCell>
                        <TableCell className="gmc-table-cell">
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            {client.telephone}
                          </div>
                        </TableCell>
                        <TableCell className="gmc-table-cell">
                          <div className="flex flex-wrap gap-1">
                            {client.secteurs?.map((secteur) => (
                              <Badge key={secteur} variant="outline" className="text-xs px-1 py-0 capitalize">
                                {secteur}
                              </Badge>
                            )) || <span className="text-muted-foreground text-xs">Aucun</span>}
                          </div>
                        </TableCell>
                        <TableCell className="gmc-table-cell">
                          <Badge 
                            variant={client.statut === 'actif' || !client.statut ? "default" : 
                                    client.statut === 'inactif' ? "secondary" : "destructive"}
                            className="text-xs px-2 py-0.5"
                          >
                            {client.statut || 'actif'}
                          </Badge>
                        </TableCell>
                        <TableCell className="gmc-table-cell">
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewClient(client)}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              Voir
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewClient(client)}
                            >
                              <Info className="h-3 w-3 mr-1" />
                              Détails
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Vue mobile - cartes */}
              <div className="md:hidden space-y-3 p-4">
                {filteredClients.map((client) => (
                  <Card key={client.id} className="gmc-card-mobile">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm truncate">
                          {client.nom} {client.prenom}
                        </h3>
                        <div className="space-y-1 mt-2">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Mail className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">{client.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Phone className="h-3 w-3 flex-shrink-0" />
                            <span>{client.telephone}</span>
                          </div>
                          {client.ville && (
                            <div className="text-xs text-muted-foreground">
                              📍 {client.ville}
                            </div>
                          )}
                          <div className="flex flex-wrap gap-1 mt-1">
                            {client.secteurs?.map((secteur) => (
                              <Badge key={secteur} variant="outline" className="text-xs px-1 py-0 capitalize">
                                {secteur}
                              </Badge>
                            )) || null}
                          </div>
                        </div>
                      </div>
                      <Badge 
                        variant={client.statut === 'actif' || !client.statut ? "default" : 
                                client.statut === 'inactif' ? "secondary" : "destructive"}
                        className="text-xs px-2 py-1 ml-2 flex-shrink-0"
                      >
                        {client.statut || 'actif'}
                      </Badge>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Dialog des détails */}
      <ClientDetailsDialog
        client={selectedClient}
        isOpen={isDetailsDialogOpen}
        onOpenChange={setIsDetailsDialogOpen}
        onStatusChange={handleStatusChange}
      />
    </div>
  )
}