import { useState } from "react"
import { Calculator, FileText, TrendingUp, Euro, Car, Home, Plus, Edit2, Trash2, Building2, Plane, Shield } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useGMCData } from "@/hooks/useGMCData"

// Types d'interfaces
interface AutoInsuranceTariff {
  id: number
  vehicle_category: string
  insured_value?: string
  rc_simple: number | string
  rc_vol: number | string
  rc_vol_incendie: number | string
  tous_risques: number | string
}

interface HomeInsuranceTariff {
  id: number
  property_type: string
  insured_value: string
  annual_premium: number | string
}

// Import du type depuis le fichier de types GMC
import type { AccountingEntry } from "@/types/gmc"

// Données de tarification automobile
const autoTariffs: AutoInsuranceTariff[] = [
  {
    id: 1,
    vehicle_category: "Moto",
    rc_simple: 15000,
    rc_vol: 20000,
    rc_vol_incendie: 25000,
    tous_risques: "Non disponible"
  },
  {
    id: 2,
    vehicle_category: "Véhicule < 5CV",
    insured_value: "Jusqu'à 5 000 000 F",
    rc_simple: 50000,
    rc_vol: 80000,
    rc_vol_incendie: 90000,
    tous_risques: 120000
  },
  {
    id: 3,
    vehicle_category: "Véhicule 5 à 9CV",
    insured_value: "Jusqu'à 10 000 000 F",
    rc_simple: 75000,
    rc_vol: 90000,
    rc_vol_incendie: 105000,
    tous_risques: 130000
  },
  {
    id: 4,
    vehicle_category: "Véhicule > 9CV (luxe)",
    insured_value: "Jusqu'à 15 000 000 F",
    rc_simple: 100000,
    rc_vol: 120000,
    rc_vol_incendie: 150000,
    tous_risques: 200000
  },
  {
    id: 5,
    vehicle_category: "Véhicule utilitaire",
    insured_value: "Selon valeur",
    rc_simple: "Sur devis",
    rc_vol: "Sur devis",
    rc_vol_incendie: "Sur devis",
    tous_risques: "Sur devis"
  }
]

// Données de tarification habitation
const homeTariffs: HomeInsuranceTariff[] = [
  {
    id: 1,
    property_type: "Appartement / Maison",
    insured_value: "5 000 000 F",
    annual_premium: 40000
  },
  {
    id: 2,
    property_type: "Biens pour personnel / Bureau",
    insured_value: "10 000 000 F",
    annual_premium: 80000
  },
  {
    id: 3,
    property_type: "Banque / Pharmacie / Marchandises",
    insured_value: "> 10 000 000 F",
    annual_premium: "Sur devis"
  }
]

