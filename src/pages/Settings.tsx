import { Settings, Building, Users, FileText } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-primary">Paramètres</h1>
        <p className="text-muted-foreground">Configuration de l'agence GMC Immobilier</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Informations de l'Agence
            </CardTitle>
            <CardDescription>
              Détails de votre agence immobilière
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="agency-name">Nom de l'agence</Label>
              <Input id="agency-name" defaultValue="GMC Immobilier" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="agency-address">Adresse</Label>
              <Textarea id="agency-address" defaultValue="Dakar, Sénégal" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input id="phone" defaultValue="+221 77 xxx xx xx" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="contact@gmc-immobilier.sn" />
              </div>
            </div>
            <Button>Sauvegarder</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Compagnies d'Assurance
            </CardTitle>
            <CardDescription>
              Gestion des partenaires assurance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Compagnies partenaires</Label>
              <div className="space-y-2">
                <Input defaultValue="AXA Assurances" />
                <Input defaultValue="Allianz Sénégal" />
                <Input defaultValue="NSIA Assurances" />
                <Input defaultValue="MAIF" />
              </div>
            </div>
            <Button variant="outline">Ajouter Compagnie</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Configuration Financière
            </CardTitle>
            <CardDescription>
              Paramètres de facturation et devise
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currency">Devise</Label>
              <Input id="currency" defaultValue="CFA (Franc CFA)" disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tax-rate">Taux de TVA (%)</Label>
              <Input id="tax-rate" type="number" defaultValue="18" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="commission">Commission agence (%)</Label>
              <Input id="commission" type="number" defaultValue="10" />
            </div>
            <Button>Sauvegarder</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Préférences Système
            </CardTitle>
            <CardDescription>
              Configuration générale de l'application
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="alert-days">Alertes d'échéance (jours)</Label>
              <Input id="alert-days" type="number" defaultValue="30" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="backup-frequency">Fréquence de sauvegarde</Label>
              <Input id="backup-frequency" defaultValue="Quotidienne" />
            </div>
            <Button>Sauvegarder</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}