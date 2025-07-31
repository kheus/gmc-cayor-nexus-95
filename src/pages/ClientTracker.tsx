import { ClientTracker } from '@/components/clients/ClientTracker'

export default function ClientTrackerPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Suivi des Clients</h1>
        <p className="text-muted-foreground">
          Gérez vos clients actifs, prospects et relances avec communication professionnelle
        </p>
      </div>
      <ClientTracker />
    </div>
  )
}