export default function Accounting() {
  const { toast } = useToast()
  const { accountingEntries, financialSummary, getTotalRevenue, getTotalExpenses, getTotalProfit } = useGMCData()
  
  // Utilisation des vraies données GMC consolidées
  const totalRecettes = getTotalRevenue()
  const totalDepenses = getTotalExpenses()
  const benefice = getTotalProfit()
  
  // État pour les nouvelles écritures manuelles
  const [isAddingEntry, setIsAddingEntry] = useState(false)
  const [manualEntries, setManualEntries] = useState<AccountingEntry[]>([])
  const [newEntry, setNewEntry] = useState({
    description: "",
    type: "recette" as "recette" | "depense",
    category: "",
    secteur: "general" as "immobilier" | "voyage" | "assurance" | "general",
    amount: "",
    date: new Date().toISOString().split('T')[0]
  })

  // Combinaison des écritures automatiques et manuelles
  const allEntries = [...accountingEntries, ...manualEntries]

  // Générer automatiquement la référence
  const generateReference = (type: "recette" | "depense") => {
    const prefix = type === "recette" ? "REC" : "DEP"
    const existingRefs = allEntries
      .filter(entry => entry.reference?.startsWith(prefix))
      .map(entry => parseInt(entry.reference!.slice(3)))
    const nextNumber = Math.max(...existingRefs, 0) + 1
    return `${prefix}${nextNumber.toString().padStart(3, '0')}`
  }

  const handleAddEntry = () => {
    if (!newEntry.description || !newEntry.category || !newEntry.amount) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      })
      return
    }

    const entry: AccountingEntry = {
      id: `manual_${Date.now()}`,
      date: newEntry.date,
      description: newEntry.description,
      type: newEntry.type,
      category: newEntry.category,
      secteur: newEntry.secteur,
      amount: parseFloat(newEntry.amount),
      reference: generateReference(newEntry.type),
      source_type: 'manual',
      created_at: new Date().toISOString()
    }

    setManualEntries([...manualEntries, entry])
    setNewEntry({
      description: "",
      type: "recette",
      category: "",
      secteur: "general",
      amount: "",
      date: new Date().toISOString().split('T')[0]
    })
    setIsAddingEntry(false)
    
    toast({
      title: "Succès",
      description: "Écriture comptable ajoutée avec succès"
    })
  }

  // Calculs basés sur les vraies données GMC

  const formatValue = (value: number | string) => {
    if (typeof value === "string") return value
    return value.toLocaleString() + " F"
  }

  const isOnQuote = (value: number | string) => {
    return typeof value === "string" && value.includes("Sur devis")
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-primary">Comptabilité GMC & Tarification</h1>
        <p className="text-muted-foreground">Gestion comptable consolidée (Immobilier + Voyage + Assurance) et tableaux de tarification</p>
      </div>

      {/* Statistiques principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recettes Totales</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{totalRecettes.toLocaleString()} CFA</div>
            <p className="text-xs text-muted-foreground">Revenus encaissés</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dépenses Totales</CardTitle>
            <Euro className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{totalDepenses.toLocaleString()} CFA</div>
            <p className="text-xs text-muted-foreground">Charges payées</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Résultat Net</CardTitle>
            <Calculator className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${benefice >= 0 ? 'text-success' : 'text-destructive'}`}>
              {benefice.toLocaleString()} CFA
            </div>
            <p className="text-xs text-muted-foreground">Recettes - Dépenses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Écritures</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allEntries.length}</div>
            <p className="text-xs text-muted-foreground">Auto + manuelles</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="accounting" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="accounting">Comptabilité</TabsTrigger>
          <TabsTrigger value="auto-tariffs">Tarifs Auto</TabsTrigger>
          <TabsTrigger value="home-tariffs">Tarifs Habitation</TabsTrigger>
        </TabsList>

        {/* Section Comptabilité */}
        <TabsContent value="accounting" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Journal Comptable</h2>
            <Dialog open={isAddingEntry} onOpenChange={setIsAddingEntry}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nouvelle Écriture
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Ajouter une écriture comptable</DialogTitle>
                  <DialogDescription>
                    Enregistrez une nouvelle opération financière
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={newEntry.date}
                      onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Type d'opération</Label>
                    <Select value={newEntry.type} onValueChange={(value: "recette" | "depense") => setNewEntry({ ...newEntry, type: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="recette">Recette</SelectItem>
                        <SelectItem value="depense">Dépense</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="secteur">Secteur</Label>
                    <Select value={newEntry.secteur} onValueChange={(value: "immobilier" | "voyage" | "assurance" | "general") => setNewEntry({ ...newEntry, secteur: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">Général</SelectItem>
                        <SelectItem value="immobilier">Immobilier</SelectItem>
                        <SelectItem value="voyage">Voyage</SelectItem>
                        <SelectItem value="assurance">Assurance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Catégorie</Label>
                    <Select value={newEntry.category} onValueChange={(value) => setNewEntry({ ...newEntry, category: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        {newEntry.type === "recette" ? (
                          <>
                            <SelectItem value="Loyers">Loyers</SelectItem>
                            <SelectItem value="Voyage">Voyage</SelectItem>
                            <SelectItem value="Assurances">Assurances</SelectItem>
                            <SelectItem value="Commissions">Commissions</SelectItem>
                            <SelectItem value="Autres recettes">Autres recettes</SelectItem>
                          </>
                        ) : (
                          <>
                            <SelectItem value="Maintenance">Maintenance</SelectItem>
                            <SelectItem value="Charges Voyage">Charges Voyage</SelectItem>
                            <SelectItem value="Assurances">Assurances</SelectItem>
                            <SelectItem value="Administratif">Administratif</SelectItem>
                            <SelectItem value="Taxes">Taxes</SelectItem>
                            <SelectItem value="Autres dépenses">Autres dépenses</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      placeholder="Description de l'opération"
                      value={newEntry.description}
                      onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount">Montant (CFA)</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0"
                      value={newEntry.amount}
                      onChange={(e) => setNewEntry({ ...newEntry, amount: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAddingEntry(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleAddEntry}>
                    Enregistrer
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Journal Comptable GMC</CardTitle>
              <CardDescription>
                Écritures automatiques (voyage, immobilier) et manuelles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Référence</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Secteur</TableHead>
                      <TableHead>Catégorie</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Montant</TableHead>
                      <TableHead>Source</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allEntries.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell className="font-medium">{entry.reference}</TableCell>
                        <TableCell>{new Date(entry.date).toLocaleDateString()}</TableCell>
                        <TableCell>{entry.description}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={
                            entry.secteur === 'immobilier' ? 'border-blue-200 text-blue-700' :
                            entry.secteur === 'voyage' ? 'border-green-200 text-green-700' :
                            entry.secteur === 'assurance' ? 'border-purple-200 text-purple-700' :
                            'border-gray-200 text-gray-700'
                          }>
                            {entry.secteur === 'immobilier' && <Building2 className="h-3 w-3 mr-1" />}
                            {entry.secteur === 'voyage' && <Plane className="h-3 w-3 mr-1" />}
                            {entry.secteur === 'assurance' && <Shield className="h-3 w-3 mr-1" />}
                            {entry.secteur}
                          </Badge>
                        </TableCell>
                        <TableCell>{entry.category}</TableCell>
                        <TableCell>
                          <Badge 
                            className={entry.type === "recette" 
                              ? "bg-success/20 text-success border-success/30" 
                              : "bg-destructive/20 text-destructive border-destructive/30"
                            }
                          >
                            {entry.type === "recette" ? "Recette" : "Dépense"}
                          </Badge>
                        </TableCell>
                        <TableCell className={`text-right font-medium ${entry.type === "recette" ? "text-success" : "text-destructive"}`}>
                          {entry.type === "recette" ? "+" : "-"}{entry.amount.toLocaleString()} CFA
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-xs">
                            {entry.source_type === 'travel_payment' ? 'Auto Voyage' :
                             entry.source_type === 'property_payment' ? 'Auto Immo' : 'Manuel'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Section Tarifs Automobile */}
        <TabsContent value="auto-tariffs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5" />
                Tarification Assurance Automobile
              </CardTitle>
              <CardDescription>
                Responsabilité civile et garanties complémentaires
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Catégorie de véhicule</TableHead>
                      <TableHead>Valeur assurée</TableHead>
                      <TableHead>RC Simple</TableHead>
                      <TableHead>RC + Vol</TableHead>
                      <TableHead>RC + Vol + Incendie</TableHead>
                      <TableHead>Tous Risques</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {autoTariffs.map((tariff) => (
                      <TableRow key={tariff.id}>
                        <TableCell className="font-medium">{tariff.vehicle_category}</TableCell>
                        <TableCell>{tariff.insured_value || "—"}</TableCell>
                        <TableCell className={isOnQuote(tariff.rc_simple) ? "text-orange-600 font-medium" : ""}>
                          {formatValue(tariff.rc_simple)}
                        </TableCell>
                        <TableCell className={isOnQuote(tariff.rc_vol) ? "text-orange-600 font-medium" : ""}>
                          {formatValue(tariff.rc_vol)}
                        </TableCell>
                        <TableCell className={isOnQuote(tariff.rc_vol_incendie) ? "text-orange-600 font-medium" : ""}>
                          {formatValue(tariff.rc_vol_incendie)}
                        </TableCell>
                        <TableCell className={isOnQuote(tariff.tous_risques) ? "text-orange-600 font-medium" : ""}>
                          {formatValue(tariff.tous_risques)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-sm text-orange-800">
                  <strong>Note :</strong> Les tarifs "Sur devis" nécessitent une évaluation personnalisée. 
                  Contactez notre équipe pour un devis sur mesure.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Section Tarifs Habitation */}
        <TabsContent value="home-tariffs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Tarification Assurance Habitation/Incendie
              </CardTitle>
              <CardDescription>
                Couverture des biens immobiliers et mobiliers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type de bien</TableHead>
                      <TableHead>Valeur assurée</TableHead>
                      <TableHead>Prime annuelle</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {homeTariffs.map((tariff) => (
                      <TableRow key={tariff.id}>
                        <TableCell className="font-medium">{tariff.property_type}</TableCell>
                        <TableCell>{tariff.insured_value}</TableCell>
                        <TableCell className={isOnQuote(tariff.annual_premium) ? "text-orange-600 font-medium" : ""}>
                          {formatValue(tariff.annual_premium)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Couvertures incluses :</strong> Incendie, dégâts des eaux, vol, 
                  responsabilité civile, bris de glace, catastrophes naturelles.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}