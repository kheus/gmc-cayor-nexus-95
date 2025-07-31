import { useState, useMemo } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { useGMCData } from "@/hooks/useGMCData"
import type { AccountingEntry } from "@/types/gmc"

export interface ManualAccountingEntry {
  id: string
  description: string
  type: "recette" | "depense"
  category: string
  secteur: "immobilier" | "voyage" | "assurance" | "general"
  amount: number
  date: string
  reference: string
  source_type: "manual"
  created_at: string
}

export interface AutoInsuranceTariff {
  id: number
  vehicle_category: string
  insured_value?: string
  rc_simple: number | string
  rc_vol: number | string
  rc_vol_incendie: number | string
  tous_risques: number | string
}

export interface HomeInsuranceTariff {
  id: number
  property_type: string
  insured_value: string
  annual_premium: number | string
}

// Données de tarification par défaut
const defaultAutoTariffs: AutoInsuranceTariff[] = [
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

const defaultHomeTariffs: HomeInsuranceTariff[] = [
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

export function useAccounting() {
  const { toast } = useToast()
  const { accountingEntries, getTotalRevenue, getTotalExpenses, getTotalProfit } = useGMCData()
  
  // États locaux pour les écritures manuelles
  const [manualEntries, setManualEntries] = useState<ManualAccountingEntry[]>([])
  const [autoTariffs] = useState<AutoInsuranceTariff[]>(defaultAutoTariffs)
  const [homeTariffs] = useState<HomeInsuranceTariff[]>(defaultHomeTariffs)
  const [isLoading, setIsLoading] = useState(false)

  // Combinaison de toutes les écritures
  const allEntries = useMemo(() => {
    return [...accountingEntries, ...manualEntries]
  }, [accountingEntries, manualEntries])

  // Calculs financiers
  const totalRecettes = getTotalRevenue()
  const totalDepenses = getTotalExpenses()
  const benefice = getTotalProfit()

  // Générateur de référence
  const generateReference = (type: "recette" | "depense") => {
    const prefix = type === "recette" ? "REC" : "DEP"
    const existingRefs = allEntries
      .filter(entry => entry.reference?.startsWith(prefix))
      .map(entry => parseInt(entry.reference!.slice(3)))
    const nextNumber = Math.max(...existingRefs, 0) + 1
    return `${prefix}${nextNumber.toString().padStart(3, '0')}`
  }

  // Ajouter une écriture manuelle
  const addManualEntry = async (entryData: {
    description: string
    type: "recette" | "depense"
    category: string
    secteur: "immobilier" | "voyage" | "assurance" | "general"
    amount: string
    date: string
  }) => {
    try {
      setIsLoading(true)

      if (!entryData.description || !entryData.category || !entryData.amount) {
        throw new Error("Veuillez remplir tous les champs obligatoires")
      }

      const entry: ManualAccountingEntry = {
        id: crypto.randomUUID(),
        date: entryData.date,
        description: entryData.description,
        type: entryData.type,
        category: entryData.category,
        secteur: entryData.secteur,
        amount: parseFloat(entryData.amount),
        reference: generateReference(entryData.type),
        source_type: 'manual',
        created_at: new Date().toISOString()
      }

      // TODO: Intégrer avec Supabase quand disponible
      // const { error } = await supabase
      //   .from('accounting_entries')
      //   .insert(entry)
      
      // Pour l'instant, on stocke localement
      setManualEntries(prev => [...prev, entry])
      
      toast({
        title: "Succès",
        description: "Écriture comptable ajoutée avec succès"
      })

      return { success: true, data: entry }
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur lors de l'ajout de l'écriture",
        variant: "destructive"
      })
      return { success: false, error }
    } finally {
      setIsLoading(false)
    }
  }

  // Supprimer une écriture manuelle
  const deleteManualEntry = async (entryId: string) => {
    try {
      setIsLoading(true)
      
      // TODO: Intégrer avec Supabase quand disponible
      // const { error } = await supabase
      //   .from('accounting_entries')
      //   .delete()
      //   .eq('id', entryId)
      
      setManualEntries(prev => prev.filter(entry => entry.id !== entryId))
      
      toast({
        title: "Succès",
        description: "Écriture supprimée avec succès"
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

  // Filtrer les écritures par secteur
  const getEntriesBySector = (secteur: string) => {
    return allEntries.filter(entry => entry.secteur === secteur)
  }

  // Calculer les totaux par secteur
  const getSectorTotals = (secteur: string) => {
    const sectorEntries = getEntriesBySector(secteur)
    const recettes = sectorEntries
      .filter(entry => entry.type === "recette")
      .reduce((sum, entry) => sum + entry.amount, 0)
    const depenses = sectorEntries
      .filter(entry => entry.type === "depense")
      .reduce((sum, entry) => sum + entry.amount, 0)
    
    return {
      recettes,
      depenses,
      benefice: recettes - depenses
    }
  }

  return {
    // Données
    allEntries,
    manualEntries,
    autoTariffs,
    homeTariffs,
    
    // Calculs
    totalRecettes,
    totalDepenses,
    benefice,
    
    // Méthodes
    addManualEntry,
    deleteManualEntry,
    generateReference,
    getEntriesBySector,
    getSectorTotals,
    
    // États
    isLoading
  }
}