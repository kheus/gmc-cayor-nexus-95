import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import type { Database } from '@/integrations/supabase/types'

type Property = Database['public']['Tables']['proprietes']['Row'] & {
  id_bien?: string
  titre_bien?: string
  ville_zone?: string
  prix_loyer?: number
}

interface CreatePropertyInput {
  type_bien: string
  titre_bien: string
  adresse: string
  ville_zone: string
  superficie: string
  nombre_pieces: string
  etage: string
  usage: string
  statut: string
  lien_photos: string
  description: string
  prix_loyer: string
  charges_mensuelles: string
}

export function useProperties() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const generatePropertyId = () => {
    const nextId = properties.length + 1
    return `PROP${String(nextId).padStart(3, '0')}`
  }

  const fetchProperties = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('proprietes')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      setProperties(data || [])
    } catch (error) {
      console.error('Error fetching properties:', error)
      toast({
        title: "Erreur",
        description: "Impossible de charger les propriétés",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const addProperty = async (propertyData: CreatePropertyInput) => {
    try {
      const { data, error } = await supabase
        .from('proprietes')
        .insert([{
          type_bien: propertyData.type_bien as any,
          titre: propertyData.titre_bien,
          adresse: propertyData.adresse,
          ville: propertyData.ville_zone,
          superficie: parseInt(propertyData.superficie),
          nombre_pieces: parseInt(propertyData.nombre_pieces) || null,
          etage: parseInt(propertyData.etage) || null,
          usage: propertyData.usage as any,
          statut: propertyData.statut as any,
          lien_photos: propertyData.lien_photos || null,
          description: propertyData.description || null,
          prix_loyer_mensuel: parseInt(propertyData.prix_loyer),
          charges_mensuelles: parseInt(propertyData.charges_mensuelles) || 0
        }])
        .select()

      if (error) {
        throw error
      }

      if (data && data[0]) {
        setProperties(prev => [data[0] as Property, ...prev])
        toast({
          title: "Succès",
          description: "Propriété ajoutée avec succès"
        })
        return data[0]
      }
    } catch (error) {
      console.error('Error adding property:', error)
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la propriété",
        variant: "destructive"
      })
      throw error
    }
  }

  const updateProperty = async (id: string, updates: Partial<Property>) => {
    try {
      const { data, error } = await supabase
        .from('proprietes')
        .update(updates)
        .eq('id', id)
        .select()

      if (error) {
        throw error
      }

      if (data && data[0]) {
        setProperties(prev => 
          prev.map(prop => prop.id === id ? data[0] as Property : prop)
        )
        toast({
          title: "Succès",
          description: "Propriété mise à jour"
        })
      }
    } catch (error) {
      console.error('Error updating property:', error)
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la propriété",
        variant: "destructive"
      })
      throw error
    }
  }

  const deleteProperty = async (id: string) => {
    try {
      const { error } = await supabase
        .from('proprietes')
        .delete()
        .eq('id', id)

      if (error) {
        throw error
      }

      setProperties(prev => prev.filter(prop => prop.id !== id))
      toast({
        title: "Succès",
        description: "Propriété supprimée"
      })
    } catch (error) {
      console.error('Error deleting property:', error)
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la propriété",
        variant: "destructive"
      })
      throw error
    }
  }

  useEffect(() => {
    fetchProperties()
  }, [])

  return {
    properties,
    loading,
    addProperty,
    updateProperty,
    deleteProperty,
    refetch: fetchProperties
  }
}