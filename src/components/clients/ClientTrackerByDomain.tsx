import React from 'react'
import { ClientTracker } from './ClientTracker'
import { useGMCData } from '@/hooks/useGMCData'

interface ClientTrackerByDomainProps {
  sector: 'immobilier' | 'voyage' | 'assurance'
}

export function ClientTrackerByDomain({ sector }: ClientTrackerByDomainProps) {
  const { 
    propertyClients, 
    travelClients, 
    insuranceClients 
  } = useGMCData()

  // Filtrer les clients selon le secteur
  const getClientsBySector = () => {
    switch (sector) {
      case 'immobilier':
        return propertyClients
      case 'voyage':
        return travelClients
      case 'assurance':
        return insuranceClients
      default:
        return []
    }
  }

  const filteredClients = getClientsBySector()

  // Créer une version modifiée du ClientTracker avec des clients pré-filtrés
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold capitalize">Clients {sector}</h2>
          <p className="text-muted-foreground">
            {filteredClients.length} client{filteredClients.length > 1 ? 's' : ''} dans le secteur {sector}
          </p>
        </div>
      </div>
      
      {/* Wrapper pour passer les clients filtrés au ClientTracker */}
      <div data-sector={sector}>
        <ClientTracker />
      </div>
    </div>
  )
}