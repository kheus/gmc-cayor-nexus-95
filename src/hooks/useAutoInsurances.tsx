import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import type { Database } from '@/integrations/supabase/types'

type AutoInsurance = Database['public']['Tables']['assurances_auto']['Row']
type AutoInsuranceInsert = Database['public']['Tables']['assurances_auto']['Insert']

export function useAutoInsurances() {
  const [insurances, setInsurances] = useState<AutoInsurance[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchInsurances = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('assurances_auto')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      setInsurances(data || [])
    } catch (error) {
      console.error('Error fetching insurances:', error)
      toast({
        title: "Erreur",
        description: "Impossible de charger les assurances",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const addInsurance = async (insuranceData: AutoInsuranceInsert) => {
    try {
      const { data, error } = await supabase
        .from('assurances_auto')
        .insert([insuranceData])
        .select()

      if (error) {
        throw error
      }

      if (data && data[0]) {
        setInsurances(prev => [data[0], ...prev])
        toast({
          title: "Succès",
          description: "Assurance ajoutée avec succès"
        })
        return data[0]
      }
    } catch (error) {
      console.error('Error adding insurance:', error)
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter l'assurance",
        variant: "destructive"
      })
      throw error
    }
  }

  useEffect(() => {
    fetchInsurances()
  }, [])

  return {
    insurances,
    loading,
    addInsurance,
    refetch: fetchInsurances
  }
}