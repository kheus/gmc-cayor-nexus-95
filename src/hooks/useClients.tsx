import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

// Import Client from types instead of defining locally
import { Client } from '@/types/gmc'

// Re-export Client for components
export type { Client }

export function useClients() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      
      // Transformation pour assurer la compatibilité avec le nouveau format unifié
      const clientsWithSecteurs = (data || []).map((client: any) => ({
        ...client,
        secteurs: client.secteurs || ['immobilier'], // Par défaut, les anciens clients sont immobilier
        prenom: client.prenom || '',
        nationalite: client.nationalite || '',
        preferences: client.preferences || ''
      })) as Client[]
      
      setClients(clientsWithSecteurs)
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les clients"
      })
    } finally {
      setLoading(false)
    }
  }

  const addClient = async (clientData: Omit<Client, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .insert([clientData])
        .select()
        .single()

      if (error) throw error

      // Assurer la compatibilité avec le nouveau format
      const clientWithSecteurs = {
        ...data,
        secteurs: (data as any).secteurs || ['immobilier'],
        prenom: (data as any).prenom || '',
        nationalite: (data as any).nationalite || '',
        preferences: (data as any).preferences || ''
      } as Client
      setClients(prev => [clientWithSecteurs, ...prev])
      toast({
        title: "Succès",
        description: "Client ajouté avec succès"
      })
      return { success: true, data }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter le client"
      })
      return { success: false, error }
    }
  }

  const updateClient = async (id: string, updates: Partial<Client>) => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      // Assurer la compatibilité avec le nouveau format
      const updatedClientWithSecteurs = {
        ...data,
        secteurs: (data as any).secteurs || ['immobilier'],
        prenom: (data as any).prenom || '',
        nationalite: (data as any).nationalite || '',
        preferences: (data as any).preferences || ''
      } as Client
      setClients(prev => prev.map(client => client.id === id ? updatedClientWithSecteurs : client))
      toast({
        title: "Succès",
        description: "Client modifié avec succès"
      })
      return { success: true, data }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de modifier le client"
      })
      return { success: false, error }
    }
  }

  const deleteClient = async (id: string) => {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id)

      if (error) throw error

      setClients(prev => prev.filter(client => client.id !== id))
      toast({
        title: "Succès",
        description: "Client supprimé avec succès"
      })
      return { success: true }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer le client"
      })
      return { success: false, error }
    }
  }

  useEffect(() => {
    fetchClients()
  }, [])

  return {
    clients,
    loading,
    addClient,
    updateClient,
    deleteClient,
    refetch: fetchClients
  }
}