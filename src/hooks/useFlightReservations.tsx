import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import type { Database } from '@/integrations/supabase/types'

type FlightReservation = Database['public']['Tables']['reservations_vols']['Row']
type FlightReservationInsert = Database['public']['Tables']['reservations_vols']['Insert']

export function useFlightReservations() {
  const [reservations, setReservations] = useState<FlightReservation[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchReservations = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('reservations_vols')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      setReservations(data || [])
    } catch (error) {
      console.error('Error fetching flight reservations:', error)
      toast({
        title: "Erreur",
        description: "Impossible de charger les réservations de vol",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const addReservation = async (reservationData: FlightReservationInsert) => {
    try {
      const { data, error } = await supabase
        .from('reservations_vols')
        .insert([reservationData])
        .select()

      if (error) {
        throw error
      }

      if (data && data[0]) {
        setReservations(prev => [data[0], ...prev])
        toast({
          title: "Succès",
          description: "Réservation de vol ajoutée avec succès"
        })
        return data[0]
      }
    } catch (error) {
      console.error('Error adding flight reservation:', error)
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la réservation de vol",
        variant: "destructive"
      })
      throw error
    }
  }

  const updateReservation = async (id: string, updates: Partial<FlightReservation>) => {
    try {
      const { data, error } = await supabase
        .from('reservations_vols')
        .update(updates)
        .eq('id', id)
        .select()

      if (error) {
        throw error
      }

      if (data && data[0]) {
        setReservations(prev => 
          prev.map(reservation => reservation.id === id ? data[0] : reservation)
        )
        toast({
          title: "Succès",
          description: "Réservation de vol mise à jour"
        })
      }
    } catch (error) {
      console.error('Error updating flight reservation:', error)
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la réservation de vol",
        variant: "destructive"
      })
      throw error
    }
  }

  const deleteReservation = async (id: string) => {
    try {
      const { error } = await supabase
        .from('reservations_vols')
        .delete()
        .eq('id', id)

      if (error) {
        throw error
      }

      setReservations(prev => prev.filter(reservation => reservation.id !== id))
      toast({
        title: "Succès",
        description: "Réservation de vol supprimée"
      })
    } catch (error) {
      console.error('Error deleting flight reservation:', error)
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la réservation de vol",
        variant: "destructive"
      })
      throw error
    }
  }

  useEffect(() => {
    fetchReservations()
  }, [])

  return {
    reservations,
    loading,
    addReservation,
    updateReservation,
    deleteReservation,
    refetch: fetchReservations
  }
}