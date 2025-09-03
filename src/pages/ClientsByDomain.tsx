import React from 'react'
import { useParams } from 'react-router-dom'
import { ClientTrackerByDomain } from '@/components/clients/ClientTrackerByDomain'

export default function ClientsByDomain() {
  const { domain } = useParams<{ domain: string }>()
  
  const validDomains = ['immobilier', 'voyage', 'assurance']
  const currentDomain = validDomains.includes(domain || '') ? domain as 'immobilier' | 'voyage' | 'assurance' : 'immobilier'

  return (
    <div className="container mx-auto p-6">
      <ClientTrackerByDomain sector={currentDomain} />
    </div>
  )
}