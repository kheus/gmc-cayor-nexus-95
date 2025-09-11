// Types pour le système GMC complet (Immobilier + Voyage)

// Types de base commune
export interface BaseGMCEntity {
  id: string
  created_at?: string
  updated_at?: string
}

// SECTION CLIENT UNIFIÉ
export interface Client extends BaseGMCEntity {
  // Informations de base (communes à tous les secteurs)
  nom: string
  prenom: string
  email: string
  telephone: string
  adresse: string
  ville?: string
  
  // Secteurs d'activité du client
  secteurs: ('immobilier' | 'voyage' | 'assurance')[]
  
  // Informations générales
  statut?: 'actif' | 'inactif' | 'suspendu'
  date_naissance?: string
  nationalite?: string
  
  // Champs spécifiques immobilier
  profession?: string
  
  // Champs spécifiques voyage  
  type_voyageur?: 'individuel' | 'groupe' | 'entreprise'
  numero_passeport?: string
  
  // Champs spécifiques assurance
  numero_permis?: string
  type_client?: 'particulier' | 'entreprise'
  
  // Préférences générales
  preferences?: string
}

export interface Property extends BaseGMCEntity {
  nom: string
  adresse: string
  type: 'appartement' | 'maison' | 'commercial' | 'terrain'
  surface?: number
  prix_location?: number
  statut: 'libre' | 'occupee' | 'maintenance'
  client_id?: string
}

export interface PropertyContract extends BaseGMCEntity {
  client_id: string
  property_id: string
  date_debut: string
  date_fin: string
  loyer_mensuel: number
  depot_garantie: number
  statut: 'actif' | 'expire' | 'resilié'
}

export interface PropertyPayment extends BaseGMCEntity {
  contract_id: string
  client_id: string
  montant: number
  date_paiement: string
  type: 'loyer' | 'charges' | 'depot'
  statut: 'paye' | 'en_attente' | 'en_retard'
  reference?: string
}

// SECTION VOYAGE
export interface TravelClient extends BaseGMCEntity {
  nom: string
  prenom: string
  email: string
  telephone: string
  adresse: string
  ville?: string
  nationalite: string
  type_voyageur: 'individuel' | 'groupe' | 'entreprise'
  numero_passeport?: string
  preferences?: string
}

export interface TravelReservation extends BaseGMCEntity {
  client_id: string
  client_name: string
  destination: string
  type_voyage: 'vol' | 'hotel' | 'location_voiture' | 'package'
  date_debut: string
  date_fin: string
  prix_total: number
  prix_paye: number
  statut: 'confirme' | 'en_attente' | 'annule'
  details?: Record<string, any>
}

export interface TravelPayment extends BaseGMCEntity {
  reservation_id: string
  client_name: string
  destination: string
  montant: number
  methode: 'virement' | 'especes' | 'carte' | 'cheque' | 'mobile'
  statut: 'completed' | 'partial' | 'pending'
  date_paiement: string
  reference?: string
}

// SECTION ASSURANCE
export interface InsuranceClient extends BaseGMCEntity {
  nom: string
  prenom: string
  email: string
  telephone: string
  adresse: string
  ville?: string
  nationalite: string
  numero_permis?: string
  type_client: 'particulier' | 'entreprise'
  preferences?: string
}

export interface InsuranceContract extends BaseGMCEntity {
  client_id: string
  client_name: string
  type_assurance: 'auto' | 'habitation' | 'vie' | 'sante'
  vehicule_marque?: string
  vehicule_modele?: string
  numero_immatriculation?: string
  prime_mensuelle: number
  date_debut: string
  date_fin: string
  statut: 'actif' | 'expire' | 'suspendu'
  details?: Record<string, any>
}

export interface InsurancePayment extends BaseGMCEntity {
  contract_id: string
  client_name: string
  type_assurance: string
  montant: number
  methode: 'virement' | 'especes' | 'carte' | 'cheque' | 'mobile'
  statut: 'completed' | 'partial' | 'pending'
  date_paiement: string
  reference?: string
}

// SECTION FINANCIERE CONSOLIDÉE
export interface FinancialSummary {
  // Revenus par secteur
  revenus: {
    immobilier: number
    voyage: number
    assurance: number
    total: number
  }
  
  // Dépenses par secteur
  depenses: {
    immobilier: number
    voyage: number
    assurance: number
    total: number
  }
  
  // Bénéfices
  benefice: {
    immobilier: number
    voyage: number
    assurance: number
    total: number
  }
  
  // Statistiques
  stats: {
    total_clients: number
    clients_immobilier: number
    clients_voyage: number
    clients_assurance: number
    total_proprietes: number
    total_reservations: number
    total_contrats_assurance: number
    taux_occupation: number
    taux_paiement: number
  }
}

// Types pour les écritures comptables
export interface AccountingEntry extends BaseGMCEntity {
  date: string
  description: string
  type: "recette" | "depense"
  category: string
  secteur: 'immobilier' | 'voyage' | 'assurance' | 'general'
  amount: number
  reference: string
  source_id?: string
  source_type?: 'property_payment' | 'travel_payment' | 'insurance_payment' | 'manual'
}

// Types pour les alertes
export interface GMCAlert {
  id: string
  type: 'paiement_retard' | 'maintenance' | 'contrat_expiration' | 'voyage_confirmation'
  secteur: 'immobilier' | 'voyage'
  titre: string
  description: string
  priorite: 'basse' | 'moyenne' | 'haute' | 'critique'
  date_creation: string
  lu: boolean
  source_id?: string
}

// Types pour les métriques
export interface SectorMetrics {
  chiffre_affaires_mensuel: number
  croissance_mensuelle: number
  nombre_clients_actifs: number
  taux_satisfaction: number
  objectif_mensuel: number
  taux_realisation: number
}

// Types pour le suivi des clients
export interface ClientFollowUp extends BaseGMCEntity {
  client_id: string
  last_contact: string
  next_contact?: string
  contact_type: 'email' | 'sms' | 'whatsapp' | 'phone' | 'meeting'
  notes?: string
  status: 'prospect' | 'actif' | 'a_relancer' | 'inactif'
  priority: 'low' | 'medium' | 'high'
}

export interface CommunicationTemplate {
  id: string
  name: string
  type: 'email' | 'sms' | 'whatsapp'
  subject?: string // pour les emails
  content: string
  sector?: 'immobilier' | 'voyage' | 'assurance' | 'general'
  target_status?: 'prospect' | 'actif' | 'a_relancer'
}

export interface CommunicationLog extends BaseGMCEntity {
  client_id: string
  type: 'email' | 'sms' | 'whatsapp' | 'phone' | 'meeting'
  subject?: string
  content?: string
  sent_at: string
  status: 'sent' | 'delivered' | 'failed'
  template_id?: string
}