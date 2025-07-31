export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      assurances_auto: {
        Row: {
          annee_vehicule: number | null
          client_id: string | null
          created_at: string | null
          date_debut: string | null
          date_fin: string | null
          id: string
          immatriculation: string | null
          marque_vehicule: string | null
          modele_vehicule: string | null
          numero_police: string | null
          prime_mensuelle: number | null
          statut: Database["public"]["Enums"]["statut_assurance"] | null
          type_couverture:
            | Database["public"]["Enums"]["type_couverture_enum"]
            | null
          updated_at: string | null
        }
        Insert: {
          annee_vehicule?: number | null
          client_id?: string | null
          created_at?: string | null
          date_debut?: string | null
          date_fin?: string | null
          id?: string
          immatriculation?: string | null
          marque_vehicule?: string | null
          modele_vehicule?: string | null
          numero_police?: string | null
          prime_mensuelle?: number | null
          statut?: Database["public"]["Enums"]["statut_assurance"] | null
          type_couverture?:
            | Database["public"]["Enums"]["type_couverture_enum"]
            | null
          updated_at?: string | null
        }
        Update: {
          annee_vehicule?: number | null
          client_id?: string | null
          created_at?: string | null
          date_debut?: string | null
          date_fin?: string | null
          id?: string
          immatriculation?: string | null
          marque_vehicule?: string | null
          modele_vehicule?: string | null
          numero_police?: string | null
          prime_mensuelle?: number | null
          statut?: Database["public"]["Enums"]["statut_assurance"] | null
          type_couverture?:
            | Database["public"]["Enums"]["type_couverture_enum"]
            | null
          updated_at?: string | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          created_at: string | null
          id: string
          new_values: Json | null
          old_values: Json | null
          operation: string
          table_name: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          operation: string
          table_name: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          operation?: string
          table_name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      client_follow_ups: {
        Row: {
          client_id: string
          contact_type: string | null
          created_at: string
          id: string
          last_contact: string | null
          next_contact: string | null
          notes: string | null
          priority: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          client_id: string
          contact_type?: string | null
          created_at?: string
          id?: string
          last_contact?: string | null
          next_contact?: string | null
          notes?: string | null
          priority?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          client_id?: string
          contact_type?: string | null
          created_at?: string
          id?: string
          last_contact?: string | null
          next_contact?: string | null
          notes?: string | null
          priority?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      clients: {
        Row: {
          adresse: string | null
          created_at: string | null
          date_naissance: string | null
          email: string | null
          id: string
          nationalite: string | null
          nom: string
          numero_passeport: string | null
          numero_permis: string | null
          preferences: string | null
          prenom: string
          profession: string | null
          secteurs: string[] | null
          statut: Database["public"]["Enums"]["statut_client"] | null
          telephone: string | null
          type_client: string | null
          type_voyageur: string | null
          updated_at: string | null
          ville: string | null
        }
        Insert: {
          adresse?: string | null
          created_at?: string | null
          date_naissance?: string | null
          email?: string | null
          id?: string
          nationalite?: string | null
          nom: string
          numero_passeport?: string | null
          numero_permis?: string | null
          preferences?: string | null
          prenom?: string
          profession?: string | null
          secteurs?: string[] | null
          statut?: Database["public"]["Enums"]["statut_client"] | null
          telephone?: string | null
          type_client?: string | null
          type_voyageur?: string | null
          updated_at?: string | null
          ville?: string | null
        }
        Update: {
          adresse?: string | null
          created_at?: string | null
          date_naissance?: string | null
          email?: string | null
          id?: string
          nationalite?: string | null
          nom?: string
          numero_passeport?: string | null
          numero_permis?: string | null
          preferences?: string | null
          prenom?: string
          profession?: string | null
          secteurs?: string[] | null
          statut?: Database["public"]["Enums"]["statut_client"] | null
          telephone?: string | null
          type_client?: string | null
          type_voyageur?: string | null
          updated_at?: string | null
          ville?: string | null
        }
        Relationships: []
      }
      communication_logs: {
        Row: {
          client_id: string
          content: string | null
          created_at: string
          id: string
          metadata: Json | null
          sent_at: string
          status: string | null
          subject: string | null
          template_id: string | null
          type: string
          updated_at: string
        }
        Insert: {
          client_id: string
          content?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          sent_at?: string
          status?: string | null
          subject?: string | null
          template_id?: string | null
          type: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          content?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          sent_at?: string
          status?: string | null
          subject?: string | null
          template_id?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      communication_templates: {
        Row: {
          content: string
          created_at: string
          id: string
          is_active: boolean | null
          name: string
          sector: string | null
          subject: string | null
          target_status: string | null
          type: string
          updated_at: string
          usage_count: number | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          name: string
          sector?: string | null
          subject?: string | null
          target_status?: string | null
          type: string
          updated_at?: string
          usage_count?: number | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          name?: string
          sector?: string | null
          subject?: string | null
          target_status?: string | null
          type?: string
          updated_at?: string
          usage_count?: number | null
        }
        Relationships: []
      }
      contrats: {
        Row: {
          client_id: string | null
          conditions_particulieres: string | null
          created_at: string | null
          date_debut: string | null
          date_fin: string | null
          depot_garantie: number | null
          id: string
          loyer_mensuel: number | null
          propriete_id: string | null
          statut: Database["public"]["Enums"]["statut_contrat"] | null
          type_contrat: Database["public"]["Enums"]["type_contrat_enum"] | null
          updated_at: string | null
        }
        Insert: {
          client_id?: string | null
          conditions_particulieres?: string | null
          created_at?: string | null
          date_debut?: string | null
          date_fin?: string | null
          depot_garantie?: number | null
          id?: string
          loyer_mensuel?: number | null
          propriete_id?: string | null
          statut?: Database["public"]["Enums"]["statut_contrat"] | null
          type_contrat?: Database["public"]["Enums"]["type_contrat_enum"] | null
          updated_at?: string | null
        }
        Update: {
          client_id?: string | null
          conditions_particulieres?: string | null
          created_at?: string | null
          date_debut?: string | null
          date_fin?: string | null
          depot_garantie?: number | null
          id?: string
          loyer_mensuel?: number | null
          propriete_id?: string | null
          statut?: Database["public"]["Enums"]["statut_contrat"] | null
          type_contrat?: Database["public"]["Enums"]["type_contrat_enum"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contrats_propriete_id_fkey"
            columns: ["propriete_id"]
            isOneToOne: false
            referencedRelation: "proprietes"
            referencedColumns: ["id"]
          },
        ]
      }
      echeances: {
        Row: {
          client_id: string | null
          contrat_id: string | null
          created_at: string | null
          date_echeance: string | null
          id: string
          montant_attendu: number | null
          rappel_envoye: boolean | null
          statut: Database["public"]["Enums"]["statut_echeance_enum"] | null
          type_echeance:
            | Database["public"]["Enums"]["type_echeance_enum"]
            | null
        }
        Insert: {
          client_id?: string | null
          contrat_id?: string | null
          created_at?: string | null
          date_echeance?: string | null
          id?: string
          montant_attendu?: number | null
          rappel_envoye?: boolean | null
          statut?: Database["public"]["Enums"]["statut_echeance_enum"] | null
          type_echeance?:
            | Database["public"]["Enums"]["type_echeance_enum"]
            | null
        }
        Update: {
          client_id?: string | null
          contrat_id?: string | null
          created_at?: string | null
          date_echeance?: string | null
          id?: string
          montant_attendu?: number | null
          rappel_envoye?: boolean | null
          statut?: Database["public"]["Enums"]["statut_echeance_enum"] | null
          type_echeance?:
            | Database["public"]["Enums"]["type_echeance_enum"]
            | null
        }
        Relationships: [
          {
            foreignKeyName: "echeances_contrat_id_fkey"
            columns: ["contrat_id"]
            isOneToOne: false
            referencedRelation: "contrats"
            referencedColumns: ["id"]
          },
        ]
      }
      locations_vehicules: {
        Row: {
          client_id: string | null
          created_at: string
          date_debut: string
          date_fin: string
          id: string
          immatriculation: string | null
          lieu_prise_en_charge: string | null
          lieu_retour: string | null
          marque: string | null
          modele: string | null
          montant_total: number
          notes: string | null
          statut: string
          tarif_journalier: number
          type_vehicule: string
          updated_at: string
        }
        Insert: {
          client_id?: string | null
          created_at?: string
          date_debut: string
          date_fin: string
          id?: string
          immatriculation?: string | null
          lieu_prise_en_charge?: string | null
          lieu_retour?: string | null
          marque?: string | null
          modele?: string | null
          montant_total: number
          notes?: string | null
          statut?: string
          tarif_journalier: number
          type_vehicule: string
          updated_at?: string
        }
        Update: {
          client_id?: string | null
          created_at?: string
          date_debut?: string
          date_fin?: string
          id?: string
          immatriculation?: string | null
          lieu_prise_en_charge?: string | null
          lieu_retour?: string | null
          marque?: string | null
          modele?: string | null
          montant_total?: number
          notes?: string | null
          statut?: string
          tarif_journalier?: number
          type_vehicule?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "locations_vehicules_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "locations_vehicules_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "insurance_clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "locations_vehicules_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "property_clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "locations_vehicules_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "travel_clients"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance: {
        Row: {
          client_id: string | null
          cout_intervention: number | null
          created_at: string | null
          date_demande: string | null
          date_intervention: string | null
          description_probleme: string | null
          id: string
          photo_probleme_url: string | null
          propriete_id: string | null
          statut: Database["public"]["Enums"]["statut_maintenance"] | null
          technicien_affecte: string | null
          type_panne: Database["public"]["Enums"]["type_panne_enum"] | null
          updated_at: string | null
          urgence: Database["public"]["Enums"]["urgence_enum"] | null
        }
        Insert: {
          client_id?: string | null
          cout_intervention?: number | null
          created_at?: string | null
          date_demande?: string | null
          date_intervention?: string | null
          description_probleme?: string | null
          id?: string
          photo_probleme_url?: string | null
          propriete_id?: string | null
          statut?: Database["public"]["Enums"]["statut_maintenance"] | null
          technicien_affecte?: string | null
          type_panne?: Database["public"]["Enums"]["type_panne_enum"] | null
          updated_at?: string | null
          urgence?: Database["public"]["Enums"]["urgence_enum"] | null
        }
        Update: {
          client_id?: string | null
          cout_intervention?: number | null
          created_at?: string | null
          date_demande?: string | null
          date_intervention?: string | null
          description_probleme?: string | null
          id?: string
          photo_probleme_url?: string | null
          propriete_id?: string | null
          statut?: Database["public"]["Enums"]["statut_maintenance"] | null
          technicien_affecte?: string | null
          type_panne?: Database["public"]["Enums"]["type_panne_enum"] | null
          updated_at?: string | null
          urgence?: Database["public"]["Enums"]["urgence_enum"] | null
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_propriete_id_fkey"
            columns: ["propriete_id"]
            isOneToOne: false
            referencedRelation: "proprietes"
            referencedColumns: ["id"]
          },
        ]
      }
      parametres_systeme: {
        Row: {
          cle: string | null
          description: string | null
          id: string
          type: Database["public"]["Enums"]["type_parametre_enum"] | null
          updated_at: string | null
          valeur: string | null
        }
        Insert: {
          cle?: string | null
          description?: string | null
          id?: string
          type?: Database["public"]["Enums"]["type_parametre_enum"] | null
          updated_at?: string | null
          valeur?: string | null
        }
        Update: {
          cle?: string | null
          description?: string | null
          id?: string
          type?: Database["public"]["Enums"]["type_parametre_enum"] | null
          updated_at?: string | null
          valeur?: string | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          client_id: string | null
          client_name: string
          created_at: string
          date_paiement: string
          details: Json | null
          id: string
          methode: string
          montant: number
          observations: string | null
          reference: string | null
          secteur: string
          statut: string
          type_paiement: string
          updated_at: string
        }
        Insert: {
          client_id?: string | null
          client_name: string
          created_at?: string
          date_paiement: string
          details?: Json | null
          id?: string
          methode: string
          montant: number
          observations?: string | null
          reference?: string | null
          secteur: string
          statut?: string
          type_paiement: string
          updated_at?: string
        }
        Update: {
          client_id?: string | null
          client_name?: string
          created_at?: string
          date_paiement?: string
          details?: Json | null
          id?: string
          methode?: string
          montant?: number
          observations?: string | null
          reference?: string | null
          secteur?: string
          statut?: string
          type_paiement?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "insurance_clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "property_clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "travel_clients"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          actif: boolean
          created_at: string
          email: string | null
          id: string
          nom_complet: string | null
          role: string
          telephone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          actif?: boolean
          created_at?: string
          email?: string | null
          id?: string
          nom_complet?: string | null
          role?: string
          telephone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          actif?: boolean
          created_at?: string
          email?: string | null
          id?: string
          nom_complet?: string | null
          role?: string
          telephone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      proprietes: {
        Row: {
          adresse: string | null
          charges_mensuelles: number | null
          created_at: string | null
          description: string | null
          etage: number | null
          id: string
          lien_photos: string | null
          nombre_pieces: number | null
          prix_loyer_mensuel: number | null
          statut: Database["public"]["Enums"]["statut_bien"] | null
          superficie: number | null
          titre: string | null
          type_bien: Database["public"]["Enums"]["type_bien_enum"] | null
          updated_at: string | null
          usage: Database["public"]["Enums"]["usage_bien"] | null
          ville: string | null
        }
        Insert: {
          adresse?: string | null
          charges_mensuelles?: number | null
          created_at?: string | null
          description?: string | null
          etage?: number | null
          id?: string
          lien_photos?: string | null
          nombre_pieces?: number | null
          prix_loyer_mensuel?: number | null
          statut?: Database["public"]["Enums"]["statut_bien"] | null
          superficie?: number | null
          titre?: string | null
          type_bien?: Database["public"]["Enums"]["type_bien_enum"] | null
          updated_at?: string | null
          usage?: Database["public"]["Enums"]["usage_bien"] | null
          ville?: string | null
        }
        Update: {
          adresse?: string | null
          charges_mensuelles?: number | null
          created_at?: string | null
          description?: string | null
          etage?: number | null
          id?: string
          lien_photos?: string | null
          nombre_pieces?: number | null
          prix_loyer_mensuel?: number | null
          statut?: Database["public"]["Enums"]["statut_bien"] | null
          superficie?: number | null
          titre?: string | null
          type_bien?: Database["public"]["Enums"]["type_bien_enum"] | null
          updated_at?: string | null
          usage?: Database["public"]["Enums"]["usage_bien"] | null
          ville?: string | null
        }
        Relationships: []
      }
      reservations_hotels: {
        Row: {
          adresse_hotel: string
          client_id: string | null
          created_at: string
          date_arrivee: string
          date_depart: string
          id: string
          nom_hotel: string
          nombre_adultes: number
          nombre_chambres: number
          nombre_enfants: number | null
          notes: string | null
          numero_confirmation: string | null
          parking: boolean | null
          pays: string | null
          petit_dejeuner: boolean | null
          prix_par_nuit: number
          prix_total: number
          statut: string
          type_chambre: string
          updated_at: string
          ville: string
          wifi: boolean | null
        }
        Insert: {
          adresse_hotel: string
          client_id?: string | null
          created_at?: string
          date_arrivee: string
          date_depart: string
          id?: string
          nom_hotel: string
          nombre_adultes?: number
          nombre_chambres?: number
          nombre_enfants?: number | null
          notes?: string | null
          numero_confirmation?: string | null
          parking?: boolean | null
          pays?: string | null
          petit_dejeuner?: boolean | null
          prix_par_nuit: number
          prix_total: number
          statut?: string
          type_chambre: string
          updated_at?: string
          ville: string
          wifi?: boolean | null
        }
        Update: {
          adresse_hotel?: string
          client_id?: string | null
          created_at?: string
          date_arrivee?: string
          date_depart?: string
          id?: string
          nom_hotel?: string
          nombre_adultes?: number
          nombre_chambres?: number
          nombre_enfants?: number | null
          notes?: string | null
          numero_confirmation?: string | null
          parking?: boolean | null
          pays?: string | null
          petit_dejeuner?: boolean | null
          prix_par_nuit?: number
          prix_total?: number
          statut?: string
          type_chambre?: string
          updated_at?: string
          ville?: string
          wifi?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "reservations_hotels_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservations_hotels_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "insurance_clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservations_hotels_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "property_clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservations_hotels_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "travel_clients"
            referencedColumns: ["id"]
          },
        ]
      }
      reservations_vols: {
        Row: {
          classe: string | null
          client_id: string | null
          compagnie_aerienne: string | null
          created_at: string
          date_depart: string
          date_retour: string | null
          depart: string
          destination: string
          heure_depart: string | null
          heure_retour: string | null
          id: string
          nombre_passagers: number
          notes: string | null
          numero_vol: string
          prix_total: number
          statut: string
          updated_at: string
        }
        Insert: {
          classe?: string | null
          client_id?: string | null
          compagnie_aerienne?: string | null
          created_at?: string
          date_depart: string
          date_retour?: string | null
          depart: string
          destination: string
          heure_depart?: string | null
          heure_retour?: string | null
          id?: string
          nombre_passagers?: number
          notes?: string | null
          numero_vol: string
          prix_total: number
          statut?: string
          updated_at?: string
        }
        Update: {
          classe?: string | null
          client_id?: string | null
          compagnie_aerienne?: string | null
          created_at?: string
          date_depart?: string
          date_retour?: string | null
          depart?: string
          destination?: string
          heure_depart?: string | null
          heure_retour?: string | null
          id?: string
          nombre_passagers?: number
          notes?: string | null
          numero_vol?: string
          prix_total?: number
          statut?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reservations_vols_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservations_vols_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "insurance_clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservations_vols_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "property_clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservations_vols_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "travel_clients"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions_financieres: {
        Row: {
          categorie:
            | Database["public"]["Enums"]["categorie_transaction_enum"]
            | null
          client_id: string | null
          created_at: string | null
          date_transaction: string | null
          description: string | null
          id: string
          montant: number | null
          propriete_id: string | null
          reference_document: string | null
          type_transaction:
            | Database["public"]["Enums"]["type_transaction_enum"]
            | null
        }
        Insert: {
          categorie?:
            | Database["public"]["Enums"]["categorie_transaction_enum"]
            | null
          client_id?: string | null
          created_at?: string | null
          date_transaction?: string | null
          description?: string | null
          id?: string
          montant?: number | null
          propriete_id?: string | null
          reference_document?: string | null
          type_transaction?:
            | Database["public"]["Enums"]["type_transaction_enum"]
            | null
        }
        Update: {
          categorie?:
            | Database["public"]["Enums"]["categorie_transaction_enum"]
            | null
          client_id?: string | null
          created_at?: string | null
          date_transaction?: string | null
          description?: string | null
          id?: string
          montant?: number | null
          propriete_id?: string | null
          reference_document?: string | null
          type_transaction?:
            | Database["public"]["Enums"]["type_transaction_enum"]
            | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_financieres_propriete_id_fkey"
            columns: ["propriete_id"]
            isOneToOne: false
            referencedRelation: "proprietes"
            referencedColumns: ["id"]
          },
        ]
      }
      utilisateurs: {
        Row: {
          actif: boolean | null
          created_at: string | null
          derniere_connexion: string | null
          email: string | null
          id: string
          nom_complet: string | null
          role: Database["public"]["Enums"]["role_utilisateur"] | null
          telephone: string | null
        }
        Insert: {
          actif?: boolean | null
          created_at?: string | null
          derniere_connexion?: string | null
          email?: string | null
          id?: string
          nom_complet?: string | null
          role?: Database["public"]["Enums"]["role_utilisateur"] | null
          telephone?: string | null
        }
        Update: {
          actif?: boolean | null
          created_at?: string | null
          derniere_connexion?: string | null
          email?: string | null
          id?: string
          nom_complet?: string | null
          role?: Database["public"]["Enums"]["role_utilisateur"] | null
          telephone?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      clients_by_sector: {
        Row: {
          clients_actifs: number | null
          clients_inactifs: number | null
          clients_suspendus: number | null
          nombre_clients: number | null
          secteur: string | null
        }
        Relationships: []
      }
      insurance_clients: {
        Row: {
          adresse: string | null
          created_at: string | null
          email: string | null
          id: string | null
          nationalite: string | null
          nom: string | null
          numero_permis: string | null
          preferences: string | null
          prenom: string | null
          telephone: string | null
          type_client: string | null
          updated_at: string | null
          ville: string | null
        }
        Insert: {
          adresse?: string | null
          created_at?: string | null
          email?: string | null
          id?: string | null
          nationalite?: string | null
          nom?: string | null
          numero_permis?: string | null
          preferences?: string | null
          prenom?: string | null
          telephone?: string | null
          type_client?: string | null
          updated_at?: string | null
          ville?: string | null
        }
        Update: {
          adresse?: string | null
          created_at?: string | null
          email?: string | null
          id?: string | null
          nationalite?: string | null
          nom?: string | null
          numero_permis?: string | null
          preferences?: string | null
          prenom?: string | null
          telephone?: string | null
          type_client?: string | null
          updated_at?: string | null
          ville?: string | null
        }
        Relationships: []
      }
      property_clients: {
        Row: {
          adresse: string | null
          created_at: string | null
          date_naissance: string | null
          email: string | null
          id: string | null
          nom: string | null
          prenom: string | null
          profession: string | null
          statut: Database["public"]["Enums"]["statut_client"] | null
          telephone: string | null
          updated_at: string | null
          ville: string | null
        }
        Insert: {
          adresse?: string | null
          created_at?: string | null
          date_naissance?: string | null
          email?: string | null
          id?: string | null
          nom?: string | null
          prenom?: string | null
          profession?: string | null
          statut?: Database["public"]["Enums"]["statut_client"] | null
          telephone?: string | null
          updated_at?: string | null
          ville?: string | null
        }
        Update: {
          adresse?: string | null
          created_at?: string | null
          date_naissance?: string | null
          email?: string | null
          id?: string | null
          nom?: string | null
          prenom?: string | null
          profession?: string | null
          statut?: Database["public"]["Enums"]["statut_client"] | null
          telephone?: string | null
          updated_at?: string | null
          ville?: string | null
        }
        Relationships: []
      }
      travel_clients: {
        Row: {
          adresse: string | null
          created_at: string | null
          email: string | null
          id: string | null
          nationalite: string | null
          nom: string | null
          numero_passeport: string | null
          preferences: string | null
          prenom: string | null
          telephone: string | null
          type_voyageur: string | null
          updated_at: string | null
          ville: string | null
        }
        Insert: {
          adresse?: string | null
          created_at?: string | null
          email?: string | null
          id?: string | null
          nationalite?: string | null
          nom?: string | null
          numero_passeport?: string | null
          preferences?: string | null
          prenom?: string | null
          telephone?: string | null
          type_voyageur?: string | null
          updated_at?: string | null
          ville?: string | null
        }
        Update: {
          adresse?: string | null
          created_at?: string | null
          email?: string | null
          id?: string | null
          nationalite?: string | null
          nom?: string | null
          numero_passeport?: string | null
          preferences?: string | null
          prenom?: string | null
          telephone?: string | null
          type_voyageur?: string | null
          updated_at?: string | null
          ville?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      add_client_secteur: {
        Args: { client_id: string; new_secteur: string }
        Returns: undefined
      }
      get_clients_by_secteur: {
        Args: { target_secteur: string }
        Returns: {
          id: string
          nom: string
          prenom: string
          email: string
          telephone: string
          adresse: string
          ville: string
          secteurs: string[]
          statut: string
        }[]
      }
      get_clients_due_today: {
        Args: Record<PropertyKey, never>
        Returns: {
          client_id: string
          client_name: string
          client_email: string
          next_contact: string
          priority: string
          notes: string
        }[]
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      mark_client_for_follow_up: {
        Args: {
          p_client_id: string
          p_next_contact_date: string
          p_priority?: string
          p_notes?: string
        }
        Returns: undefined
      }
      remove_client_secteur: {
        Args: { client_id: string; secteur_to_remove: string }
        Returns: undefined
      }
    }
    Enums: {
      categorie_transaction_enum:
        | "loyer"
        | "maintenance"
        | "assurance"
        | "commission"
        | "frais"
      mode_paiement_enum: "especes" | "virement" | "mobile_money"
      role_utilisateur: "admin" | "gestionnaire" | "comptable"
      statut_assurance: "active" | "expiree" | "suspendue" | "resiliee"
      statut_bien:
        | "disponible"
        | "loue"
        | "en_vente"
        | "occupe"
        | "hors_service"
      statut_client: "actif" | "inactif" | "suspendu"
      statut_contrat: "actif" | "expire" | "resilie" | "en_attente"
      statut_echeance_enum: "en_attente" | "payee" | "en_retard" | "annulee"
      statut_maintenance: "en_attente" | "en_cours" | "termine"
      statut_paiement_enum: "recu" | "en_attente" | "rejete"
      type_bien_enum: "appartement" | "maison" | "terrain" | "bureau" | "autre"
      type_contrat_enum: "location" | "vente" | "gestion"
      type_couverture_enum:
        | "responsabilite"
        | "tous_risques"
        | "tiers_collision"
      type_echeance_enum: "loyer" | "assurance" | "renouvellement"
      type_paiement_enum:
        | "loyer"
        | "caution"
        | "entretien"
        | "assurance"
        | "autre"
      type_panne_enum:
        | "plomberie"
        | "electricite"
        | "climatisation"
        | "murs"
        | "autre"
      type_parametre_enum: "string" | "number" | "boolean" | "json"
      type_transaction_enum: "recette" | "depense"
      urgence_enum: "faible" | "moyenne" | "urgente"
      usage_bien: "habitation" | "commercial" | "mixte"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      categorie_transaction_enum: [
        "loyer",
        "maintenance",
        "assurance",
        "commission",
        "frais",
      ],
      mode_paiement_enum: ["especes", "virement", "mobile_money"],
      role_utilisateur: ["admin", "gestionnaire", "comptable"],
      statut_assurance: ["active", "expiree", "suspendue", "resiliee"],
      statut_bien: ["disponible", "loue", "en_vente", "occupe", "hors_service"],
      statut_client: ["actif", "inactif", "suspendu"],
      statut_contrat: ["actif", "expire", "resilie", "en_attente"],
      statut_echeance_enum: ["en_attente", "payee", "en_retard", "annulee"],
      statut_maintenance: ["en_attente", "en_cours", "termine"],
      statut_paiement_enum: ["recu", "en_attente", "rejete"],
      type_bien_enum: ["appartement", "maison", "terrain", "bureau", "autre"],
      type_contrat_enum: ["location", "vente", "gestion"],
      type_couverture_enum: [
        "responsabilite",
        "tous_risques",
        "tiers_collision",
      ],
      type_echeance_enum: ["loyer", "assurance", "renouvellement"],
      type_paiement_enum: [
        "loyer",
        "caution",
        "entretien",
        "assurance",
        "autre",
      ],
      type_panne_enum: [
        "plomberie",
        "electricite",
        "climatisation",
        "murs",
        "autre",
      ],
      type_parametre_enum: ["string", "number", "boolean", "json"],
      type_transaction_enum: ["recette", "depense"],
      urgence_enum: ["faible", "moyenne", "urgente"],
      usage_bien: ["habitation", "commercial", "mixte"],
    },
  },
} as const
