import { useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

export interface TVAEntry {
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

export interface BankTransaction {
  id: number
  date: string
  description: string
  amount: number
  balance: number
  type: "debit" | "credit"
  reconciled: boolean
  reference?: string
}

export interface FiscalReport {
  id: number
  type: "tva" | "impot_societe" | "contribution_fonciere"
  period: string
  status: "draft" | "submitted" | "validated"
  amount: number
  due_date: string
}

// Données par défaut
const defaultTVAEntries: TVAEntry[] = [
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
]

const defaultBankTransactions: BankTransaction[] = [
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
]

const defaultFiscalReports: FiscalReport[] = [
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
]

export function useAdvancedAccounting() {
  const { toast } = useToast()
  
  const [tvaEntries, setTvaEntries] = useState<TVAEntry[]>(defaultTVAEntries)
  const [bankTransactions, setBankTransactions] = useState<BankTransaction[]>(defaultBankTransactions)
  const [fiscalReports, setFiscalReports] = useState<FiscalReport[]>(defaultFiscalReports)
  const [isLoading, setIsLoading] = useState(false)

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
  const reconciliationRate = bankTransactions.length > 0 ? (reconciledCount / bankTransactions.length) * 100 : 0

  // Ajouter une écriture TVA
  const addTVAEntry = async (entryData: {
    description: string
    ht_amount: string
    tva_rate: string
    type: "collectee" | "deductible"
    date: string
  }) => {
    try {
      setIsLoading(true)

      if (!entryData.description || !entryData.ht_amount) {
        throw new Error("Veuillez remplir tous les champs obligatoires")
      }

      const htAmount = parseFloat(entryData.ht_amount)
      const tvaRate = parseFloat(entryData.tva_rate)
      const tvaAmount = (htAmount * tvaRate) / 100
      const ttcAmount = htAmount + tvaAmount

      const entry: TVAEntry = {
        id: Math.max(...tvaEntries.map(e => e.id), 0) + 1,
        date: entryData.date,
        description: entryData.description,
        ht_amount: htAmount,
        tva_rate: tvaRate,
        tva_amount: tvaAmount,
        ttc_amount: ttcAmount,
        type: entryData.type,
        reference: `${entryData.type === "collectee" ? "FAC" : "ACH"}${(tvaEntries.length + 1).toString().padStart(3, '0')}`
      }

      // TODO: Intégrer avec Supabase quand disponible
      // const { error } = await supabase
      //   .from('tva_entries')
      //   .insert(entry)

      setTvaEntries(prev => [...prev, entry])
      
      toast({
        title: "Succès",
        description: "Écriture TVA ajoutée avec succès"
      })

      return { success: true, data: entry }
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur lors de l'ajout",
        variant: "destructive"
      })
      return { success: false, error }
    } finally {
      setIsLoading(false)
    }
  }

  // Supprimer une écriture TVA
  const deleteTVAEntry = async (entryId: number) => {
    try {
      setIsLoading(true)
      
      // TODO: Intégrer avec Supabase quand disponible
      // const { error } = await supabase
      //   .from('tva_entries')
      //   .delete()
      //   .eq('id', entryId)
      
      setTvaEntries(prev => prev.filter(entry => entry.id !== entryId))
      
      toast({
        title: "Succès",
        description: "Écriture TVA supprimée avec succès"
      })

      return { success: true }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression",
        variant: "destructive"
      })
      return { success: false, error }
    } finally {
      setIsLoading(false)
    }
  }

  // Basculer la réconciliation d'une transaction
  const toggleReconciliation = async (transactionId: number) => {
    try {
      setIsLoading(true)
      
      // TODO: Intégrer avec Supabase quand disponible
      // const transaction = bankTransactions.find(t => t.id === transactionId)
      // const { error } = await supabase
      //   .from('bank_transactions')
      //   .update({ reconciled: !transaction?.reconciled })
      //   .eq('id', transactionId)

      setBankTransactions(prev => 
        prev.map(transaction => 
          transaction.id === transactionId 
            ? { ...transaction, reconciled: !transaction.reconciled }
            : transaction
        )
      )

      toast({
        title: "Succès",
        description: "Statut de réconciliation mis à jour"
      })

      return { success: true }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la mise à jour",
        variant: "destructive"
      })
      return { success: false, error }
    } finally {
      setIsLoading(false)
    }
  }

  // Ajouter une transaction bancaire
  const addBankTransaction = async (transactionData: {
    date: string
    description: string
    amount: number
    type: "debit" | "credit"
    reference?: string
  }) => {
    try {
      setIsLoading(true)

      const lastBalance = bankTransactions.length > 0 ? bankTransactions[0].balance : 0
      const newBalance = transactionData.type === "credit" 
        ? lastBalance + transactionData.amount 
        : lastBalance + transactionData.amount // amount déjà négatif pour debit

      const transaction: BankTransaction = {
        id: Math.max(...bankTransactions.map(t => t.id), 0) + 1,
        date: transactionData.date,
        description: transactionData.description,
        amount: transactionData.amount,
        balance: newBalance,
        type: transactionData.type,
        reconciled: false,
        reference: transactionData.reference
      }

      // TODO: Intégrer avec Supabase quand disponible
      // const { error } = await supabase
      //   .from('bank_transactions')
      //   .insert(transaction)

      setBankTransactions(prev => [transaction, ...prev])
      
      toast({
        title: "Succès",
        description: "Transaction bancaire ajoutée avec succès"
      })

      return { success: true, data: transaction }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de l'ajout de la transaction",
        variant: "destructive"
      })
      return { success: false, error }
    } finally {
      setIsLoading(false)
    }
  }

  // Générer un rapport fiscal
  const generateFiscalReport = async (reportType: "tva" | "impot_societe" | "contribution_fonciere") => {
    try {
      setIsLoading(true)
      
      // TODO: Calculer les montants basés sur les données réelles
      let amount = 0
      let period = ""
      
      switch (reportType) {
        case "tva":
          amount = tvaAVerser
          period = new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
          break
        case "impot_societe":
          // Calculer basé sur les bénéfices
          amount = 0 // À implémenter
          period = `Exercice ${new Date().getFullYear()}`
          break
        case "contribution_fonciere":
          // Calculer basé sur les propriétés
          amount = 0 // À implémenter
          period = new Date().getFullYear().toString()
          break
      }

      const report: FiscalReport = {
        id: Math.max(...fiscalReports.map(r => r.id), 0) + 1,
        type: reportType,
        period: period,
        status: "draft",
        amount: amount,
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // +30 jours
      }

      // TODO: Intégrer avec Supabase quand disponible
      // const { error } = await supabase
      //   .from('fiscal_reports')
      //   .insert(report)

      setFiscalReports(prev => [...prev, report])
      
      toast({
        title: "Rapport généré",
        description: `Le rapport ${reportType} a été généré avec succès`
      })

      return { success: true, data: report }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la génération du rapport",
        variant: "destructive"
      })
      return { success: false, error }
    } finally {
      setIsLoading(false)
    }
  }

  // Mettre à jour le statut d'un rapport fiscal
  const updateFiscalReportStatus = async (reportId: number, status: "draft" | "submitted" | "validated") => {
    try {
      setIsLoading(true)
      
      // TODO: Intégrer avec Supabase quand disponible
      // const { error } = await supabase
      //   .from('fiscal_reports')
      //   .update({ status })
      //   .eq('id', reportId)

      setFiscalReports(prev => 
        prev.map(report => 
          report.id === reportId 
            ? { ...report, status }
            : report
        )
      )

      toast({
        title: "Succès",
        description: "Statut du rapport mis à jour"
      })

      return { success: true }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la mise à jour",
        variant: "destructive"
      })
      return { success: false, error }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    // Données TVA
    tvaEntries,
    tvaCollectee,
    tvaDeductible,
    tvaAVerser,
    
    // Données bancaires
    bankTransactions,
    currentBalance,
    reconciledCount,
    reconciliationRate,
    
    // Rapports fiscaux
    fiscalReports,
    
    // Méthodes TVA
    addTVAEntry,
    deleteTVAEntry,
    
    // Méthodes bancaires
    addBankTransaction,
    toggleReconciliation,
    
    // Méthodes rapports fiscaux
    generateFiscalReport,
    updateFiscalReportStatus,
    
    // États
    isLoading
  }
}