import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import type { Database } from '@/integrations/supabase/types'

type CarRental = Database['public']['Tables']['locations_vehicules']['Row']
type CarRentalInsert = Database['public']['Tables']['locations_vehicules']['Insert']

export function useCarRentals() {
  const [rentals, setRentals] = useState<CarRental[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchRentals = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('locations_vehicules')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) {
        throw error
      }

      setRentals(data || [])
    } catch (error) {
      console.error('Error fetching car rentals:', error)
      toast({
        title: "Erreur",
        description: "Impossible de charger les locations de véhicules",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const addRental = async (rentalData: CarRentalInsert) => {
    try {
      const { data, error } = await supabase
        .from('locations_vehicules')
        .insert([rentalData])
        .select()

      if (error) {
        throw error
      }

      if (data && data[0]) {
        setRentals(prev => [data[0], ...prev])
        toast({
          title: "Succès",
          description: "Location de véhicule ajoutée avec succès"
        })
        return data[0]
      }
    } catch (error) {
      console.error('Error adding car rental:', error)
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la location de véhicule",
        variant: "destructive"
      })
      throw error
    }
  }

  const updateRental = async (id: string, updates: Partial<CarRental>) => {
    try {
      const { data, error } = await supabase
        .from('locations_vehicules')
        .update(updates)
        .eq('id', id)
        .select()

      if (error) {
        throw error
      }

      if (data && data[0]) {
        setRentals(prev => 
          prev.map(rental => rental.id === id ? data[0] : rental)
        )
        toast({
          title: "Succès",
          description: "Location de véhicule mise à jour"
        })
      }
    } catch (error) {
      console.error('Error updating car rental:', error)
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la location de véhicule",
        variant: "destructive"
      })
      throw error
    }
  }

  const deleteRental = async (id: string) => {
    try {
      const { error } = await supabase
        .from('locations_vehicules')
        .delete()
        .eq('id', id)

      if (error) {
        throw error
      }

      setRentals(prev => prev.filter(rental => rental.id !== id))
      toast({
        title: "Succès",
        description: "Location de véhicule supprimée"
      })
    } catch (error) {
      console.error('Error deleting car rental:', error)
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la location de véhicule",
        variant: "destructive"
      })
      throw error
    }
  }

  useEffect(() => {
    fetchRentals()
  }, [])

  return {
    rentals,
    loading,
    addRental,
    updateRental,
    deleteRental,
    refetch: fetchRentals
  }
}