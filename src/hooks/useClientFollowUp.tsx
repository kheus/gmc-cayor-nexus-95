import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { ClientFollowUp, CommunicationTemplate, CommunicationLog } from '@/types/gmc'

export function useClientFollowUp() {
  const [followUps, setFollowUps] = useState<ClientFollowUp[]>([])
  const [templates, setTemplates] = useState<CommunicationTemplate[]>([])
  const [communicationLogs, setCommunicationLogs] = useState<CommunicationLog[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  // Charger les suivis de clients depuis Supabase
  const fetchFollowUps = async () => {
    try {
      const { data, error } = await supabase
        .from('client_follow_ups')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setFollowUps((data || []) as ClientFollowUp[])
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les suivis clients"
      })
    }
  }

  // Charger les templates de communication depuis Supabase
  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('communication_templates')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      setTemplates((data || []) as CommunicationTemplate[])
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les modèles de communication"
      })
    }
  }

  // Charger les logs de communication depuis Supabase
  const fetchCommunicationLogs = async (clientId?: string) => {
    try {
      let query = supabase
        .from('communication_logs')
        .select('*')
        .order('sent_at', { ascending: false })

      if (clientId) {
        query = query.eq('client_id', clientId)
      }

      const { data, error } = await query
      if (error) throw error
      setCommunicationLogs((data || []) as CommunicationLog[])
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger l'historique des communications"
      })
    }
  }

  // Mettre à jour le suivi client dans Supabase
  const updateFollowUp = async (followUpData: Partial<ClientFollowUp>) => {
    try {
      const { data, error } = await supabase
        .from('client_follow_ups')
        .upsert({
          client_id: followUpData.client_id!,
          last_contact: followUpData.last_contact,
          next_contact: followUpData.next_contact,
          contact_type: followUpData.contact_type || 'email',
          status: followUpData.status || 'prospect',
          priority: followUpData.priority || 'medium',
          notes: followUpData.notes
        })
        .select()
        .single()

      if (error) throw error

      // Mettre à jour l'état local
      setFollowUps(prev => {
        const existing = prev.find(f => f.client_id === followUpData.client_id)
        if (existing) {
          return prev.map(f => f.client_id === followUpData.client_id ? data as ClientFollowUp : f)
        } else {
          return [...prev, data as ClientFollowUp]
        }
      })

      toast({
        title: "Succès",
        description: "Suivi client mis à jour"
      })
      return { success: true, data }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le suivi"
      })
      return { success: false, error }
    }
  }

  // Ajouter un template de communication dans Supabase
  const addTemplate = async (templateData: Omit<CommunicationTemplate, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('communication_templates')
        .insert({
          name: templateData.name,
          type: templateData.type,
          subject: templateData.subject,
          content: templateData.content,
          sector: templateData.sector,
          target_status: templateData.target_status
        })
        .select()
        .single()

      if (error) throw error

      setTemplates(prev => [...prev, data as CommunicationTemplate])
      toast({
        title: "Succès",
        description: "Modèle ajouté avec succès"
      })
      return { success: true, data }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter le modèle"
      })
      return { success: false, error }
    }
  }

  // Enregistrer une communication dans Supabase
  const logCommunication = async (logData: Omit<CommunicationLog, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('communication_logs')
        .insert({
          client_id: logData.client_id,
          type: logData.type,
          subject: logData.subject,
          content: logData.content,
          sent_at: logData.sent_at,
          status: logData.status || 'sent',
          template_id: logData.template_id
        })
        .select()
        .single()

      if (error) throw error

      setCommunicationLogs(prev => [data as CommunicationLog, ...prev])
      
      // Mettre à jour le dernier contact dans le suivi
      await updateFollowUp({
        client_id: logData.client_id,
        last_contact: logData.sent_at,
        contact_type: logData.type
      })

      toast({
        title: "Succès",
        description: "Communication enregistrée"
      })
      return { success: true, data }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'enregistrer la communication"
      })
      return { success: false, error }
    }
  }

  // Envoyer un email/SMS via les edge functions Supabase
  const sendCommunication = async (
    clientId: string,
    type: 'email' | 'sms',
    content: string,
    subject?: string,
    clientName?: string,
    clientEmail?: string,
    clientPhone?: string
  ) => {
    try {
      let sendResult;
      
      if (type === 'email') {
        // Appeler l'edge function pour l'envoi d'email
        const { data, error } = await supabase.functions.invoke('send-email', {
          body: {
            to: clientEmail,
            subject: subject,
            content: content,
            clientName: clientName
          }
        })

        if (error) throw error
        sendResult = data
        
      } else if (type === 'sms') {
        // Appeler l'edge function pour l'envoi de SMS
        const { data, error } = await supabase.functions.invoke('send-sms', {
          body: {
            to: clientPhone,
            content: content,
            clientName: clientName
          }
        })

        if (error) throw error
        sendResult = data
      }

      // Enregistrer le log de communication avec le statut réel
      const communicationData = {
        client_id: clientId,
        type,
        content,
        subject,
        sent_at: new Date().toISOString(),
        status: (sendResult?.status === 'delivered' ? 'delivered' : 'sent') as 'sent' | 'delivered' | 'failed'
      }

      await logCommunication(communicationData)
      
      if (sendResult?.success) {
        toast({
          title: "Communication envoyée",
          description: `${type === 'email' ? 'Email' : 'SMS'} envoyé avec succès`
        })
        return { success: true, data: sendResult }
      } else {
        throw new Error(sendResult?.error || 'Erreur d\'envoi')
      }
      
    } catch (error: any) {
      // Enregistrer l'échec dans les logs
      const communicationData = {
        client_id: clientId,
        type,
        content,
        subject,
        sent_at: new Date().toISOString(),
        status: 'failed' as const
      }
      
      await logCommunication(communicationData)
      
      toast({
        variant: "destructive",
        title: "Erreur d'envoi",
        description: `Impossible d'envoyer le ${type === 'email' ? 'email' : 'SMS'}: ${error.message}`
      })
      return { success: false, error }
    }
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await Promise.all([
        fetchFollowUps(),
        fetchTemplates(),
        fetchCommunicationLogs()
      ])
      setLoading(false)
    }
    loadData()
  }, [])

  return {
    followUps,
    templates,
    communicationLogs,
    loading,
    updateFollowUp,
    addTemplate,
    logCommunication,
    sendCommunication,
    refetch: () => {
      fetchFollowUps()
      fetchTemplates()
      fetchCommunicationLogs()
    }
  }
}