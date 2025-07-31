import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import type { Database } from '@/integrations/supabase/types'

type MaintenanceItem = Database['public']['Tables']['maintenance']['Row']
type MaintenanceInsert = Database['public']['Tables']['maintenance']['Insert']

export function useMaintenance() {
  const [maintenanceItems, setMaintenanceItems] = useState<MaintenanceItem[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchMaintenance = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('maintenance')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      setMaintenanceItems(data || [])
    } catch (error) {
      console.error('Error fetching maintenance items:', error)
      toast({
        title: "Erreur",
        description: "Impossible de charger les interventions de maintenance",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const addMaintenanceItem = async (maintenanceData: MaintenanceInsert) => {
    try {
      const { data, error } = await supabase
        .from('maintenance')
        .insert([maintenanceData])
        .select()

      if (error) {
        throw error
      }

      if (data && data[0]) {
        setMaintenanceItems(prev => [data[0], ...prev])
        toast({
          title: "Succès",
          description: "Intervention de maintenance ajoutée avec succès"
        })
        return data[0]
      }
    } catch (error) {
      console.error('Error adding maintenance item:', error)
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter l'intervention de maintenance",
        variant: "destructive"
      })
      throw error
    }
  }

  const updateMaintenanceItem = async (id: string, updates: Partial<MaintenanceItem>) => {
    try {
      const { data, error } = await supabase
        .from('maintenance')
        .update(updates)
        .eq('id', id)
        .select()

      if (error) {
        throw error
      }

      if (data && data[0]) {
        setMaintenanceItems(prev => 
          prev.map(item => item.id === id ? data[0] : item)
        )
        toast({
          title: "Succès",
          description: "Intervention de maintenance mise à jour"
        })
      }
    } catch (error) {
      console.error('Error updating maintenance item:', error)
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'intervention de maintenance",
        variant: "destructive"
      })
      throw error
    }
  }

  const deleteMaintenanceItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('maintenance')
        .delete()
        .eq('id', id)

      if (error) {
        throw error
      }

      setMaintenanceItems(prev => prev.filter(item => item.id !== id))
      toast({
        title: "Succès",
        description: "Intervention de maintenance supprimée"
      })
    } catch (error) {
      console.error('Error deleting maintenance item:', error)
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'intervention de maintenance",
        variant: "destructive"
      })
      throw error
    }
  }

  useEffect(() => {
    fetchMaintenance()
  }, [])

  return {
    maintenanceItems,
    loading,
    addMaintenanceItem,
    updateMaintenanceItem,
    deleteMaintenanceItem,
    refetch: fetchMaintenance
  }
}