import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { useClients } from '@/hooks/useClients'
import type { Database } from '@/integrations/supabase/types'

type HotelReservation = Database['public']['Tables']['reservations_hotels']['Row']
type HotelReservationInsert = Database['public']['Tables']['reservations_hotels']['Insert']

export type { HotelReservation }

export function useHotelReservations() {
  const [reservations, setReservations] = useState<HotelReservation[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const { clients } = useClients()

  const fetchReservations = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('reservations_hotels')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) {
        throw error
      }

      setReservations(data || [])
    } catch (error) {
      console.error('Error fetching hotel reservations:', error)
      toast({
        title: "Erreur",
        description: "Impossible de charger les réservations d'hôtel",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const addReservation = async (reservationData: HotelReservationInsert) => {
    try {
      const { data, error } = await supabase
        .from('reservations_hotels')
        .insert([reservationData])
        .select()

      if (error) {
        throw error
      }

      if (data && data[0]) {
        setReservations(prev => [data[0], ...prev])
        toast({
          title: "Succès",
          description: "Réservation d'hôtel ajoutée avec succès"
        })
        return data[0]
      }
    } catch (error) {
      console.error('Error adding hotel reservation:', error)
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la réservation d'hôtel",
        variant: "destructive"
      })
      throw error
    }
  }

  const updateReservation = async (id: string, updates: Partial<HotelReservation>) => {
    try {
      const { data, error } = await supabase
        .from('reservations_hotels')
        .update(updates)
        .eq('id', id)
        .select()

      if (error) {
        throw error
      }

      if (data && data[0]) {
        setReservations(prev => 
          prev.map(reservation => reservation.id === id ? data[0] as HotelReservation : reservation)
        )
        toast({
          title: "Succès",
          description: "Réservation d'hôtel mise à jour"
        })
      }
    } catch (error) {
      console.error('Error updating hotel reservation:', error)
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la réservation d'hôtel",
        variant: "destructive"
      })
      throw error
    }
  }

  const deleteReservation = async (id: string) => {
    try {
      const { error } = await supabase
        .from('reservations_hotels')
        .delete()
        .eq('id', id)

      if (error) {
        throw error
      }

      setReservations(prev => prev.filter(reservation => reservation.id !== id))
      toast({
        title: "Succès",
        description: "Réservation d'hôtel supprimée"
      })
    } catch (error) {
      console.error('Error deleting hotel reservation:', error)
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la réservation d'hôtel",
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