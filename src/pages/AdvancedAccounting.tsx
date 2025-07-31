import { useState } from "react"
import { Calculator, FileText, TrendingUp, Download, Upload, CreditCard, Building, AlertCircle, Plus, CheckCircle, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"

interface TVAEntry {
  id: number
  date: string
  description: string
  ht_amount: number
  tva_rate: number
  tva_amount: number
  ttc_amount: number
  type: "collectee" | "deductible"
  reference: string
}

interface BankTransaction {
  id: number
  date: string
  description: string
  amount: number
  balance: number
  type: "debit" | "credit"
  reconciled: boolean
  reference?: string
}

interface FiscalReport {
  id: number
  type: "tva" | "impot_societe" | "contribution_fonciere"
  period: string
  status: "draft" | "submitted" | "validated"
  amount: number
  due_date: string
}

export default function AdvancedAccounting() {
  const { toast } = useToast()
  
  const [tvaEntries, setTvaEntries] = useState<TVAEntry[]>([
    {
      id: 1,
      date: "2024-11-15",
      description: "Facture loyer - PROP001",
      ht_amount: 381356,
      tva_rate: 18,
      tva_amount: 68644,
      ttc_amount: 450000,
      type: "collectee",
      reference: "FAC001"
    },
    {
      id: 2,
      date: "2024-11-14",
      description: "Achat matériel maintenance",
      ht_amount: 63559,
      tva_rate: 18,
      tva_amount: 11441,
      ttc_amount: 75000,
      type: "deductible",
      reference: "ACH001"
    }
  ])

  const [bankTransactions, setBankTransactions] = useState<BankTransaction[]>([
    {
      id: 1,
      date: "2024-11-15",
      description: "Virement loyer - PROP001",
      amount: 450000,
      balance: 2450000,
      type: "credit",
      reconciled: true,
      reference: "VIR001"
    },
    {
      id: 2,
      date: "2024-11-14",
      description: "Paiement fournisseur maintenance",
      amount: -75000,
      balance: 2000000,
      type: "debit",
      reconciled: false
    },
    {
      id: 3,
      date: "2024-11-13",
      description: "Virement client assurance",
      amount: 850000,
      balance: 2075000,
      type: "credit",
      reconciled: true,
      reference: "VIR002"
    }
  ])

  const [fiscalReports, setFiscalReports] = useState<FiscalReport[]>([
    {
      id: 1,
      type: "tva",
      period: "Novembre 2024",
      status: "draft",
      amount: 57203,
      due_date: "2024-12-15"
    },
    {
      id: 2,
      type: "impot_societe",
      period: "Exercice 2024",
      status: "submitted",
      amount: 2500000,
      due_date: "2025-03-31"
    },
    {
      id: 3,
      type: "contribution_fonciere",
      period: "2024",
      status: "validated",
      amount: 180000,
      due_date: "2024-12-31"
    }
  ])

  const [isAddingTVA, setIsAddingTVA] = useState(false)
  const [newTVAEntry, setNewTVAEntry] = useState({
    description: "",
    ht_amount: "",
    tva_rate: "18",
    type: "collectee" as "collectee" | "deductible",
    date: new Date().toISOString().split('T')[0]
  })

  // Calculs TVA
  const tvaCollectee = tvaEntries
    .filter(entry => entry.type === "collectee")
    .reduce((sum, entry) => sum + entry.tva_amount, 0)

  const tvaDeductible = tvaEntries
    .filter(entry => entry.type === "deductible")
    .reduce((sum, entry) => sum + entry.tva_amount, 0)

  const tvaAVerser = tvaCollectee - tvaDeductible

  // Statistiques bancaires
  const currentBalance = bankTransactions.length > 0 ? bankTransactions[0].balance : 0
  const reconciledCount = bankTransactions.filter(t => t.reconciled).length
  const reconciliationRate = (reconciledCount / bankTransactions.length) * 100

  const handleAddTVAEntry = () => {
    if (!newTVAEntry.description || !newTVAEntry.ht_amount) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      })
      return
    }

    const htAmount = parseFloat(newTVAEntry.ht_amount)
    const tvaRate = parseFloat(newTVAEntry.tva_rate)
    const tvaAmount = (htAmount * tvaRate) / 100
    const ttcAmount = htAmount + tvaAmount

    const entry: TVAEntry = {
      id: Math.max(...tvaEntries.map(e => e.id), 0) + 1,
      date: newTVAEntry.date,
      description: newTVAEntry.description,
      ht_amount: htAmount,
      tva_rate: tvaRate,
      tva_amount: tvaAmount,
      ttc_amount: ttcAmount,
      type: newTVAEntry.type,
      reference: `${newTVAEntry.type === "collectee" ? "FAC" : "ACH"}${(tvaEntries.length + 1).toString().padStart(3, '0')}`
    }

    setTvaEntries([...tvaEntries, entry])
    setNewTVAEntry({
      description: "",
      ht_amount: "",
      tva_rate: "18",
      type: "collectee",
      date: new Date().toISOString().split('T')[0]
    })
    setIsAddingTVA(false)
    
    toast({
      title: "Succès",
      description: "Écriture TVA ajoutée avec succès"
    })
  }

  const toggleReconciliation = (id: number) => {
    setBankTransactions(prev => 
      prev.map(transaction => 
        transaction.id === id 
          ? { ...transaction, reconciled: !transaction.reconciled }
          : transaction
      )
    )
  }

  const generateFiscalReport = (type: string) => {
    toast({
      title: "Rapport généré",
      description: `Le rapport ${type} a été généré avec succès`
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "validated":
        return <Badge className="bg-success/20 text-success border-success/30">Validé</Badge>
      case "submitted":
        return <Badge className="bg-warning/20 text-warning border-warning/30">Soumis</Badge>
      case "draft":
        return <Badge variant="outline">Brouillon</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getReportTypeLabel = (type: string) => {
    switch (type) {
      case "tva":
        return "Déclaration TVA"
      case "impot_societe":
        return "Impôt sur les Sociétés"
      case "contribution_fonciere":
        return "Contribution Foncière"
      default:
        return type
    }
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-primary">Comptabilité Avancée</h1>
        <p className="text-muted-foreground">Gestion TVA, rapports fiscaux et réconciliation bancaire</p>
      </div>

      {/* Tableau de bord principal */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">TVA à Verser</CardTitle>
            <Calculator className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${tvaAVerser >= 0 ? 'text-primary' : 'text-success'}`}>
              {tvaAVerser.toLocaleString()} CFA
            </div>
            <p className="text-xs text-muted-foreground">
              Collectée: {tvaCollectee.toLocaleString()} - Déductible: {tvaDeductible.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Solde Bancaire</CardTitle>
            <CreditCard className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{currentBalance.toLocaleString()} CFA</div>
            <p className="text-xs text-muted-foreground">Compte principal</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Réconciliation</CardTitle>
            <CheckCircle className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reconciliationRate.toFixed(0)}%</div>
            <Progress value={reconciliationRate} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {reconciledCount}/{bankTransactions.length} opérations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rapports Fiscal</CardTitle>
            <FileText className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fiscalReports.length}</div>
            <p className="text-xs text-muted-foreground">
              {fiscalReports.filter(r => r.status === "draft").length} en attente
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tva" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tva">Gestion TVA</TabsTrigger>
          <TabsTrigger value="bank">Réconciliation Bancaire</TabsTrigger>
          <TabsTrigger value="fiscal">Rapports Fiscaux</TabsTrigger>
        </TabsList>

        {/* Section TVA */}
        <TabsContent value="tva" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Gestion de la TVA</h2>
            <Dialog open={isAddingTVA} onOpenChange={setIsAddingTVA}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nouvelle Écriture TVA
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Ajouter une écriture TVA</DialogTitle>
                  <DialogDescription>
                    Enregistrez une opération soumise à TVA
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Type d'opération</Label>
                    <Select value={newTVAEntry.type} onValueChange={(value: "collectee" | "deductible") => setNewTVAEntry({ ...newTVAEntry, type: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="collectee">TVA Collectée (Vente)</SelectItem>
                        <SelectItem value="deductible">TVA Déductible (Achat)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      placeholder="Description de l'opération"
                      value={newTVAEntry.description}
                      onChange={(e) => setNewTVAEntry({ ...newTVAEntry, description: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ht_amount">Montant HT (CFA)</Label>
                    <Input
                      id="ht_amount"
                      type="number"
                      placeholder="0"
                      value={newTVAEntry.ht_amount}
                      onChange={(e) => setNewTVAEntry({ ...newTVAEntry, ht_amount: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tva_rate">Taux TVA (%)</Label>
                    <Select value={newTVAEntry.tva_rate} onValueChange={(value) => setNewTVAEntry({ ...newTVAEntry, tva_rate: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="18">18% (Taux normal)</SelectItem>
                        <SelectItem value="10">10% (Taux réduit)</SelectItem>
                        <SelectItem value="0">0% (Exonéré)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={newTVAEntry.date}
                      onChange={(e) => setNewTVAEntry({ ...newTVAEntry, date: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAddingTVA(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleAddTVAEntry}>
                    Enregistrer
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Écritures TVA</CardTitle>
              <CardDescription>
                Suivi des opérations soumises à TVA
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
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Montant HT</TableHead>
                      <TableHead className="text-right">TVA</TableHead>
                      <TableHead className="text-right">Montant TTC</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tvaEntries.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell className="font-medium">{entry.reference}</TableCell>
                        <TableCell>{new Date(entry.date).toLocaleDateString()}</TableCell>
                        <TableCell>{entry.description}</TableCell>
                        <TableCell>
                          <Badge 
                            className={entry.type === "collectee" 
                              ? "bg-success/20 text-success border-success/30" 
                              : "bg-primary/20 text-primary border-primary/30"
                            }
                          >
                            {entry.type === "collectee" ? "Collectée" : "Déductible"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">{entry.ht_amount.toLocaleString()} CFA</TableCell>
                        <TableCell className="text-right font-medium">
                          {entry.tva_amount.toLocaleString()} CFA ({entry.tva_rate}%)
                        </TableCell>
                        <TableCell className="text-right font-bold">{entry.ttc_amount.toLocaleString()} CFA</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Section Réconciliation Bancaire */}
        <TabsContent value="bank" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Réconciliation Bancaire</h2>
            <div className="flex gap-2">
              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Importer Relevé
              </Button>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Exporter
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Opérations Bancaires</CardTitle>
              <CardDescription>
                Réconciliez vos opérations comptables avec votre relevé bancaire
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Référence</TableHead>
                      <TableHead className="text-right">Montant</TableHead>
                      <TableHead className="text-right">Solde</TableHead>
                      <TableHead>Réconcilié</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bankTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                        <TableCell>{transaction.description}</TableCell>
                        <TableCell>{transaction.reference || "—"}</TableCell>
                        <TableCell className={`text-right font-medium ${transaction.type === "credit" ? "text-success" : "text-destructive"}`}>
                          {transaction.type === "credit" ? "+" : "-"}{Math.abs(transaction.amount).toLocaleString()} CFA
                        </TableCell>
                        <TableCell className="text-right">{transaction.balance.toLocaleString()} CFA</TableCell>
                        <TableCell>
                          {transaction.reconciled ? (
                            <Badge className="bg-success/20 text-success border-success/30">
                              <CheckCircle className="mr-1 h-3 w-3" />
                              Réconcilié
                            </Badge>
                          ) : (
                            <Badge variant="outline">
                              <Clock className="mr-1 h-3 w-3" />
                              En attente
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleReconciliation(transaction.id)}
                          >
                            {transaction.reconciled ? "Annuler" : "Réconcilier"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Section Rapports Fiscaux */}
        <TabsContent value="fiscal" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Rapports Fiscaux Automatisés</h2>
            <div className="flex gap-2">
              <Button onClick={() => generateFiscalReport("TVA")}>
                <FileText className="mr-2 h-4 w-4" />
                Générer Déclaration TVA
              </Button>
              <Button variant="outline" onClick={() => generateFiscalReport("IS")}>
                Rapport Impôt Sociétés
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Déclarations et Rapports</CardTitle>
              <CardDescription>
                Suivi des obligations fiscales et génération automatique des rapports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type de rapport</TableHead>
                      <TableHead>Période</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Montant</TableHead>
                      <TableHead>Échéance</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fiscalReports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">{getReportTypeLabel(report.type)}</TableCell>
                        <TableCell>{report.period}</TableCell>
                        <TableCell>{getStatusBadge(report.status)}</TableCell>
                        <TableCell className="text-right font-medium">{report.amount.toLocaleString()} CFA</TableCell>
                        <TableCell>
                          <span className={new Date(report.due_date) < new Date() ? "text-destructive" : ""}>
                            {new Date(report.due_date).toLocaleDateString()}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="outline" size="sm">
                              <Download className="h-3 w-3" />
                            </Button>
                            {report.status === "draft" && (
                              <Button variant="outline" size="sm">
                                Soumettre
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Alertes fiscales */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-warning" />
                Alertes Fiscales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-warning/10 border border-warning/20 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-warning" />
                  <div>
                    <p className="font-medium">Déclaration TVA en retard</p>
                    <p className="text-sm text-muted-foreground">La déclaration TVA de novembre était due le 15 décembre</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-primary/10 border border-primary/20 rounded-lg">
                  <Clock className="h-4 w-4 text-primary" />
                  <div>
                    <p className="font-medium">Contribution foncière à venir</p>
                    <p className="text-sm text-muted-foreground">Échéance le 31 décembre 2024 - 180,000 CFA</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}