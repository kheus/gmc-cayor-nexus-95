import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useDataSync } from '@/hooks/useDataSync'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { FileText, Download, Calendar as CalendarIcon, BarChart3, TrendingUp, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import * as XLSX from 'xlsx'

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF
  }
}

interface ReportConfig {
  type: 'financial' | 'clients' | 'properties' | 'insurance' | 'maintenance'
  period: 'monthly' | 'quarterly' | 'yearly' | 'custom'
  format: 'pdf' | 'excel'
  startDate?: Date
  endDate?: Date
}

const reportTypes = [
  { value: 'financial', label: 'Rapport Financier', description: 'Revenus, dépenses, rentabilité' },
  { value: 'clients', label: 'Rapport Clients', description: 'Liste des clients et statistiques' },
  { value: 'properties', label: 'Rapport Immobilier', description: 'Propriétés et occupation' },
  { value: 'insurance', label: 'Rapport Assurances', description: 'Polices et échéances' },
  { value: 'maintenance', label: 'Rapport Maintenance', description: 'Interventions et coûts' }
]

const periods = [
  { value: 'monthly', label: 'Mensuel' },
  { value: 'quarterly', label: 'Trimestriel' },
  { value: 'yearly', label: 'Annuel' },
  { value: 'custom', label: 'Période personnalisée' }
]

// Données vides - à remplacer par les vraies données via Supabase
const mockFinancialData: any[] = []
const mockClientsData: any[] = []

