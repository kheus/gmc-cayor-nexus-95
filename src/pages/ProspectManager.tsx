import { ProspectManager } from '@/components/prospects/ProspectManager'

export default function ProspectManagerPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Gestionnaire de Prospects</h1>
        <p className="text-muted-foreground">
          Gérez efficacement vos prospects avec suivi personnalisé et actions rapides
        </p>
      </div>
      <ProspectManager />
    </div>
  )
}