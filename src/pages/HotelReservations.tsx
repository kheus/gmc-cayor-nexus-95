import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Hotel, Plus, Search, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { HotelReservationForm } from "@/components/forms/HotelReservationForm"
import { useToast } from "@/hooks/use-toast"
import { useHotelReservations } from "@/hooks/useHotelReservations"

export function HotelReservations() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const { toast } = useToast()
  const { reservations, loading } = useHotelReservations()

  const handleNewReservation = async (data: any) => {
    try {
      // Ici vous pourrez intégrer avec votre base de données
      console.log('Nouvelle réservation hôtel:', data)
      
      toast({
        title: "Réservation créée",
        description: "La nouvelle réservation hôtel a été créée avec succès"
      })
      
      return { success: true, message: "Réservation créée avec succès" }
    } catch (error) {
      return { success: false, message: "Erreur lors de la création de la réservation" }
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      confirmed: "default",
      pending: "secondary",
      cancelled: "destructive"
    } as const
    
    const labels = {
      confirmed: "Confirmée",
      pending: "En attente",
      cancelled: "Annulée"
    }
    
    return (
      <Badge variant={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Hotel className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Réservations Hôtels</h1>
          <p className="text-muted-foreground">
            Gestion des réservations hôtelières
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Réservations Actives</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">Ce mois</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux d'Occupation</CardTitle>
            <Hotel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground">Partenaires</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chiffre d'Affaires</CardTitle>
            <Hotel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2M</div>
            <p className="text-xs text-muted-foreground">FCFA ce mois</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfaction</CardTitle>
            <Hotel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8/5</div>
            <p className="text-xs text-muted-foreground">Note moyenne</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Réservations Hôtelières</CardTitle>
              <CardDescription>Gestion des séjours clients</CardDescription>
            </div>
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle Réservation
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <Input
              placeholder="Rechercher une réservation..."
              className="flex-1"
            />
            <Button variant="outline" size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Hôtel</TableHead>
                <TableHead>Check-in</TableHead>
                <TableHead>Check-out</TableHead>
                <TableHead>Chambres</TableHead>
                <TableHead>Prix</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reservations.map((reservation) => (
                <TableRow key={reservation.id}>
                  <TableCell className="font-medium">{reservation.id}</TableCell>
                  <TableCell>Client {reservation.client_id}</TableCell>
                  <TableCell>{reservation.nom_hotel}</TableCell>
                  <TableCell>
                    {new Date(reservation.date_arrivee).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(reservation.date_depart).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {reservation.nombre_chambres} ch. / {reservation.nombre_adultes} pers.
                  </TableCell>
                  <TableCell className="font-semibold">
                    {reservation.prix_total.toLocaleString()} FCFA
                  </TableCell>
                  <TableCell>{getStatusBadge(reservation.statut)}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      Détails
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <HotelReservationForm
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleNewReservation}
      />
    </div>
  )
}