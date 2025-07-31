export interface Property {
  id: string
  id_bien: string
  type_bien: 'appartement' | 'maison' | 'terrain' | 'bureau' | 'autre'
  titre_bien: string
  adresse: string
  ville_zone: string
  superficie: number
  nombre_pieces?: number
  etage?: string
  usage: 'habitation' | 'commercial' | 'mixte'
  statut: 'disponible' | 'loue' | 'en_vente' | 'occupe' | 'hors_service'
  lien_photos?: string
  description?: string
  prix_loyer: number
  charges_mensuelles?: number
  created_at: string
  updated_at: string
}

export interface CreatePropertyInput {
  type_bien: string
  titre_bien: string
  adresse: string
  ville_zone: string
  superficie: string
  nombre_pieces: string
  etage: string
  usage: string
  statut: string
  lien_photos: string
  description: string
  prix_loyer: string
  charges_mensuelles: string
}