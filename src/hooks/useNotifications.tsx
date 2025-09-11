import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { useClients } from '@/hooks/useClients'
import { useClientFollowUp } from '@/hooks/useClientFollowUp'
import { Bell, AlertTriangle, CheckCircle, Info, Clock, Users } from 'lucide-react'

export interface GMCNotification {
  id: string
  type: 'warning' | 'info' | 'success' | 'urgent'
  title: string
  message: string
  time: string
  urgent: boolean
  unread: boolean
  icon: any
  source_id?: string
  source_type?: 'client' | 'payment' | 'maintenance' | 'contract'
  action_url?: string
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<GMCNotification[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const { clients } = useClients()
  const { followUps } = useClientFollowUp()

  // Générer des notifications basées sur les données réelles
  const generateNotifications = () => {
    const newNotifications: GMCNotification[] = []
    const now = new Date()

    // 1. Clients à relancer aujourd'hui
    const clientsToFollowToday = followUps.filter(followUp => {
      if (!followUp.next_contact) return false
      const nextContactDate = new Date(followUp.next_contact)
      return nextContactDate.toDateString() === now.toDateString()
    })

    clientsToFollowToday.forEach((followUp, index) => {
      const client = clients.find(c => c.id === followUp.client_id)
      if (client) {
        newNotifications.push({
          id: `follow-up-${followUp.id}`,
          type: 'warning',
          title: 'Client à relancer',
          message: `${client.prenom} ${client.nom} - Contact prévu aujourd'hui`,
          time: 'Aujourd\'hui',
          urgent: followUp.priority === 'high',
          unread: true,
          icon: Clock,
          source_id: client.id,
          source_type: 'client',
          action_url: '/client-tracker'
        })
      }
    })

    // 2. Clients en retard de relance
    const overdueClients = followUps.filter(followUp => {
      if (!followUp.next_contact) return false
      const nextContactDate = new Date(followUp.next_contact)
      return nextContactDate < now
    })

    overdueClients.forEach((followUp, index) => {
      const client = clients.find(c => c.id === followUp.client_id)
      if (client) {
        const daysOverdue = Math.floor((now.getTime() - new Date(followUp.next_contact!).getTime()) / (1000 * 60 * 60 * 24))
        newNotifications.push({
          id: `overdue-${followUp.id}`,
          type: 'urgent',
          title: 'Relance en retard',
          message: `${client.prenom} ${client.nom} - ${daysOverdue} jour(s) de retard`,
          time: `Il y a ${daysOverdue} jour(s)`,
          urgent: true,
          unread: true,
          icon: AlertTriangle,
          source_id: client.id,
          source_type: 'client',
          action_url: '/client-tracker'
        })
      }
    })

    // 3. Nouveaux clients ajoutés récemment
    const recentClients = clients.filter(client => {
      if (!client.created_at) return false
      const createdDate = new Date(client.created_at)
      const daysDiff = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24))
      return daysDiff <= 3
    })

    recentClients.slice(0, 3).forEach((client, index) => {
      const createdDate = new Date(client.created_at!)
      const daysDiff = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24))
      const timeText = daysDiff === 0 ? 'Aujourd\'hui' : 
                      daysDiff === 1 ? 'Hier' : 
                      `Il y a ${daysDiff} jours`

      newNotifications.push({
        id: `new-client-${client.id}`,
        type: 'success',
        title: 'Nouveau client',
        message: `${client.prenom} ${client.nom} a été ajouté`,
        time: timeText,
        urgent: false,
        unread: daysDiff <= 1,
        icon: Users,
        source_id: client.id,
        source_type: 'client',
        action_url: '/clients'
      })
    })

    // 4. Statistiques importantes
    if (clients.length > 0) {
      const totalClients = clients.length
      const activeFollowUps = followUps.filter(f => f.status === 'actif').length
      const prospects = followUps.filter(f => f.status === 'prospect').length

      newNotifications.push({
        id: 'stats-summary',
        type: 'info',
        title: 'Résumé d\'activité',
        message: `${totalClients} clients • ${activeFollowUps} actifs • ${prospects} prospects`,
        time: 'Maintenant',
        urgent: false,
        unread: false,
        icon: Info,
        action_url: '/dashboard'
      })
    }

    // Trier par urgence et date
    newNotifications.sort((a, b) => {
      if (a.urgent && !b.urgent) return -1
      if (!a.urgent && b.urgent) return 1
      if (a.unread && !b.unread) return -1
      if (!a.unread && b.unread) return 1
      return 0
    })

    setNotifications(newNotifications)
  }

  // Marquer une notification comme lue
  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, unread: false }
          : notif
      )
    )
  }

  // Marquer toutes les notifications comme lues
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, unread: false }))
    )
  }

  // Supprimer une notification
  const removeNotification = (notificationId: string) => {
    setNotifications(prev => 
      prev.filter(notif => notif.id !== notificationId)
    )
  }

  // Ajouter une notification personnalisée
  const addNotification = (notification: Omit<GMCNotification, 'id' | 'time' | 'unread'>) => {
    const newNotif: GMCNotification = {
      ...notification,
      id: `custom-${Date.now()}`,
      time: 'Maintenant',
      unread: true
    }
    
    setNotifications(prev => [newNotif, ...prev])
    
    // Afficher aussi un toast pour les notifications importantes
    if (notification.urgent) {
      toast({
        title: notification.title,
        description: notification.message,
        variant: notification.type === 'urgent' ? 'destructive' : 'default'
      })
    }
  }

  // Envoyer une notification de rappel de paiement
  const sendPaymentReminder = (clientName: string, amount: number, dueDate: string) => {
    addNotification({
      type: 'warning',
      title: 'Rappel de paiement envoyé',
      message: `Rappel envoyé à ${clientName} pour ${amount.toLocaleString()} FCFA`,
      urgent: false,
      icon: Bell,
      source_type: 'payment'
    })
  }

  useEffect(() => {
    if (clients.length > 0 || followUps.length > 0) {
      generateNotifications()
      setLoading(false)
    }
  }, [clients, followUps])

  // Actualiser les notifications toutes les 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (clients.length > 0 || followUps.length > 0) {
        generateNotifications()
      }
    }, 5 * 60 * 1000) // 5 minutes

    return () => clearInterval(interval)
  }, [clients, followUps])

  const unreadCount = notifications.filter(n => n.unread).length
  const urgentCount = notifications.filter(n => n.urgent && n.unread).length

  return {
    notifications,
    loading,
    unreadCount,
    urgentCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    addNotification,
    sendPaymentReminder,
    refresh: generateNotifications
  }
}