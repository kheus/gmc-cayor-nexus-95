-- ============================================
-- TABLES SQL POUR SUPABASE - SYSTÈME GMC
-- ============================================

-- 1. TABLE CLIENTS UNIFIÉE
-- Gère tous les clients (immobilier, voyage, assurance)
-- ============================================

CREATE TABLE public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Informations de base (communes à tous)
  nom TEXT NOT NULL,
  prenom TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  telephone TEXT NOT NULL,
  adresse TEXT NOT NULL,
  ville TEXT,
  
  -- Secteurs d'activité (array)
  secteurs TEXT[] NOT NULL DEFAULT '{}', -- ['immobilier', 'voyage', 'assurance']
  
  -- Informations générales
  statut TEXT DEFAULT 'actif' CHECK (statut IN ('actif', 'inactif', 'suspendu')),
  date_naissance DATE,
  nationalite TEXT,
  
  -- Champs spécifiques immobilier
  profession TEXT,
  
  -- Champs spécifiques voyage
  type_voyageur TEXT CHECK (type_voyageur IN ('individuel', 'groupe', 'entreprise')),
  numero_passeport TEXT,
  
  -- Champs spécifiques assurance
  numero_permis TEXT,
  type_client TEXT CHECK (type_client IN ('particulier', 'entreprise')),
  
  -- Préférences générales
  preferences TEXT
);

-- 2. TABLE PROPRIÉTÉS
-- Gère tous les biens immobiliers
-- ============================================

CREATE TABLE public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Identification du bien
  id_bien TEXT UNIQUE NOT NULL,
  type_bien TEXT NOT NULL CHECK (type_bien IN ('Appartement', 'Maison', 'Terrain', 'Bureau', 'Autre')),
  titre_bien TEXT NOT NULL,
  
  -- Localisation
  adresse TEXT NOT NULL,
  ville_zone TEXT NOT NULL,
  
  -- Caractéristiques physiques
  superficie INTEGER NOT NULL,
  nombre_pieces INTEGER,
  etage TEXT,
  usage TEXT CHECK (usage IN ('Habitation', 'Commercial', 'Mixte')),
  
  -- Statut et gestion
  statut TEXT NOT NULL DEFAULT 'Disponible' CHECK (statut IN ('Disponible', 'Loué', 'En vente', 'Occupé', 'Hors service')),
  
  -- Médias et description
  lien_photos TEXT,
  description TEXT,
  
  -- Données financières
  prix_loyer DECIMAL(15,2) NOT NULL,
  charges_mensuelles DECIMAL(15,2) DEFAULT 0
);

-- 3. TABLE PAIEMENTS UNIFIÉE
-- Gère tous les paiements de tous les secteurs
-- ============================================

CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Identification
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL, -- dénormalisé pour performance
  
  -- Secteur et type
  secteur TEXT NOT NULL CHECK (secteur IN ('immobilier', 'voyage', 'assurance')),
  type_paiement TEXT NOT NULL, -- Loyer, Prime, Réservation, etc.
  
  -- Montant et méthode
  montant DECIMAL(15,2) NOT NULL,
  methode TEXT NOT NULL CHECK (methode IN ('virement', 'especes', 'carte', 'cheque', 'mobile')),
  
  -- Statut et dates
  statut TEXT NOT NULL DEFAULT 'pending' CHECK (statut IN ('completed', 'partial', 'pending')),
  date_paiement DATE NOT NULL,
  
  -- Références
  reference TEXT,
  
  -- Détails spécifiques par secteur (JSON flexible)
  details JSONB DEFAULT '{}',
  
  -- Notes
  observations TEXT
);

-- 3. INDEX POUR PERFORMANCE
-- ============================================

-- Index sur les clients
CREATE INDEX idx_clients_secteurs ON public.clients USING GIN(secteurs);
CREATE INDEX idx_clients_email ON public.clients(email);
CREATE INDEX idx_clients_statut ON public.clients(statut);

-- Index sur les propriétés
CREATE INDEX idx_properties_id_bien ON public.properties(id_bien);
CREATE INDEX idx_properties_type_bien ON public.properties(type_bien);
CREATE INDEX idx_properties_statut ON public.properties(statut);
CREATE INDEX idx_properties_ville_zone ON public.properties(ville_zone);

-- Index sur les paiements
CREATE INDEX idx_payments_secteur ON public.payments(secteur);
CREATE INDEX idx_payments_client_id ON public.payments(client_id);
CREATE INDEX idx_payments_statut ON public.payments(statut);
CREATE INDEX idx_payments_date ON public.payments(date_paiement);
CREATE INDEX idx_payments_details ON public.payments USING GIN(details);

-- 4. FONCTIONS TRIGGERS POUR UPDATED_AT
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour clients
CREATE TRIGGER trigger_clients_updated_at
  BEFORE UPDATE ON public.clients
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Trigger pour properties
CREATE TRIGGER trigger_properties_updated_at
  BEFORE UPDATE ON public.properties
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Trigger pour payments
CREATE TRIGGER trigger_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- 5. ROW LEVEL SECURITY (RLS)
-- ============================================

-- Activer RLS
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Politiques pour clients (lecture et écriture pour utilisateurs authentifiés)
CREATE POLICY "clients_select" ON public.clients
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "clients_insert" ON public.clients
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "clients_update" ON public.clients
  FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "clients_delete" ON public.clients
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- Politiques pour properties (lecture et écriture pour utilisateurs authentifiés)
CREATE POLICY "properties_select" ON public.properties
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "properties_insert" ON public.properties
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "properties_update" ON public.properties
  FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "properties_delete" ON public.properties
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- Politiques pour payments (lecture et écriture pour utilisateurs authentifiés)
CREATE POLICY "payments_select" ON public.payments
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "payments_insert" ON public.payments
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "payments_update" ON public.payments
  FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "payments_delete" ON public.payments
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- 6. DONNÉES D'EXEMPLE
-- ============================================

-- Section réservée pour les données d'exemple (actuellement vide)

-- 7. VUES UTILES POUR REPORTING
-- ============================================

-- Vue des revenus par secteur
CREATE VIEW revenue_by_sector AS
SELECT 
  secteur,
  COUNT(*) as nombre_paiements,
  SUM(montant) as total_montant,
  AVG(montant) as montant_moyen,
  COUNT(CASE WHEN statut = 'completed' THEN 1 END) as paiements_completes,
  COUNT(CASE WHEN statut = 'pending' THEN 1 END) as paiements_en_attente
FROM public.payments
GROUP BY secteur;

-- Vue des clients actifs par secteur
CREATE VIEW clients_by_sector AS
SELECT 
  unnest(secteurs) as secteur,
  COUNT(*) as nombre_clients,
  COUNT(CASE WHEN statut = 'actif' THEN 1 END) as clients_actifs
FROM public.clients
GROUP BY unnest(secteurs);