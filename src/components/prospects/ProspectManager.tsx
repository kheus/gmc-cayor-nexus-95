import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useClients } from '@/hooks/useClients'
import { useClientFollowUp } from '@/hooks/useClientFollowUp'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { 
  UserPlus, 
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Phone,
  Mail,
  MessageSquare,
  Calendar as CalendarIcon,
  Search,
  Filter,
  Plus,
  TrendingUp,
  Target,
  Zap
} from 'lucide-react'

export function ProspectManager() {
  const { clients, loading: clientsLoading, addClient, deleteClient } = useClients()
  const { 
    followUps, 
    templates,
    communicationLogs,
    loading: followUpLoading,
    updateFollowUp,
    sendCommunication
  } = useClientFollowUp()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [sectorFilter, setSectorFilter] = useState<string>('all')
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [isAddProspectOpen, setIsAddProspectOpen] = useState(false)
  const [isFollowUpOpen, setIsFollowUpOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState<any>(null)
  
  const [newProspect, setNewProspect] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    adresse: '',
    ville: '',
    secteurs: ['immobilier'] as string[],
    source: '',
    notes: '',
    priority: 'medium' as 'low' | 'medium' | 'high'
  })

  const [followUpData, setFollowUpData] = useState({
    next_contact: '',
    contact_type: 'email' as 'email' | 'sms' | 'phone' | 'meeting',
    notes: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    status: 'prospect' as 'prospect' | 'actif' | 'a_relancer' | 'inactif'
  })

  // Prospects avec leur statut de suivi
  const prospects = useMemo(() => {
    const followUpMap = new Map(followUps.map(f => [f.client_id, f]))
    
    return clients
      .filter(client => {
        const followUp = followUpMap.get(client.id)
        const status = followUp?.status || 'prospect'
        return status === 'prospect' || status === 'a_relancer'
      })
      .map(client => ({
        ...client,
        followUp: followUpMap.get(client.id),
        trackingStatus: followUpMap.get(client.id)?.status || 'prospect'
      }))
      .filter(prospect => {
        const matchesSearch = searchTerm === '' || 
          prospect.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          prospect.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          prospect.email.toLowerCase().includes(searchTerm.toLowerCase())
        
        const matchesStatus = statusFilter === 'all' || prospect.trackingStatus === statusFilter
        const matchesPriority = priorityFilter === 'all' || prospect.followUp?.priority === priorityFilter
        const matchesSector = sectorFilter === 'all' || prospect.secteurs.includes(sectorFilter as any)
        
        return matchesSearch && matchesStatus && matchesPriority && matchesSector
      })
      .sort((a, b) => {
        // Trier par priorité puis par date de prochain contact
        const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 }
        const aPriority = priorityOrder[a.followUp?.priority as keyof typeof priorityOrder] || 1
        const bPriority = priorityOrder[b.followUp?.priority as keyof typeof priorityOrder] || 1
        
        if (aPriority !== bPriority) return bPriority - aPriority
        
        if (a.followUp?.next_contact && b.followUp?.next_contact) {
          return new Date(a.followUp.next_contact).getTime() - new Date(b.followUp.next_contact).getTime()
        }
        return 0
      })
  }, [clients, followUps, searchTerm, statusFilter, priorityFilter, sectorFilter])

  // Statistiques des prospects
  const prospectStats = useMemo(() => {
    const stats = {
      total: prospects.length,
      nouveaux: prospects.filter(p => !p.followUp?.last_contact).length,
      aContacter: prospects.filter(p => {
        if (!p.followUp?.next_contact) return false
        const today = new Date().toISOString().split('T')[0]
        return p.followUp.next_contact.split('T')[0] <= today
      }).length,
      enRetard: prospects.filter(p => {
        if (!p.followUp?.next_contact) return false
        const today = new Date().toISOString().split('T')[0]
        return p.followUp.next_contact.split('T')[0] < today
      }).length,
      chauds: prospects.filter(p => p.followUp?.priority === 'high').length
    }
    return stats
  }, [prospects])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'prospect': return 'bg-blue-100 text-blue-800'
      case 'a_relancer': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleAddProspect = async () => {
    if (!newProspect.nom || !newProspect.prenom || !newProspect.email) return

    // Créer le client sans les champs qui n'existent pas dans la table clients
    const clientData = {
      nom: newProspect.nom,
      prenom: newProspect.prenom,
      email: newProspect.email,
      telephone: newProspect.telephone,
      adresse: newProspect.adresse,
      ville: newProspect.ville,
      secteurs: newProspect.secteurs as ('immobilier' | 'voyage' | 'assurance')[],
      statut: 'actif' as const
    }

    const result = await addClient(clientData)

    if (result.success) {
      // Créer le suivi initial avec les champs notes et priority
      await updateFollowUp({
        client_id: result.data.id,
        status: 'prospect',
        priority: newProspect.priority,
        notes: `Source: ${newProspect.source || 'Non spécifiée'}\n${newProspect.notes}`
      })

      setNewProspect({
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        adresse: '',
        ville: '',
        secteurs: ['immobilier'],
        source: '',
        notes: '',
        priority: 'medium'
      })
      setIsAddProspectOpen(false)
    }
  }

  const handleUpdateFollowUp = async () => {
    if (!selectedClient) return

    const result = await updateFollowUp({
      client_id: selectedClient.id,
      ...followUpData
    })

    if (result.success) {
      setIsFollowUpOpen(false)
      setSelectedClient(null)
      setFollowUpData({
        next_contact: '',
        contact_type: 'email',
        notes: '',
        priority: 'medium',
        status: 'prospect'
      })
    }
  }

  const handleQuickAction = async (clientId: string, action: 'appele' | 'interesse' | 'pas_interesse') => {
    const now = new Date()
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    
    switch (action) {
      case 'appele':
        await updateFollowUp({
          client_id: clientId,
          last_contact: now.toISOString(),
          contact_type: 'phone',
          status: 'a_relancer',
          notes: 'Client contacté par téléphone'
        })
        break
      case 'interesse':
        // Convertir le prospect en client actif
        await updateFollowUp({
          client_id: clientId,
          status: 'actif',
          priority: 'high',
          last_contact: now.toISOString(),
          notes: 'Prospect converti en client - intéressé par nos services'
        })
        break
      case 'pas_interesse':
        // Supprimer le prospect de la base de données
        await deleteClient(clientId)
        break
    }
  }

  if (clientsLoading || followUpLoading) {
    return <div className="flex items-center justify-center h-96">Chargement...</div>
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Total Prospects</p>
                <p className="text-2xl font-bold">{prospectStats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <UserPlus className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium">Nouveaux</p>
                <p className="text-2xl font-bold">{prospectStats.nouveaux}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-orange-600" />
              <div>
                <p className="text-sm font-medium">À Contacter</p>
                <p className="text-2xl font-bold">{prospectStats.aContacter}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <div>
                <p className="text-sm font-medium">En Retard</p>
                <p className="text-2xl font-bold">{prospectStats.enRetard}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-yellow-600" />
              <div>
                <p className="text-sm font-medium">Prospects Chauds</p>
                <p className="text-2xl font-bold">{prospectStats.chauds}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Barre d'actions et filtres */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
            <Input
              placeholder="Rechercher un prospect..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="prospect">Prospect</SelectItem>
              <SelectItem value="a_relancer">À relancer</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Priorité" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes</SelectItem>
              <SelectItem value="high">Haute</SelectItem>
              <SelectItem value="medium">Moyenne</SelectItem>
              <SelectItem value="low">Basse</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sectorFilter} onValueChange={setSectorFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Secteur" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="immobilier">Immobilier</SelectItem>
              <SelectItem value="voyage">Voyage</SelectItem>
              <SelectItem value="assurance">Assurance</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Dialog open={isAddProspectOpen} onOpenChange={setIsAddProspectOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nouveau Prospect
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Ajouter un Nouveau Prospect</DialogTitle>
              <DialogDescription>
                Saisissez les informations du prospect
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Nom *</Label>
                  <Input
                    value={newProspect.nom}
                    onChange={(e) => setNewProspect(prev => ({ ...prev, nom: e.target.value }))}
                    placeholder="Nom de famille"
                  />
                </div>
                <div>
                  <Label>Prénom *</Label>
                  <Input
                    value={newProspect.prenom}
                    onChange={(e) => setNewProspect(prev => ({ ...prev, prenom: e.target.value }))}
                    placeholder="Prénom"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Email *</Label>
                  <Input
                    type="email"
                    value={newProspect.email}
                    onChange={(e) => setNewProspect(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="email@exemple.com"
                  />
                </div>
                <div>
                  <Label>Téléphone</Label>
                  <Input
                    value={newProspect.telephone}
                    onChange={(e) => setNewProspect(prev => ({ ...prev, telephone: e.target.value }))}
                    placeholder="06 XX XX XX XX"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Secteur d'intérêt</Label>
                  <Select value={newProspect.secteurs[0]} onValueChange={(value) => 
                    setNewProspect(prev => ({ ...prev, secteurs: [value] }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immobilier">Immobilier</SelectItem>
                      <SelectItem value="voyage">Voyage</SelectItem>
                      <SelectItem value="assurance">Assurance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Priorité</Label>
                  <Select value={newProspect.priority} onValueChange={(value: 'low' | 'medium' | 'high') => 
                    setNewProspect(prev => ({ ...prev, priority: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Basse</SelectItem>
                      <SelectItem value="medium">Moyenne</SelectItem>
                      <SelectItem value="high">Haute</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Adresse</Label>
                <Input
                  value={newProspect.adresse}
                  onChange={(e) => setNewProspect(prev => ({ ...prev, adresse: e.target.value }))}
                  placeholder="Adresse complète"
                />
              </div>

              <div>
                <Label>Source du prospect</Label>
                <Input
                  value={newProspect.source}
                  onChange={(e) => setNewProspect(prev => ({ ...prev, source: e.target.value }))}
                  placeholder="Site web, recommandation, publicité..."
                />
              </div>

              <div>
                <Label>Notes</Label>
                <Textarea
                  value={newProspect.notes}
                  onChange={(e) => setNewProspect(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Notes sur le prospect..."
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddProspectOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleAddProspect}>
                  Ajouter le Prospect
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Liste des prospects */}
      <div className="grid gap-4">
        {prospects.map(prospect => (
          <Card key={prospect.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div>
                      <h3 className="font-semibold">{prospect.prenom} {prospect.nom}</h3>
                      <p className="text-sm text-muted-foreground">{prospect.email} • {prospect.telephone}</p>
                    </div>
                    <Badge className={getStatusColor(prospect.trackingStatus)}>
                      {prospect.trackingStatus === 'prospect' ? 'Nouveau Prospect' : 'À Relancer'}
                    </Badge>
                    {prospect.followUp?.priority && (
                      <Badge className={getPriorityColor(prospect.followUp.priority)}>
                        {prospect.followUp.priority === 'high' ? 'Priorité Haute' :
                         prospect.followUp.priority === 'medium' ? 'Priorité Moyenne' : 'Priorité Basse'}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-2">
                    {prospect.secteurs.map(secteur => (
                      <Badge key={secteur} variant="outline" className="text-xs">
                        {secteur}
                      </Badge>
                    ))}
                  </div>

                  {prospect.followUp?.notes && (
                    <p className="text-sm text-muted-foreground mb-2">{prospect.followUp.notes}</p>
                  )}

                  {prospect.followUp?.next_contact && (
                    <p className="text-sm font-medium">
                      Prochain contact: {format(new Date(prospect.followUp.next_contact), 'dd MMM yyyy', { locale: fr })}
                    </p>
                  )}
                </div>

                <div className="flex flex-col space-y-2">
                  {/* Actions rapides */}
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleQuickAction(prospect.id, 'appele')}
                    >
                      <Phone className="h-4 w-4 mr-1" />
                      Appelé
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleQuickAction(prospect.id, 'interesse')}
                      className="text-green-600 border-green-200"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Intéressé
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleQuickAction(prospect.id, 'pas_interesse')}
                      className="text-red-600 border-red-200"
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Pas intéressé
                    </Button>
                  </div>

                  {/* Planifier suivi */}
                  <Button
                    size="sm"
                    onClick={() => {
                      setSelectedClient(prospect)
                      setIsFollowUpOpen(true)
                    }}
                  >
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    Planifier Suivi
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {prospects.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <UserPlus className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">Aucun prospect trouvé</h3>
            <p className="text-muted-foreground mb-4">
              Ajoutez votre premier prospect pour commencer le suivi
            </p>
            <Button onClick={() => setIsAddProspectOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un Prospect
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Dialog de planification de suivi */}
      <Dialog open={isFollowUpOpen} onOpenChange={setIsFollowUpOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Planifier le Suivi</DialogTitle>
            <DialogDescription>
              Programmez le prochain contact avec {selectedClient?.prenom} {selectedClient?.nom}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Date du prochain contact</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, 'dd MMM yyyy', { locale: fr }) : 'Sélectionner une date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => {
                        setSelectedDate(date)
                        setFollowUpData(prev => ({ 
                          ...prev, 
                          next_contact: date ? date.toISOString() : ''
                        }))
                      }}
                      locale={fr}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label>Type de contact</Label>
                <Select value={followUpData.contact_type} onValueChange={(value: 'email' | 'sms' | 'phone' | 'meeting') => 
                  setFollowUpData(prev => ({ ...prev, contact_type: value }))
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="phone">Téléphone</SelectItem>
                    <SelectItem value="meeting">Rendez-vous</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Priorité</Label>
                <Select value={followUpData.priority} onValueChange={(value: 'low' | 'medium' | 'high') => 
                  setFollowUpData(prev => ({ ...prev, priority: value }))
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Basse</SelectItem>
                    <SelectItem value="medium">Moyenne</SelectItem>
                    <SelectItem value="high">Haute</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Statut</Label>
                <Select value={followUpData.status} onValueChange={(value: 'prospect' | 'actif' | 'a_relancer' | 'inactif') => 
                  setFollowUpData(prev => ({ ...prev, status: value }))
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="prospect">Prospect</SelectItem>
                    <SelectItem value="a_relancer">À relancer</SelectItem>
                    <SelectItem value="actif">Client actif</SelectItem>
                    <SelectItem value="inactif">Inactif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Notes</Label>
              <Textarea
                value={followUpData.notes}
                onChange={(e) => setFollowUpData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Notes sur le suivi..."
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsFollowUpOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleUpdateFollowUp}>
                Programmer le Suivi
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}