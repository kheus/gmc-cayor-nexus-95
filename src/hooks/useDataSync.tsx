import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

interface DataState {
  clients: any[]
  properties: any[]
  contracts: any[]
  payments: any[]
  maintenance: any[]
  loading: boolean
  lastSync: Date | null
}

export function useDataSync() {
  const [data, setData] = useState<DataState>({
    clients: [],
    properties: [],
    contracts: [],
    payments: [],
    maintenance: [],
    loading: true,
    lastSync: null
  })
  const { toast } = useToast()

  const syncClients = useCallback(async () => {
    try {
      const { data: clients, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return clients || []
    } catch (error: any) {
      console.error('Erreur sync clients:', error)
      return []
    }
  }, [])

  const syncAllData = useCallback(async (showToast = false) => {
    setData(prev => ({ ...prev, loading: true }))
    
    try {
      // Synchronisation parallèle de toutes les données
      const [clients] = await Promise.all([
        syncClients(),
        // Ajouter d'autres syncs ici quand les tables seront créées
        // syncProperties(),
        // syncContracts(),
        // syncPayments(),
        // syncMaintenance()
      ])

      setData(prev => ({
        ...prev,
        clients,
        // properties,
        // contracts,
        // payments,
        // maintenance,
        loading: false,
        lastSync: new Date()
      }))

      if (showToast) {
        toast({
          title: "Synchronisation réussie",
          description: "Toutes les données ont été mises à jour"
        })
      }
    } catch (error: any) {
      console.error('Erreur synchronisation:', error)
      setData(prev => ({ ...prev, loading: false }))
      
      if (showToast) {
        toast({
          variant: "destructive",
          title: "Erreur de synchronisation",
          description: "Impossible de mettre à jour les données"
        })
      }
    }
  }, [syncClients, toast])

  // Synchronisation automatique au démarrage
  useEffect(() => {
    syncAllData()
  }, [syncAllData])

  // Synchronisation automatique toutes les 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      syncAllData(false)
    }, 5 * 60 * 1000) // 5 minutes

    return () => clearInterval(interval)
  }, [syncAllData])

  // Écoute des changements en temps réel
  useEffect(() => {
    const subscriptions = [
      supabase
        .channel('clients_changes')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'clients' },
          () => syncClients().then(clients => 
            setData(prev => ({ ...prev, clients, lastSync: new Date() }))
          )
        )
        .subscribe()
    ]

    return () => {
      subscriptions.forEach(sub => sub.unsubscribe())
    }
  }, [syncClients])

  return {
    ...data,
    syncAllData: () => syncAllData(true),
    isStale: data.lastSync ? (Date.now() - data.lastSync.getTime()) > 10 * 60 * 1000 : false
  }
}