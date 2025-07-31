import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

interface Payment {
  id: string
  created_at: string
  updated_at: string
  client_id: string | null
  client_name: string
  secteur: 'immobilier' | 'voyage' | 'assurance'
  type_paiement: string
  montant: number
  methode: 'virement' | 'especes' | 'carte' | 'cheque' | 'mobile'
  statut: 'completed' | 'partial' | 'pending'
  date_paiement: string
  reference: string | null
  details: any
  observations: string | null
}

interface PaymentInsert {
  client_id?: string | null
  client_name: string
  secteur: 'immobilier' | 'voyage' | 'assurance'
  type_paiement: string
  montant: number
  methode: 'virement' | 'especes' | 'carte' | 'cheque' | 'mobile'
  statut?: 'completed' | 'partial' | 'pending'
  date_paiement: string
  reference?: string | null
  details?: any
  observations?: string | null
}

export function usePayments() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchPayments = async () => {
    setLoading(true)
    console.log('🔍 Tentative de récupération des paiements...')
    try {
      const { data, error } = await (supabase as any)
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ Erreur lors de la récupération des paiements:', error)
        throw error
      }

      console.log('✅ Paiements récupérés avec succès:', data)
      setPayments(data || [])
    } catch (error) {
      console.error('💥 Erreur complète:', error)
      toast({
        title: "Erreur",
        description: "Impossible de charger les paiements",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const addPayment = async (paymentData: PaymentInsert) => {
    console.log('💳 Tentative d\'ajout d\'un paiement:', paymentData)
    
    // Vérifier la session utilisateur
    const { data: { session } } = await supabase.auth.getSession()
    console.log('🔐 Session actuelle:', session)
    
    try {
      // Préparer les données selon le schéma de la table payments
      const cleanPaymentData = {
        client_id: paymentData.client_id,
        client_name: paymentData.client_name,
        secteur: paymentData.secteur,
        type_paiement: paymentData.type_paiement,
        montant: typeof paymentData.montant === 'string' ? parseFloat(paymentData.montant) : paymentData.montant,
        methode: paymentData.methode,
        statut: paymentData.statut || 'pending',
        date_paiement: paymentData.date_paiement,
        reference: paymentData.reference,
        observations: paymentData.observations,
        details: {
          ...paymentData.details,
          // Stocker les champs spécifiques dans details
          property_name: (paymentData as any).property_name,
          contract_id: (paymentData as any).contract_id,
          destination: (paymentData as any).destination,
          reservation_id: (paymentData as any).reservation_id,
          vehicule_marque: (paymentData as any).vehicule_marque,
          vehicule_modele: (paymentData as any).vehicule_modele,
          numero_immatriculation: (paymentData as any).numero_immatriculation,
        }
      }
      
      console.log('📝 Données nettoyées pour insertion:', cleanPaymentData)

      const { data, error } = await (supabase as any)
        .from('payments')
        .insert([cleanPaymentData])
        .select()

      if (error) {
        console.error('❌ Erreur lors de l\'ajout:', error)
        console.error('❌ Détails de l\'erreur:', error.details, error.hint, error.code)
        throw error
      }

      console.log('✅ Paiement ajouté avec succès:', data)
      if (data && data[0]) {
        setPayments(prev => [data[0] as Payment, ...prev])
        toast({
          title: "Succès",
          description: "Paiement ajouté avec succès"
        })
        return data[0]
      }
    } catch (error) {
      console.error('💥 Erreur complète lors de l\'ajout:', error)
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le paiement",
        variant: "destructive"
      })
      throw error
    }
  }

  const updatePayment = async (id: string, updates: Partial<Payment>) => {
    try {
      const { data, error } = await (supabase as any)
        .from('payments')
        .update(updates)
        .eq('id', id)
        .select()

      if (error) {
        throw error
      }

      if (data && data[0]) {
        setPayments(prev => 
          prev.map(payment => payment.id === id ? data[0] as Payment : payment)
        )
        toast({
          title: "Succès",
          description: "Paiement mis à jour"
        })
      }
    } catch (error) {
      console.error('Error updating payment:', error)
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le paiement",
        variant: "destructive"
      })
      throw error
    }
  }

  const deletePayment = async (id: string) => {
    try {
      const { error } = await (supabase as any)
        .from('payments')
        .delete()
        .eq('id', id)

      if (error) {
        throw error
      }

      setPayments(prev => prev.filter(payment => payment.id !== id))
      toast({
        title: "Succès",
        description: "Paiement supprimé"
      })
    } catch (error) {
      console.error('Error deleting payment:', error)
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le paiement",
        variant: "destructive"
      })
      throw error
    }
  }

  useEffect(() => {
    fetchPayments()
  }, [])

  return {
    payments,
    loading,
    addPayment,
    updatePayment,
    deletePayment,
    refetch: fetchPayments
  }
}