export function ReportsGenerator() {
  const { clients } = useDataSync()
  const [config, setConfig] = useState<ReportConfig>({
    type: 'financial',
    period: 'monthly',
    format: 'pdf'
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const { toast } = useToast()

  const generatePDFReport = async (type: string) => {
    const pdf = new jsPDF()
    const pageWidth = pdf.internal.pageSize.width
    
    // En-tête
    pdf.setFontSize(20)
    pdf.text('GMC Dashboard - Rapport', pageWidth / 2, 20, { align: 'center' })
    
    pdf.setFontSize(14)
    const reportTitle = reportTypes.find(r => r.value === type)?.label || 'Rapport'
    pdf.text(reportTitle, pageWidth / 2, 35, { align: 'center' })
    
    pdf.setFontSize(10)
    pdf.text(`Généré le ${format(new Date(), 'dd/MM/yyyy à HH:mm', { locale: fr })}`, pageWidth / 2, 45, { align: 'center' })
    
    // Contenu selon le type de rapport
    if (type === 'financial') {
      pdf.autoTable({
        head: [['Mois', 'Revenus (CFA)', 'Dépenses (CFA)', 'Bénéfices (CFA)']],
        body: mockFinancialData.map(row => [
          row.month,
          row.revenus.toLocaleString('fr-FR'),
          row.depenses.toLocaleString('fr-FR'),
          row.benefices.toLocaleString('fr-FR')
        ]),
        startY: 60,
        styles: { fontSize: 9 },
        headStyles: { fillColor: [59, 130, 246] }
      })
      
      // Résumé
      const totalRevenus = mockFinancialData.reduce((sum, row) => sum + row.revenus, 0)
      const totalDepenses = mockFinancialData.reduce((sum, row) => sum + row.depenses, 0)
      const totalBenefices = mockFinancialData.reduce((sum, row) => sum + row.benefices, 0)
      
      const finalY = (pdf as any).lastAutoTable.finalY + 20
      pdf.setFontSize(12)
      pdf.text('Résumé de la période:', 20, finalY)
      pdf.setFontSize(10)
      pdf.text(`Total Revenus: ${totalRevenus.toLocaleString('fr-FR')} CFA`, 20, finalY + 15)
      pdf.text(`Total Dépenses: ${totalDepenses.toLocaleString('fr-FR')} CFA`, 20, finalY + 25)
      pdf.text(`Total Bénéfices: ${totalBenefices.toLocaleString('fr-FR')} CFA`, 20, finalY + 35)
      pdf.text(`Rentabilité: ${((totalBenefices / totalRevenus) * 100).toFixed(1)}%`, 20, finalY + 45)
    }
    
    if (type === 'clients') {
      pdf.autoTable({
        head: [['Nom', 'Prénom', 'Email', 'Téléphone', 'Statut']],
        body: mockClientsData.map(client => [
          client.nom,
          client.prenom,
          client.email,
          client.telephone,
          client.statut
        ]),
        startY: 60,
        styles: { fontSize: 9 },
        headStyles: { fillColor: [59, 130, 246] }
      })
      
      const finalY = (pdf as any).lastAutoTable.finalY + 20
      pdf.setFontSize(12)
      pdf.text('Statistiques clients:', 20, finalY)
      pdf.setFontSize(10)
      pdf.text(`Total clients: ${mockClientsData.length}`, 20, finalY + 15)
      pdf.text(`Clients actifs: ${mockClientsData.filter(c => c.statut === 'Actif').length}`, 20, finalY + 25)
      pdf.text(`Taux d'activité: ${((mockClientsData.filter(c => c.statut === 'Actif').length / mockClientsData.length) * 100).toFixed(1)}%`, 20, finalY + 35)
    }
    
    return pdf
  }

  const generateExcelReport = async (type: string) => {
    const workbook = XLSX.utils.book_new()
    
    if (type === 'financial') {
      const worksheet = XLSX.utils.json_to_sheet(mockFinancialData)
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Rapport Financier')
    }
    
    if (type === 'clients') {
      const worksheet = XLSX.utils.json_to_sheet(mockClientsData)
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Rapport Clients')
    }
    
    return workbook
  }

  const handleGenerateReport = async () => {
    setIsGenerating(true)
    
    try {
      const reportTitle = reportTypes.find(r => r.value === config.type)?.label || 'Rapport'
      const fileName = `${reportTitle}_${format(new Date(), 'yyyy-MM-dd')}`
      
      if (config.format === 'pdf') {
        const pdf = await generatePDFReport(config.type)
        pdf.save(`${fileName}.pdf`)
      } else {
        const workbook = await generateExcelReport(config.type)
        XLSX.writeFile(workbook, `${fileName}.xlsx`)
      }
      
      toast({
        title: "Rapport généré",
        description: `${reportTitle} téléchargé avec succès`
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de générer le rapport"
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Card className="gmc-card-elevated">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Générateur de Rapports
        </CardTitle>
        <CardDescription>
          Créez et exportez des rapports détaillés en PDF ou Excel
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Configuration du rapport */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Type de rapport</label>
            <Select value={config.type} onValueChange={(value: any) => setConfig({...config, type: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un type" />
              </SelectTrigger>
              <SelectContent>
                {reportTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    <div>
                      <div className="font-medium">{type.label}</div>
                      <div className="text-xs text-muted-foreground">{type.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Période</label>
            <Select value={config.period} onValueChange={(value: any) => setConfig({...config, period: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une période" />
              </SelectTrigger>
              <SelectContent>
                {periods.map(period => (
                  <SelectItem key={period.value} value={period.value}>
                    {period.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Dates personnalisées */}
        {config.period === 'custom' && (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Date de début</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "dd/MM/yyyy", { locale: fr }) : "Sélectionner"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Date de fin</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "dd/MM/yyyy", { locale: fr }) : "Sélectionner"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        )}

        {/* Format de sortie */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Format d'export</label>
          <div className="flex gap-2">
            <Button
              variant={config.format === 'pdf' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setConfig({...config, format: 'pdf'})}
              className="flex-1"
            >
              <FileText className="mr-2 h-4 w-4" />
              PDF
            </Button>
            <Button
              variant={config.format === 'excel' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setConfig({...config, format: 'excel'})}
              className="flex-1"
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Excel
            </Button>
          </div>
        </div>

        {/* Prévisualisation */}
        <div className="border rounded-lg p-4 bg-accent/5">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Aperçu du rapport
          </h4>
          <div className="space-y-1 text-sm text-muted-foreground">
            <p>Type: {reportTypes.find(r => r.value === config.type)?.label}</p>
            <p>Période: {periods.find(p => p.value === config.period)?.label}</p>
            <p>Format: {config.format.toUpperCase()}</p>
            {config.period === 'custom' && startDate && endDate && (
              <p>Du {format(startDate, "dd/MM/yyyy", { locale: fr })} au {format(endDate, "dd/MM/yyyy", { locale: fr })}</p>
            )}
          </div>
        </div>

        {/* Bouton de génération */}
        <Button 
          onClick={handleGenerateReport}
          disabled={isGenerating || (config.period === 'custom' && (!startDate || !endDate))}
          className="w-full gmc-button gmc-button-primary"
          size="lg"
        >
          {isGenerating ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          {isGenerating ? 'Génération en cours...' : 'Générer le rapport'}
        </Button>
      </CardContent>
    </Card>
  )
}