import { useState, useEffect } from 'react'
import { useToast } from '@/hooks/use-toast'
import { useClients } from '@/hooks/useClients'

export interface Contract {
  id: string
  client_id: string
  propriete_id: string
  client_name: string
  type_bien: string
  adresse: string
  loyer_mensuel: number
  depot_garantie: number
  date_debut: string
  date_fin: string
  statut: 'actif' | 'expire' | 'en_attente'
  conditions_particulieres: string
  type_contrat: 'location' | 'gestion'
  created_at: string
  updated_at: string
}

export function useContracts() {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const { clients } = useClients()

  const fetchContracts = async () => {
    setLoading(true)
    try {
      // Créer des contrats basés sur les vrais clients immobilier de la base de données
      if (clients.length > 0) {
        const immobilierClients = clients.filter(client => 
          client.secteurs?.includes('immobilier')
        )

        const mockContracts: Contract[] = immobilierClients.map((client, index) => ({
          id: `CONT00${index + 1}`,
          client_id: client.id,
          propriete_id: `PROP00${index + 1}`,
          client_name: `${client.prenom} ${client.nom}`,
          type_bien: index % 2 === 0 ? "Appartement" : "Villa",
          adresse: client.adresse,
          loyer_mensuel: index % 2 === 0 ? 450000 : 850000,
          depot_garantie: index % 2 === 0 ? 900000 : 1700000,
          date_debut: "2024-01-15",
          date_fin: "2025-01-15",
          statut: 'actif',
          conditions_particulieres: "Contrat standard",
          type_contrat: 'location',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }))

        setContracts(mockContracts)
      } else {
        setContracts([])
      }
    } catch (error) {
      console.error('Error fetching contracts:', error)
      toast({
        title: "Erreur",
        description: "Impossible de charger les contrats",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const addContract = async (contractData: Partial<Contract>) => {
    try {
      // TODO: Implement with real Supabase integration when table is created
      const newContract: Contract = {
        id: `CONT00${contracts.length + 1}`,
        client_id: contractData.client_id || '',
        propriete_id: contractData.propriete_id || '',
        client_name: contractData.client_name || '',
        type_bien: contractData.type_bien || '',
        adresse: contractData.adresse || '',
        loyer_mensuel: contractData.loyer_mensuel || 0,
        depot_garantie: contractData.depot_garantie || 0,
        date_debut: contractData.date_debut || '',
        date_fin: contractData.date_fin || '',
        statut: 'actif',
        conditions_particulieres: contractData.conditions_particulieres || '',
        type_contrat: 'location',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      setContracts(prev => [newContract, ...prev])
      toast({
        title: "Succès",
        description: "Contrat ajouté avec succès"
      })
      return newContract
    } catch (error) {
      console.error('Error adding contract:', error)
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le contrat",
        variant: "destructive"
      })
      throw error
    }
  }

  const updateContract = async (id: string, updates: Partial<Contract>) => {
    try {
      // TODO: Implement with real Supabase integration when table is created
      setContracts(prev => 
        prev.map(contract => contract.id === id ? { ...contract, ...updates } : contract)
      )
      toast({
        title: "Succès",
        description: "Contrat mis à jour"
      })
    } catch (error) {
      console.error('Error updating contract:', error)
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le contrat",
        variant: "destructive"
      })
      throw error
    }
  }

  const deleteContract = async (id: string) => {
    try {
      // TODO: Implement with real Supabase integration when table is created
      setContracts(prev => prev.filter(contract => contract.id !== id))
      toast({
        title: "Succès",
        description: "Contrat supprimé"
      })
    } catch (error) {
      console.error('Error deleting contract:', error)
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le contrat",
        variant: "destructive"
      })
      throw error
    }
  }

  useEffect(() => {
    fetchContracts()
  }, [clients])

  return {
    contracts,
    loading,
    addContract,
    updateContract,
    deleteContract,
    refetch: fetchContracts
  }
}