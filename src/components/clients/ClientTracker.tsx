import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useClients } from '@/hooks/useClients'
import { useClientFollowUp } from '@/hooks/useClientFollowUp'
import { ProspectManager } from '@/components/prospects/ProspectManager'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { 
  Users, 
  UserCheck, 
  UserX, 
  UserPlus, 
  Mail, 
  MessageSquare, 
  Phone,
  Calendar as CalendarIcon,
  Filter,
  Send,
  Plus,
  Clock,
  AlertTriangle,
  TrendingUp
} from 'lucide-react'

export function ClientTracker() {
  const { clients, loading: clientsLoading } = useClients()
  const { 
    followUps, 
    templates, 
    communicationLogs, 
    loading: followUpLoading,
    updateFollowUp,
    sendCommunication,
    addTemplate 
  } = useClientFollowUp()
  
  const [selectedTab, setSelectedTab] = useState('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSector, setSelectedSector] = useState<string>('all')
  const [newCommunication, setNewCommunication] = useState({
    clientId: '',
    type: 'email' as 'email' | 'sms',
    subject: '',
    content: '',
    templateId: ''
  })
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [isCommDialogOpen, setIsCommDialogOpen] = useState(false)
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false)
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    type: 'email' as 'email' | 'sms',
    subject: '',
    content: '',
    sector: 'general' as string,
    target_status: 'prospect' as string
  })

  // Statistiques des clients
  const clientStats = useMemo(() => {
    const followUpMap = new Map(followUps.map(f => [f.client_id, f]))
    
    const stats = {
      total: clients.length,
      actifs: 0,
      prospects: 0,
      aRelancer: 0,
      inactifs: 0
    }

    clients.forEach(client => {
      const followUp = followUpMap.get(client.id)
      const status = followUp?.status || (client.statut === 'actif' ? 'actif' : 'prospect')
      
      switch (status) {
        case 'actif':
          stats.actifs++
          break
        case 'prospect':
          stats.prospects++
          break
        case 'a_relancer':
          stats.aRelancer++
          break
        case 'inactif':
          stats.inactifs++
          break
      }
    })

    return stats
  }, [clients, followUps])

  // Clients filtrés avec statut de suivi - FILTRE PAR SECTEUR POUR LE MODULE COURANT
  const filteredClients = useMemo(() => {
    const followUpMap = new Map(followUps.map(f => [f.client_id, f]))
    
    return clients
      .map(client => ({
        ...client,
        followUp: followUpMap.get(client.id),
        trackingStatus: followUpMap.get(client.id)?.status || (client.statut === 'actif' ? 'actif' : 'prospect')
      }))
      .filter(client => {
        const matchesSearch = searchTerm === '' || 
          client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.email.toLowerCase().includes(searchTerm.toLowerCase())
        
        const matchesSector = selectedSector === 'all' || 
          client.secteurs.includes(selectedSector as any)
        
        return matchesSearch && matchesSector
      })
      .sort((a, b) => {
        if (a.followUp?.next_contact && b.followUp?.next_contact) {
          return new Date(a.followUp.next_contact).getTime() - new Date(b.followUp.next_contact).getTime()
        }
        if (a.followUp?.next_contact) return -1
        if (b.followUp?.next_contact) return 1
        return 0
      })
  }, [clients, followUps, searchTerm, selectedSector])

  // Clients à relancer aujourd'hui
  const clientsToFollow = useMemo(() => {
    const today = new Date().toISOString().split('T')[0]
    return filteredClients.filter(client => 
      client.followUp?.next_contact && 
      client.followUp.next_contact.split('T')[0] <= today
    )
  }, [filteredClients])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'actif': return 'bg-success/10 text-success border-success/20'
      case 'prospect': return 'bg-primary/10 text-primary border-primary/20'
      case 'a_relancer': return 'bg-warning/10 text-warning border-warning/20'
      case 'inactif': return 'bg-muted/50 text-muted-foreground border-border'
      default: return 'bg-muted/50 text-muted-foreground border-border'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-destructive/10 text-destructive border-destructive/20'
      case 'medium': return 'bg-warning/10 text-warning border-warning/20'
      case 'low': return 'bg-success/10 text-success border-success/20'
      default: return 'bg-muted/50 text-muted-foreground border-border'
    }
  }

  const handleSendCommunication = async () => {
    if (!newCommunication.clientId || !newCommunication.content) return

    const result = await sendCommunication(
      newCommunication.clientId,
      newCommunication.type,
      newCommunication.content,
      newCommunication.subject
    )

    if (result.success) {
      setNewCommunication({
        clientId: '',
        type: 'email',
        subject: '',
        content: '',
        templateId: ''
      })
      setIsCommDialogOpen(false)
    }
  }

  const handleAddTemplate = async () => {
    if (!newTemplate.name || !newTemplate.content) return

    const result = await addTemplate({
      name: newTemplate.name,
      type: newTemplate.type,
      subject: newTemplate.subject,
      content: newTemplate.content,
      sector: newTemplate.sector === 'general' ? undefined : newTemplate.sector as any,
      target_status: newTemplate.target_status as any
    })

    if (result.success) {
      setNewTemplate({
        name: '',
        type: 'email',
        subject: '',
        content: '',
        sector: 'general',
        target_status: 'prospect'
      })
      setIsTemplateDialogOpen(false)
    }
  }

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId)
    if (template) {
      setNewCommunication(prev => ({
        ...prev,
        templateId,
        type: template.type,
        subject: template.subject || '',
        content: template.content
      }))
    }
  }

  if (clientsLoading || followUpLoading) {
    return <div className="flex items-center justify-center h-96">Chargement...</div>
  }

  return (
    <div className="space-y-6">

      {/* Onglets principaux */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="to-follow">À suivre ({clientsToFollow.length})</TabsTrigger>
          <TabsTrigger value="prospects">Prospects</TabsTrigger>
          <TabsTrigger value="communications">Communications</TabsTrigger>
          <TabsTrigger value="templates">Modèles</TabsTrigger>
        </TabsList>

        {/* Actions & Filtres */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1 flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Rechercher un client..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-10"
              />
            </div>
            <Select value={selectedSector} onValueChange={setSelectedSector}>
              <SelectTrigger className="w-full sm:w-48 h-10">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Tous les secteurs" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les secteurs</SelectItem>
                <SelectItem value="immobilier">Immobilier</SelectItem>
                <SelectItem value="voyage">Voyage</SelectItem>
                <SelectItem value="assurance">Assurance</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Dialog open={isCommDialogOpen} onOpenChange={setIsCommDialogOpen}>
            <DialogTrigger asChild>
              <Button className="h-10 whitespace-nowrap bg-gradient-primary hover:bg-gradient-primary-hover">
                <Send className="h-4 w-4 mr-2" />
                Nouvelle Communication
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Envoyer une Communication</DialogTitle>
                <DialogDescription>
                  Sélectionnez un client et rédigez votre message
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Client</Label>
                    <Select value={newCommunication.clientId} onValueChange={(value) => 
                      setNewCommunication(prev => ({ ...prev, clientId: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un client" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredClients.map(client => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.prenom} {client.nom}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Type</Label>
                    <Select value={newCommunication.type} onValueChange={(value: 'email' | 'sms') => 
                      setNewCommunication(prev => ({ ...prev, type: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="sms">SMS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Modèle (optionnel)</Label>
                  <Select value={newCommunication.templateId} onValueChange={handleTemplateSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir un modèle" />
                    </SelectTrigger>
                    <SelectContent>
                      {templates
                        .filter(t => t.type === newCommunication.type)
                        .map(template => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {newCommunication.type === 'email' && (
                  <div>
                    <Label>Sujet</Label>
                    <Input
                      value={newCommunication.subject}
                      onChange={(e) => setNewCommunication(prev => ({ ...prev, subject: e.target.value }))}
                      placeholder="Sujet de l'email"
                    />
                  </div>
                )}

                <div>
                  <Label>Message</Label>
                  <Textarea
                    value={newCommunication.content}
                    onChange={(e) => setNewCommunication(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Votre message..."
                    rows={6}
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsCommDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleSendCommunication}>
                    <Send className="h-4 w-4 mr-2" />
                    Envoyer
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4">
            {filteredClients.map(client => (
              <Card key={client.id} className="hover:shadow-elegant transition-all duration-300 border-border/50">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground text-lg">{client.prenom} {client.nom}</h3>
                          <p className="text-sm text-muted-foreground">{client.email} • {client.telephone}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Badge className={`${getStatusColor(client.trackingStatus)} border`}>
                            {client.trackingStatus === 'actif' ? 'Actif' :
                             client.trackingStatus === 'prospect' ? 'Prospect' :
                             client.trackingStatus === 'a_relancer' ? 'À relancer' : 'Inactif'}
                          </Badge>
                          {client.followUp?.priority && (
                            <Badge className={`${getPriorityColor(client.followUp.priority)} border`}>
                              {client.followUp.priority === 'high' ? 'Haute' :
                               client.followUp.priority === 'medium' ? 'Moyenne' : 'Basse'}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {client.secteurs.map(secteur => (
                          <Badge key={secteur} variant="outline" className="text-xs bg-secondary/50">
                            {secteur}
                          </Badge>
                        ))}
                      </div>
                      {client.followUp?.notes && (
                        <div className="mt-3 p-3 bg-muted/30 rounded-lg">
                          <p className="text-sm text-muted-foreground">{client.followUp.notes}</p>
                        </div>
                      )}
                    </div>
                    <div className="text-right space-y-2">
                      {client.followUp?.last_contact && (
                        <div className="text-sm text-muted-foreground">
                          <span className="font-medium">Dernier contact:</span>
                          <br />
                          {format(new Date(client.followUp.last_contact), 'dd MMM yyyy', { locale: fr })}
                        </div>
                      )}
                      {client.followUp?.next_contact && (
                        <div className="text-sm">
                          <span className="font-medium text-foreground">Prochain contact:</span>
                          <br />
                          <span className="text-primary font-medium">
                            {format(new Date(client.followUp.next_contact), 'dd MMM yyyy', { locale: fr })}
                          </span>
                        </div>
                      )}
                      <div className="mt-2 flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => {
                          setNewCommunication(prev => ({ ...prev, clientId: client.id, type: 'email' }))
                          setIsCommDialogOpen(true)
                        }}>
                          <Mail className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => {
                          setNewCommunication(prev => ({ ...prev, clientId: client.id, type: 'sms' }))
                          setIsCommDialogOpen(true)
                        }}>
                          <MessageSquare className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="to-follow" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Clients à contacter aujourd'hui
              </CardTitle>
              <CardDescription>
                {clientsToFollow.length} client(s) à relancer
              </CardDescription>
            </CardHeader>
            <CardContent>
              {clientsToFollow.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Aucun client à relancer aujourd'hui
                </p>
              ) : (
                <div className="space-y-3">
                  {clientsToFollow.map(client => (
                    <div key={client.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{client.prenom} {client.nom}</h4>
                        <p className="text-sm text-muted-foreground">{client.email}</p>
                        <p className="text-xs text-red-600">
                          À contacter le {format(new Date(client.followUp!.next_contact!), 'dd MMM yyyy', { locale: fr })}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" onClick={() => {
                          setNewCommunication(prev => ({ ...prev, clientId: client.id, type: 'email' }))
                          setIsCommDialogOpen(true)
                        }}>
                          <Mail className="h-3 w-3 mr-1" />
                          Email
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => {
                          setNewCommunication(prev => ({ ...prev, clientId: client.id, type: 'sms' }))
                          setIsCommDialogOpen(true)
                        }}>
                          <MessageSquare className="h-3 w-3 mr-1" />
                          SMS
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prospects" className="space-y-4">
          <ProspectManager />
        </TabsContent>

        <TabsContent value="communications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historique des Communications</CardTitle>
              <CardDescription>Toutes les communications envoyées</CardDescription>
            </CardHeader>
            <CardContent>
              {communicationLogs.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Aucune communication enregistrée
                </p>
              ) : (
                <div className="space-y-3">
                  {communicationLogs.slice(0, 10).map(log => (
                    <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          {log.type === 'email' ? 
                            <Mail className="h-4 w-4 text-blue-600" /> : 
                            <MessageSquare className="h-4 w-4 text-green-600" />
                          }
                          <span className="font-medium">{log.subject || `${log.type.toUpperCase()}`}</span>
                          <Badge variant={log.status === 'sent' ? 'default' : 'destructive'}>
                            {log.status === 'sent' ? 'Envoyé' : 'Échec'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {format(new Date(log.sent_at), 'dd MMM yyyy à HH:mm', { locale: fr })}
                        </p>
                        {log.content && (
                          <p className="text-sm mt-2 line-clamp-2">{log.content}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="flex justify-end">
            <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau Modèle
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Créer un Modèle</DialogTitle>
                  <DialogDescription>
                    Créez un modèle réutilisable pour vos communications
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Nom du modèle</Label>
                    <Input
                      value={newTemplate.name}
                      onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Ex: Relance prospect immobilier"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Type</Label>
                      <Select value={newTemplate.type} onValueChange={(value: 'email' | 'sms') => 
                        setNewTemplate(prev => ({ ...prev, type: value }))
                      }>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="sms">SMS</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Secteur</Label>
                      <Select value={newTemplate.sector} onValueChange={(value) => 
                        setNewTemplate(prev => ({ ...prev, sector: value }))
                      }>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">Général</SelectItem>
                          <SelectItem value="immobilier">Immobilier</SelectItem>
                          <SelectItem value="voyage">Voyage</SelectItem>
                          <SelectItem value="assurance">Assurance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  {newTemplate.type === 'email' && (
                    <div>
                      <Label>Sujet</Label>
                      <Input
                        value={newTemplate.subject}
                        onChange={(e) => setNewTemplate(prev => ({ ...prev, subject: e.target.value }))}
                        placeholder="Sujet de l'email"
                      />
                    </div>
                  )}
                  <div>
                    <Label>Contenu</Label>
                    <Textarea
                      value={newTemplate.content}
                      onChange={(e) => setNewTemplate(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Votre message..."
                      rows={6}
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsTemplateDialogOpen(false)}>
                      Annuler
                    </Button>
                    <Button onClick={handleAddTemplate}>
                      Créer le Modèle
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {templates.map(template => (
              <Card key={template.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold">{template.name}</h3>
                        <Badge variant="outline">
                          {template.type === 'email' ? 'Email' : 'SMS'}
                        </Badge>
                        {template.sector && (
                          <Badge variant="secondary">{template.sector}</Badge>
                        )}
                      </div>
                      {template.subject && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Sujet: {template.subject}
                        </p>
                      )}
                      <p className="text-sm mt-2 line-clamp-3">{template.content}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setNewCommunication(prev => ({
                          ...prev,
                          templateId: template.id,
                          type: template.type,
                          subject: template.subject || '',
                          content: template.content
                        }))
                        setIsCommDialogOpen(true)
                      }}
                    >
                      Utiliser
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}