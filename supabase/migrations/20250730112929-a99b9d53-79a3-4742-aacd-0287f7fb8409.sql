-- Créer les tables manquantes pour locations de véhicules
CREATE TABLE public.locations_vehicules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Référence client
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
  
  -- Informations véhicule
  type_vehicule TEXT NOT NULL,
  marque TEXT,
  modele TEXT,
  immatriculation TEXT,
  
  -- Dates et durée
  date_debut DATE NOT NULL,
  date_fin DATE NOT NULL,
  
  -- Tarification
  tarif_journalier DECIMAL(10,2) NOT NULL,
  montant_total DECIMAL(10,2) NOT NULL,
  
  -- Statut
  statut TEXT NOT NULL DEFAULT 'active' CHECK (statut IN ('active', 'completed', 'cancelled')),
  
  -- Détails supplémentaires
  lieu_prise_en_charge TEXT,
  lieu_retour TEXT,
  notes TEXT
);

-- Créer les tables pour réservations de vols
CREATE TABLE public.reservations_vols (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Référence client
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
  
  -- Informations vol
  numero_vol TEXT NOT NULL,
  compagnie_aerienne TEXT,
  depart TEXT NOT NULL,
  destination TEXT NOT NULL,
  date_depart DATE NOT NULL,
  heure_depart TIME,
  date_retour DATE,
  heure_retour TIME,
  
  -- Passagers
  nombre_passagers INTEGER NOT NULL DEFAULT 1,
  
  -- Tarification
  prix_total DECIMAL(10,2) NOT NULL,
  
  -- Statut
  statut TEXT NOT NULL DEFAULT 'confirmed' CHECK (statut IN ('confirmed', 'pending', 'cancelled')),
  
  -- Détails supplémentaires
  classe TEXT DEFAULT 'economy',
  notes TEXT
);

-- Créer les tables pour réservations d'hôtels
CREATE TABLE public.reservations_hotels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Référence client
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
  
  -- Informations hôtel
  nom_hotel TEXT NOT NULL,
  adresse_hotel TEXT NOT NULL,
  ville TEXT NOT NULL,
  pays TEXT,
  
  -- Dates de séjour
  date_arrivee DATE NOT NULL,
  date_depart DATE NOT NULL,
  
  -- Détails chambre
  type_chambre TEXT NOT NULL,
  nombre_chambres INTEGER NOT NULL DEFAULT 1,
  nombre_adultes INTEGER NOT NULL DEFAULT 1,
  nombre_enfants INTEGER DEFAULT 0,
  
  -- Tarification
  prix_par_nuit DECIMAL(10,2) NOT NULL,
  prix_total DECIMAL(10,2) NOT NULL,
  
  -- Statut
  statut TEXT NOT NULL DEFAULT 'confirmed' CHECK (statut IN ('confirmed', 'pending', 'cancelled')),
  
  -- Services
  petit_dejeuner BOOLEAN DEFAULT false,
  wifi BOOLEAN DEFAULT false,
  parking BOOLEAN DEFAULT false,
  
  -- Détails supplémentaires
  numero_confirmation TEXT,
  notes TEXT
);

-- Activer RLS sur les nouvelles tables
ALTER TABLE public.locations_vehicules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations_vols ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations_hotels ENABLE ROW LEVEL SECURITY;

-- Créer les politiques RLS
CREATE POLICY "Utilisateurs peuvent voir toutes les locations" ON public.locations_vehicules FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Utilisateurs peuvent créer des locations" ON public.locations_vehicules FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Utilisateurs peuvent modifier des locations" ON public.locations_vehicules FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Utilisateurs peuvent supprimer des locations" ON public.locations_vehicules FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Utilisateurs peuvent voir toutes les réservations vols" ON public.reservations_vols FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Utilisateurs peuvent créer des réservations vols" ON public.reservations_vols FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Utilisateurs peuvent modifier des réservations vols" ON public.reservations_vols FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Utilisateurs peuvent supprimer des réservations vols" ON public.reservations_vols FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Utilisateurs peuvent voir toutes les réservations hôtels" ON public.reservations_hotels FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Utilisateurs peuvent créer des réservations hôtels" ON public.reservations_hotels FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Utilisateurs peuvent modifier des réservations hôtels" ON public.reservations_hotels FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Utilisateurs peuvent supprimer des réservations hôtels" ON public.reservations_hotels FOR DELETE USING (auth.role() = 'authenticated');

-- Créer les triggers pour updated_at
CREATE TRIGGER trigger_locations_vehicules_updated_at
  BEFORE UPDATE ON public.locations_vehicules
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_reservations_vols_updated_at
  BEFORE UPDATE ON public.reservations_vols
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_reservations_hotels_updated_at
  BEFORE UPDATE ON public.reservations_hotels
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();