import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Calendar, CalendarDays, Plane, Search, Users } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const flightSearchSchema = z.object({
  departure: z.string().min(1, "Ville de départ requise"),
  destination: z.string().min(1, "Ville de destination requise"),
  departureDate: z.string().min(1, "Date de départ requise"),
  returnDate: z.string().optional(),
  passengers: z.string().min(1, "Nombre de passagers requis"),
  class: z.string().min(1, "Classe requise")
})

const reservationSchema = z.object({
  clientName: z.string().min(1, "Nom du client requis"),
  clientEmail: z.string().email("Email invalide"),
  clientPhone: z.string().min(1, "Téléphone requis"),
  flightId: z.string().min(1, "Vol requis"),
  passengers: z.number().min(1, "Au moins 1 passager")
})

interface Flight {
  id: string
  airline: string
  flightNumber: string
  departure: string
  destination: string
  departureTime: string
  arrivalTime: string
  price: number
  availableSeats: number
  class: string
}

interface Reservation {
  id: string
  clientName: string
  clientEmail: string
  clientPhone: string
  flight: Flight
  passengers: number
  totalPrice: number
  status: "confirmed" | "pending" | "cancelled"
  createdAt: string
}

export function FlightReservations() {
  const [searchResults, setSearchResults] = useState<Flight[]>([])
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null)
  const { toast } = useToast()

  const searchForm = useForm<z.infer<typeof flightSearchSchema>>({
    resolver: zodResolver(flightSearchSchema),
    defaultValues: {
      departure: "",
      destination: "",
      departureDate: "",
      returnDate: "",
      passengers: "1",
      class: "economy"
    }
  })

  const reservationForm = useForm<z.infer<typeof reservationSchema>>({
    resolver: zodResolver(reservationSchema)
  })

  const onSearchFlights = async (data: z.infer<typeof flightSearchSchema>) => {
    setIsSearching(true)
    
    // Simulation de recherche de vols
    setTimeout(() => {
      const mockFlights: Flight[] = [
        {
          id: "AF001",
          airline: "Air France",
          flightNumber: "AF 785",
          departure: data.departure,
          destination: data.destination,
          departureTime: "08:30",
          arrivalTime: "14:45",
          price: 850000,
          availableSeats: 12,
          class: data.class
        },
        {
          id: "TC002",
          airline: "Turkish Airlines",
          flightNumber: "TK 573",
          departure: data.departure,
          destination: data.destination,
          departureTime: "15:20",
          arrivalTime: "22:10",
          price: 750000,
          availableSeats: 8,
          class: data.class
        }
      ]
      
      setSearchResults(mockFlights)
      setIsSearching(false)
      toast({
        title: "Recherche terminée",
        description: `${mockFlights.length} vols trouvés`
      })
    }, 2000)
  }

  const onReserve = async (data: z.infer<typeof reservationSchema>) => {
    if (!selectedFlight) return

    const newReservation: Reservation = {
      id: `RES${Date.now()}`,
      clientName: data.clientName,
      clientEmail: data.clientEmail,
      clientPhone: data.clientPhone,
      flight: selectedFlight,
      passengers: data.passengers,
      totalPrice: selectedFlight.price * data.passengers,
      status: "confirmed",
      createdAt: new Date().toISOString()
    }

    setReservations(prev => [newReservation, ...prev])
    reservationForm.reset()
    setSelectedFlight(null)
    
    toast({
      title: "Réservation confirmée",
      description: `Réservation ${newReservation.id} créée avec succès`
    })
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      confirmed: "default",
      pending: "secondary",
      cancelled: "destructive"
    } as const
    
    return (
      <Badge variant={variants[status as keyof typeof variants]}>
        {status === "confirmed" ? "Confirmée" : 
         status === "pending" ? "En attente" : "Annulée"}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Plane className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Réservations de Vols</h1>
          <p className="text-muted-foreground">
            Recherchez et réservez des billets d'avion pour vos clients
          </p>
        </div>
      </div>

      {/* Recherche de vols */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Rechercher des vols
          </CardTitle>
          <CardDescription>
            Trouvez les meilleurs vols selon vos critères
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...searchForm}>
            <form onSubmit={searchForm.handleSubmit(onSearchFlights)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <FormField
                  control={searchForm.control}
                  name="departure"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Départ</FormLabel>
                      <FormControl>
                        <Input placeholder="Dakar" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={searchForm.control}
                  name="destination"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Destination</FormLabel>
                      <FormControl>
                        <Input placeholder="Paris" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={searchForm.control}
                  name="departureDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date de départ</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={searchForm.control}
                  name="passengers"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Passagers</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[1,2,3,4,5,6,7,8,9].map(num => (
                            <SelectItem key={num} value={num.toString()}>
                              {num} passager{num > 1 ? 's' : ''}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="flex gap-4 items-end">
                <FormField
                  control={searchForm.control}
                  name="class"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Classe</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="economy">Économique</SelectItem>
                          <SelectItem value="business">Affaires</SelectItem>
                          <SelectItem value="first">Première</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" disabled={isSearching}>
                  {isSearching ? "Recherche..." : "Rechercher"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Résultats de recherche */}
      {searchResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Vols disponibles</CardTitle>
            <CardDescription>
              {searchResults.length} vol(s) trouvé(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {searchResults.map((flight) => (
                <div key={flight.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <div className="text-lg font-semibold">{flight.airline}</div>
                      <Badge variant="outline">{flight.flightNumber}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {flight.departure} → {flight.destination}
                    </div>
                    <div className="text-sm mt-1">
                      Départ: {flight.departureTime} | Arrivée: {flight.arrivalTime}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary">
                      {flight.price.toLocaleString()} FCFA
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {flight.availableSeats} sièges disponibles
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          className="mt-2" 
                          onClick={() => setSelectedFlight(flight)}
                        >
                          Réserver
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Réserver ce vol</DialogTitle>
                        </DialogHeader>
                        <Form {...reservationForm}>
                          <form onSubmit={reservationForm.handleSubmit(onReserve)} className="space-y-4">
                            <FormField
                              control={reservationForm.control}
                              name="clientName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Nom du client</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={reservationForm.control}
                              name="clientEmail"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Email</FormLabel>
                                  <FormControl>
                                    <Input type="email" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={reservationForm.control}
                              name="clientPhone"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Téléphone</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={reservationForm.control}
                              name="passengers"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Nombre de passagers</FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="number" 
                                      min="1" 
                                      max={flight.availableSeats}
                                      {...field} 
                                      onChange={e => field.onChange(parseInt(e.target.value))}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <Button type="submit" className="w-full">
                              Confirmer la réservation
                            </Button>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Liste des réservations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            Réservations récentes
          </CardTitle>
          <CardDescription>
            Historique des réservations de vols
          </CardDescription>
        </CardHeader>
        <CardContent>
          {reservations.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Aucune réservation pour le moment
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Réservation</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Vol</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Passagers</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reservations.map((reservation) => (
                  <TableRow key={reservation.id}>
                    <TableCell className="font-medium">{reservation.id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{reservation.clientName}</div>
                        <div className="text-sm text-muted-foreground">{reservation.clientEmail}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{reservation.flight.airline}</div>
                        <div className="text-sm text-muted-foreground">{reservation.flight.flightNumber}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {reservation.flight.departure} → {reservation.flight.destination}
                    </TableCell>
                    <TableCell>{reservation.passengers}</TableCell>
                    <TableCell className="font-semibold">
                      {reservation.totalPrice.toLocaleString()} FCFA
                    </TableCell>
                    <TableCell>{getStatusBadge(reservation.status)}</TableCell>
                    <TableCell>
                      {new Date(reservation.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}