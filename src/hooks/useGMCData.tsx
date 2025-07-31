import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import type { 
  Client, 
  TravelClient, 
  TravelReservation, 
  TravelPayment,
  PropertyPayment,
  InsuranceClient,
  InsuranceContract,
  InsurancePayment,
  FinancialSummary,
  AccountingEntry,
  GMCAlert,
  SectorMetrics 
} from '@/types/gmc'

interface GMCDataState {
  // Données immobilier
  propertyClients: Client[]
  propertyPayments: PropertyPayment[]
  
  // Données voyage
  travelClients: TravelClient[]
  travelReservations: TravelReservation[]
  travelPayments: TravelPayment[]
  
  // Données assurance
  insuranceClients: InsuranceClient[]
  insuranceContracts: InsuranceContract[]
  insurancePayments: InsurancePayment[]
  
  // Données financières consolidées
  financialSummary: FinancialSummary
  accountingEntries: AccountingEntry[]
  alerts: GMCAlert[]
  
  // Métriques par secteur
  immobilierMetrics: SectorMetrics
  voyageMetrics: SectorMetrics
  assuranceMetrics: SectorMetrics
  
  // État du système
  loading: boolean
  lastSync: Date | null
  isStale: boolean
}

export function useGMCData() {
  const [data, setData] = useState<GMCDataState>({
    propertyClients: [],
    propertyPayments: [],
    travelClients: [],
    travelReservations: [],
    travelPayments: [],
    insuranceClients: [],
    insuranceContracts: [],
    insurancePayments: [],
    financialSummary: {
      revenus: { immobilier: 0, voyage: 0, assurance: 0, total: 0 },
      depenses: { immobilier: 0, voyage: 0, assurance: 0, total: 0 },
      benefice: { immobilier: 0, voyage: 0, assurance: 0, total: 0 },
      stats: {
        total_clients: 0,
        clients_immobilier: 0,
        clients_voyage: 0,
        clients_assurance: 0,
        total_proprietes: 0,
        total_reservations: 0,
        total_contrats_assurance: 0,
        taux_occupation: 0,
        taux_paiement: 0
      }
    },
    accountingEntries: [],
    alerts: [],
    immobilierMetrics: {
      chiffre_affaires_mensuel: 0,
      croissance_mensuelle: 0,
      nombre_clients_actifs: 0,
      taux_satisfaction: 0,
      objectif_mensuel: 0,
      taux_realisation: 0
    },
    voyageMetrics: {
      chiffre_affaires_mensuel: 0,
      croissance_mensuelle: 0,
      nombre_clients_actifs: 0,
      taux_satisfaction: 0,
      objectif_mensuel: 0,
      taux_realisation: 0
    },
    assuranceMetrics: {
      chiffre_affaires_mensuel: 0,
      croissance_mensuelle: 0,
      nombre_clients_actifs: 0,
      taux_satisfaction: 0,
      objectif_mensuel: 0,
      taux_realisation: 0
    },
    loading: true,
    lastSync: null,
    isStale: false
  })
  
  const { toast } = useToast()

  // Simulation des données assurance
  const generateMockInsuranceData = useCallback(() => {
    const mockInsuranceClients: InsuranceClient[] = [
      {
        id: 'ic001',
        nom: 'Ndiaye',
        prenom: 'Moussa',
        email: 'moussa@email.com',
        telephone: '77 555 66 77',
        adresse: 'Almadies, Dakar',
        nationalite: 'senegalaise',
        type_client: 'particulier',
        numero_permis: 'DK001234',
        created_at: new Date().toISOString()
      },
      {
        id: 'ic002',
        nom: 'Kane',
        prenom: 'Aissatou',
        email: 'aissatou@email.com',
        telephone: '78 444 55 66',
        adresse: 'Point E, Dakar',
        nationalite: 'senegalaise',
        type_client: 'particulier',
        created_at: new Date().toISOString()
      }
    ]

    const mockInsurancePayments: InsurancePayment[] = [
      {
        id: 'ip001',
        contract_id: 'cont001',
        client_name: 'Moussa Ndiaye',
        type_assurance: 'auto',
        montant: 125000,
        methode: 'virement',
        statut: 'completed',
        date_paiement: '2024-01-15',
        reference: 'ASS-001',
        created_at: new Date().toISOString()
      },
      {
        id: 'ip002',
        contract_id: 'cont002',
        client_name: 'Aissatou Kane',
        type_assurance: 'auto',
        montant: 140000,
        methode: 'carte',
        statut: 'completed',
        date_paiement: '2024-02-20',
        reference: 'ASS-002',
        created_at: new Date().toISOString()
      }
    ]

    return { mockInsuranceClients, mockInsurancePayments }
  }, [])

  // Simulation des données voyage (en attendant l'intégration Supabase)
  const generateMockTravelData = useCallback(() => {
    const mockTravelClients: TravelClient[] = [
      {
        id: 'tc001',
        nom: 'Diallo',
        prenom: 'Amadou',
        email: 'amadou@email.com',
        telephone: '77 123 45 67',
        adresse: 'Sacré-Coeur, Dakar',
        nationalite: 'senegalaise',
        type_voyageur: 'individuel',
        created_at: new Date().toISOString()
      },
      {
        id: 'tc002',
        nom: 'Sow',
        prenom: 'Fatou',
        email: 'fatou@email.com',
        telephone: '78 987 65 43',
        adresse: 'Plateau, Dakar',
        nationalite: 'senegalaise',
        type_voyageur: 'entreprise',
        created_at: new Date().toISOString()
      }
    ]

    const mockTravelPayments: TravelPayment[] = [
      {
        id: 'tp001',
        reservation_id: 'res001',
        client_name: 'Amadou Diallo',
        destination: 'Paris',
        montant: 850000,
        methode: 'virement',
        statut: 'completed',
        date_paiement: '2024-01-10',
        reference: 'PAY-V001',
        created_at: new Date().toISOString()
      },
      {
        id: 'tp002',
        reservation_id: 'res002',
        client_name: 'Fatou Sow',
        destination: 'Abidjan',
        montant: 350000,
        methode: 'especes',
        statut: 'completed',
        date_paiement: '2024-02-15',
        reference: 'PAY-V002',
        created_at: new Date().toISOString()
      },
      {
        id: 'tp003',
        reservation_id: 'res003',
        client_name: 'Omar Ba',
        destination: 'Casablanca',
        montant: 420000,
        methode: 'carte',
        statut: 'completed',
        date_paiement: '2024-03-05',
        reference: 'PAY-V003',
        created_at: new Date().toISOString()
      }
    ]

    return { mockTravelClients, mockTravelPayments }
  }, [])

  // Calcul des métriques financières consolidées
  const calculateFinancialSummary = useCallback((
    propertyClients: Client[],
    propertyPayments: PropertyPayment[],
    travelClients: TravelClient[],
    travelPayments: TravelPayment[],
    insuranceClients: InsuranceClient[],
    insurancePayments: InsurancePayment[]
  ): FinancialSummary => {
    
    // Revenus immobilier (basés sur les clients et estimations)
    const revenus_immobilier = propertyClients.length * 1200000 // 1.2M par client immobilier en moyenne
    
    // Revenus voyage (basés sur les paiements voyage réels)
    const revenus_voyage = travelPayments
      .filter(p => p.statut === 'completed')
      .reduce((sum, p) => sum + p.montant, 0)

    // Revenus assurance (basés sur les paiements assurance réels)
    const revenus_assurance = insurancePayments
      .filter(p => p.statut === 'completed')
      .reduce((sum, p) => sum + p.montant, 0)
    
    const total_revenus = revenus_immobilier + revenus_voyage + revenus_assurance

    // Dépenses estimées (35% des revenus pour immobilier, 25% pour voyage, 15% pour assurance)
    const depenses_immobilier = Math.floor(revenus_immobilier * 0.35)
    const depenses_voyage = Math.floor(revenus_voyage * 0.25)
    const depenses_assurance = Math.floor(revenus_assurance * 0.15) // Marges très élevées pour l'assurance
    const total_depenses = depenses_immobilier + depenses_voyage + depenses_assurance

    // Bénéfices
    const benefice_immobilier = revenus_immobilier - depenses_immobilier
    const benefice_voyage = revenus_voyage - depenses_voyage
    const benefice_assurance = revenus_assurance - depenses_assurance
    const total_benefice = total_revenus - total_depenses

    // Statistiques consolidées
    const total_clients = propertyClients.length + travelClients.length + insuranceClients.length
    const total_reservations = travelPayments.length
    const total_contrats_assurance = insurancePayments.length
    const taux_paiement = (travelPayments.length + insurancePayments.length) > 0 
      ? ([...travelPayments, ...insurancePayments].filter(p => p.statut === 'completed').length / 
         (travelPayments.length + insurancePayments.length)) * 100 
      : 0

    return {
      revenus: {
        immobilier: revenus_immobilier,
        voyage: revenus_voyage,
        assurance: revenus_assurance,
        total: total_revenus
      },
      depenses: {
        immobilier: depenses_immobilier,
        voyage: depenses_voyage,
        assurance: depenses_assurance,
        total: total_depenses
      },
      benefice: {
        immobilier: benefice_immobilier,
        voyage: benefice_voyage,
        assurance: benefice_assurance,
        total: total_benefice
      },
      stats: {
        total_clients,
        clients_immobilier: propertyClients.length,
        clients_voyage: travelClients.length,
        clients_assurance: insuranceClients.length,
        total_proprietes: Math.floor(propertyClients.length * 1.5), // Estimation
        total_reservations,
        total_contrats_assurance,
        taux_occupation: propertyClients.length > 0 ? 75 : 0, // Estimation
        taux_paiement
      }
    }
  }, [])

  // Génération des écritures comptables automatiques
  const generateAccountingEntries = useCallback((
    propertyPayments: PropertyPayment[],
    travelPayments: TravelPayment[],
    insurancePayments: InsurancePayment[]
  ): AccountingEntry[] => {
    const entries: AccountingEntry[] = []

    // Écritures pour les paiements voyage
    travelPayments.forEach((payment, index) => {
      entries.push({
        id: `travel_${payment.id}`,
        date: payment.date_paiement,
        description: `Paiement voyage - ${payment.client_name} - ${payment.destination}`,
        type: 'recette',
        category: 'Voyage',
        secteur: 'voyage',
        amount: payment.montant,
        reference: payment.reference || `TRV${(index + 1).toString().padStart(3, '0')}`,
        source_id: payment.id,
        source_type: 'travel_payment',
        created_at: payment.created_at
      })
    })

    // Écritures pour les paiements assurance
    insurancePayments.forEach((payment, index) => {
      entries.push({
        id: `insurance_${payment.id}`,
        date: payment.date_paiement,
        description: `Paiement assurance ${payment.type_assurance} - ${payment.client_name}`,
        type: 'recette',
        category: 'Assurance',
        secteur: 'assurance',
        amount: payment.montant,
        reference: payment.reference || `ASS${(index + 1).toString().padStart(3, '0')}`,
        source_id: payment.id,
        source_type: 'insurance_payment',
        created_at: payment.created_at
      })
    })

    // Écritures pour les dépenses voyage estimées
    const totalTravelRevenue = travelPayments.reduce((sum, p) => sum + p.montant, 0)
    if (totalTravelRevenue > 0) {
      entries.push({
        id: 'travel_expenses_auto',
        date: new Date().toISOString().split('T')[0],
        description: 'Charges voyage (commission, carburant, etc.)',
        type: 'depense',
        category: 'Charges Voyage',
        secteur: 'voyage',
        amount: Math.floor(totalTravelRevenue * 0.25),
        reference: 'CHG-V001',
        created_at: new Date().toISOString()
      })
    }

    // Écritures pour les dépenses assurance estimées
    const totalInsuranceRevenue = insurancePayments.reduce((sum, p) => sum + p.montant, 0)
    if (totalInsuranceRevenue > 0) {
      entries.push({
        id: 'insurance_expenses_auto',
        date: new Date().toISOString().split('T')[0],
        description: 'Commissions et frais assurance',
        type: 'depense',
        category: 'Charges Assurance',
        secteur: 'assurance',
        amount: Math.floor(totalInsuranceRevenue * 0.15),
        reference: 'CHG-A001',
        created_at: new Date().toISOString()
      })
    }

    return entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [])

  // Synchronisation des données immobilier
  const syncPropertyData = useCallback(async () => {
    try {
      const { data: clients, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return clients || []
    } catch (error: any) {
      console.error('Erreur sync données immobilier:', error)
      return []
    }
  }, [])

  // Synchronisation complète
  const syncAllData = useCallback(async (showToast = false) => {
    setData(prev => ({ ...prev, loading: true }))
    
    try {
      // Sync des données immobilier
      const propertyClients = await syncPropertyData()
      
      // Génération des données voyage et assurance simulées
      const { mockTravelClients, mockTravelPayments } = generateMockTravelData()
      const { mockInsuranceClients, mockInsurancePayments } = generateMockInsuranceData()
      
      // Transformation des clients immobilier vers le format unifié
      const unifiedPropertyClients = propertyClients.map((client: any) => ({
        ...client,
        secteurs: client.secteurs || ['immobilier'],
        prenom: client.prenom || '',
        nationalite: client.nationalite || '',
        preferences: client.preferences || ''
      })) as Client[]
      
      // Calcul des résumés financiers
      const financialSummary = calculateFinancialSummary(
        unifiedPropertyClients,
        [], // propertyPayments - à implémenter
        mockTravelClients,
        mockTravelPayments,
        mockInsuranceClients,
        mockInsurancePayments
      )
      
      // Génération des écritures comptables
      const accountingEntries = generateAccountingEntries(
        [], // propertyPayments - à implémenter
        mockTravelPayments,
        mockInsurancePayments
      )

      // Calcul des métriques par secteur
      const immobilierMetrics: SectorMetrics = {
        chiffre_affaires_mensuel: financialSummary.revenus.immobilier,
        croissance_mensuelle: 12.5,
        nombre_clients_actifs: financialSummary.stats.clients_immobilier,
        taux_satisfaction: 4.2,
        objectif_mensuel: financialSummary.revenus.immobilier * 1.2,
        taux_realisation: 85
      }

      const voyageMetrics: SectorMetrics = {
        chiffre_affaires_mensuel: financialSummary.revenus.voyage,
        croissance_mensuelle: 28.3,
        nombre_clients_actifs: financialSummary.stats.clients_voyage,
        taux_satisfaction: 4.6,
        objectif_mensuel: 2000000, // 2M objectif voyage
        taux_realisation: financialSummary.revenus.voyage > 0 ? (financialSummary.revenus.voyage / 2000000) * 100 : 0
      }

      const assuranceMetrics: SectorMetrics = {
        chiffre_affaires_mensuel: financialSummary.revenus.assurance,
        croissance_mensuelle: 35.7,
        nombre_clients_actifs: financialSummary.stats.clients_assurance,
        taux_satisfaction: 4.4,
        objectif_mensuel: 1500000, // 1.5M objectif assurance
        taux_realisation: financialSummary.revenus.assurance > 0 ? (financialSummary.revenus.assurance / 1500000) * 100 : 0
      }

      setData(prev => ({
        ...prev,
        propertyClients: unifiedPropertyClients,
        travelClients: mockTravelClients,
        travelPayments: mockTravelPayments,
        insuranceClients: mockInsuranceClients,
        insurancePayments: mockInsurancePayments,
        financialSummary,
        accountingEntries,
        immobilierMetrics,
        voyageMetrics,
        assuranceMetrics,
        loading: false,
        lastSync: new Date(),
        isStale: false
      }))

      if (showToast) {
        toast({
          title: "Synchronisation réussie",
          description: "Toutes les données GMC ont été mises à jour (Immobilier + Voyage + Assurance)"
        })
      }
    } catch (error: any) {
      console.error('Erreur synchronisation GMC:', error)
      setData(prev => ({ ...prev, loading: false }))
      
      if (showToast) {
        toast({
          variant: "destructive",
          title: "Erreur de synchronisation",
          description: "Impossible de mettre à jour les données GMC"
        })
      }
    }
  }, [syncPropertyData, generateMockTravelData, calculateFinancialSummary, generateAccountingEntries, toast])

  // Synchronisation automatique au démarrage
  useEffect(() => {
    syncAllData()
  }, [syncAllData])

  // Synchronisation automatique toutes les 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      syncAllData(false)
    }, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [syncAllData])

  // Détection de données obsolètes (plus de 10 minutes)
  useEffect(() => {
    const checkStaleData = () => {
      if (data.lastSync) {
        const isStale = (Date.now() - data.lastSync.getTime()) > 10 * 60 * 1000
        setData(prev => ({ ...prev, isStale }))
      }
    }

    const interval = setInterval(checkStaleData, 60 * 1000) // Vérification chaque minute
    return () => clearInterval(interval)
  }, [data.lastSync])

  return {
    ...data,
    syncAllData: () => syncAllData(true),
    
    // Fonctions utilitaires
    getTotalRevenue: () => data.financialSummary.revenus.total,
    getTotalExpenses: () => data.financialSummary.depenses.total,
    getTotalProfit: () => data.financialSummary.benefice.total,
    getProfitMargin: () => {
      const total = data.financialSummary.revenus.total
      return total > 0 ? (data.financialSummary.benefice.total / total) * 100 : 0
    },
    
    // Métriques par secteur
    getImmobilierPerformance: () => ({
      ...data.immobilierMetrics,
      part_ca: data.financialSummary.revenus.total > 0 
        ? (data.financialSummary.revenus.immobilier / data.financialSummary.revenus.total) * 100 
        : 0
    }),
    
    getVoyagePerformance: () => ({
      ...data.voyageMetrics,
      part_ca: data.financialSummary.revenus.total > 0 
        ? (data.financialSummary.revenus.voyage / data.financialSummary.revenus.total) * 100 
        : 0
    }),
    
    getAssurancePerformance: () => ({
      ...data.assuranceMetrics,
      part_ca: data.financialSummary.revenus.total > 0 
        ? (data.financialSummary.revenus.assurance / data.financialSummary.revenus.total) * 100 
        : 0
    })
  }
}