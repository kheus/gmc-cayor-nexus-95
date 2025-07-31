-- ==============================================
-- SCRIPT SQL POUR CRÉER TOUTES LES TABLES GMC
-- Exécutez ces commandes dans Supabase SQL Editor
-- ==============================================

-- 1. TABLES VOYAGE
-- ================

-- Create travel clients table
CREATE TABLE IF NOT EXISTS public.travel_clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nom TEXT NOT NULL,
  prenom TEXT NOT NULL,
  email TEXT NOT NULL,
  telephone TEXT NOT NULL,
  adresse TEXT NOT NULL,
  ville TEXT,
  nationalite TEXT NOT NULL,
  type_voyageur TEXT NOT NULL CHECK (type_voyageur IN ('individuel', 'groupe', 'entreprise')),
  numero_passeport TEXT,
  preferences TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create travel reservations table
CREATE TABLE IF NOT EXISTS public.travel_reservations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.travel_clients(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  destination TEXT NOT NULL,
  type_voyage TEXT NOT NULL CHECK (type_voyage IN ('vol', 'hotel', 'location_voiture', 'package')),
  date_debut DATE NOT NULL,
  date_fin DATE NOT NULL,
  prix_total NUMERIC(10,2) NOT NULL,
  prix_paye NUMERIC(10,2) NOT NULL DEFAULT 0,
  statut TEXT NOT NULL DEFAULT 'en_attente' CHECK (statut IN ('confirme', 'en_attente', 'annule')),
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create travel payments table
CREATE TABLE IF NOT EXISTS public.travel_payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reservation_id UUID NOT NULL REFERENCES public.travel_reservations(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  destination TEXT NOT NULL,
  montant NUMERIC(10,2) NOT NULL,
  methode TEXT NOT NULL CHECK (methode IN ('virement', 'especes', 'carte', 'cheque', 'mobile')),
  statut TEXT NOT NULL DEFAULT 'pending' CHECK (statut IN ('completed', 'partial', 'pending')),
  date_paiement DATE NOT NULL,
  reference TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2. TABLES ASSURANCE
-- ===================

-- Create insurance clients table
CREATE TABLE IF NOT EXISTS public.insurance_clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nom TEXT NOT NULL,
  prenom TEXT NOT NULL,
  email TEXT NOT NULL,
  telephone TEXT NOT NULL,
  adresse TEXT NOT NULL,
  ville TEXT,
  nationalite TEXT NOT NULL,
  numero_permis TEXT,
  type_client TEXT NOT NULL CHECK (type_client IN ('particulier', 'entreprise')),
  preferences TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create insurance contracts table
CREATE TABLE IF NOT EXISTS public.insurance_contracts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.insurance_clients(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  type_assurance TEXT NOT NULL CHECK (type_assurance IN ('auto', 'habitation', 'vie', 'sante')),
  vehicule_marque TEXT,
  vehicule_modele TEXT,
  numero_immatriculation TEXT,
  prime_mensuelle NUMERIC(10,2) NOT NULL,
  date_debut DATE NOT NULL,
  date_fin DATE NOT NULL,
  statut TEXT NOT NULL DEFAULT 'actif' CHECK (statut IN ('actif', 'expire', 'suspendu')),
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create insurance payments table
CREATE TABLE IF NOT EXISTS public.insurance_payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contract_id UUID NOT NULL REFERENCES public.insurance_contracts(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  type_assurance TEXT NOT NULL,
  montant NUMERIC(10,2) NOT NULL,
  methode TEXT NOT NULL CHECK (methode IN ('virement', 'especes', 'carte', 'cheque', 'mobile')),
  statut TEXT NOT NULL DEFAULT 'pending' CHECK (statut IN ('completed', 'partial', 'pending')),
  date_paiement DATE NOT NULL,
  reference TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. TABLES IMMOBILIER COMPLÉMENTAIRES
-- ====================================

-- Create properties table
CREATE TABLE IF NOT EXISTS public.properties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nom TEXT NOT NULL,
  adresse TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('appartement', 'maison', 'commercial', 'terrain')),
  surface NUMERIC(8,2),
  prix_location NUMERIC(10,2),
  statut TEXT NOT NULL DEFAULT 'libre' CHECK (statut IN ('libre', 'occupee', 'maintenance')),
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create property contracts table
CREATE TABLE IF NOT EXISTS public.property_contracts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  date_debut DATE NOT NULL,
  date_fin DATE NOT NULL,
  loyer_mensuel NUMERIC(10,2) NOT NULL,
  depot_garantie NUMERIC(10,2) NOT NULL,
  statut TEXT NOT NULL DEFAULT 'actif' CHECK (statut IN ('actif', 'expire', 'resilié')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create property payments table
CREATE TABLE IF NOT EXISTS public.property_payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contract_id UUID NOT NULL REFERENCES public.property_contracts(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  montant NUMERIC(10,2) NOT NULL,
  date_paiement DATE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('loyer', 'charges', 'depot')),
  statut TEXT NOT NULL DEFAULT 'en_attente' CHECK (statut IN ('paye', 'en_attente', 'en_retard')),
  reference TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 4. TABLE COMPTABILITÉ
-- =====================

-- Create accounting entries table
CREATE TABLE IF NOT EXISTS public.accounting_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('recette', 'depense')),
  category TEXT NOT NULL,
  secteur TEXT NOT NULL CHECK (secteur IN ('immobilier', 'voyage', 'assurance', 'general')),
  amount NUMERIC(10,2) NOT NULL,
  reference TEXT NOT NULL,
  source_id TEXT,
  source_type TEXT CHECK (source_type IN ('property_payment', 'travel_payment', 'insurance_payment', 'manual')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 5. INDEXES POUR PERFORMANCE
-- ===========================

-- Travel indexes
CREATE INDEX IF NOT EXISTS idx_travel_clients_email ON public.travel_clients(email);
CREATE INDEX IF NOT EXISTS idx_travel_reservations_client_id ON public.travel_reservations(client_id);
CREATE INDEX IF NOT EXISTS idx_travel_reservations_date ON public.travel_reservations(date_debut, date_fin);
CREATE INDEX IF NOT EXISTS idx_travel_payments_reservation_id ON public.travel_payments(reservation_id);
CREATE INDEX IF NOT EXISTS idx_travel_payments_date ON public.travel_payments(date_paiement);

-- Insurance indexes
CREATE INDEX IF NOT EXISTS idx_insurance_clients_email ON public.insurance_clients(email);
CREATE INDEX IF NOT EXISTS idx_insurance_contracts_client_id ON public.insurance_contracts(client_id);
CREATE INDEX IF NOT EXISTS idx_insurance_contracts_type ON public.insurance_contracts(type_assurance);
CREATE INDEX IF NOT EXISTS idx_insurance_contracts_date ON public.insurance_contracts(date_debut, date_fin);
CREATE INDEX IF NOT EXISTS idx_insurance_payments_contract_id ON public.insurance_payments(contract_id);
CREATE INDEX IF NOT EXISTS idx_insurance_payments_date ON public.insurance_payments(date_paiement);

-- Property indexes
CREATE INDEX IF NOT EXISTS idx_properties_type ON public.properties(type);
CREATE INDEX IF NOT EXISTS idx_properties_statut ON public.properties(statut);
CREATE INDEX IF NOT EXISTS idx_property_contracts_client_id ON public.property_contracts(client_id);
CREATE INDEX IF NOT EXISTS idx_property_contracts_property_id ON public.property_contracts(property_id);
CREATE INDEX IF NOT EXISTS idx_property_payments_contract_id ON public.property_payments(contract_id);
CREATE INDEX IF NOT EXISTS idx_property_payments_date ON public.property_payments(date_paiement);

-- Accounting indexes
CREATE INDEX IF NOT EXISTS idx_accounting_entries_date ON public.accounting_entries(date);
CREATE INDEX IF NOT EXISTS idx_accounting_entries_secteur ON public.accounting_entries(secteur);

-- 6. ROW LEVEL SECURITY (RLS)
-- ============================

-- Enable RLS on all tables
ALTER TABLE public.travel_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.travel_reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.travel_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insurance_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insurance_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insurance_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounting_entries ENABLE ROW LEVEL SECURITY;

-- 7. POLICIES POUR UTILISATEURS AUTHENTIFIÉS
-- ===========================================

-- Travel policies
CREATE POLICY IF NOT EXISTS "Allow all operations for authenticated users" ON public.travel_clients
FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Allow all operations for authenticated users" ON public.travel_reservations
FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Allow all operations for authenticated users" ON public.travel_payments
FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Insurance policies
CREATE POLICY IF NOT EXISTS "Allow all operations for authenticated users" ON public.insurance_clients
FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Allow all operations for authenticated users" ON public.insurance_contracts
FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Allow all operations for authenticated users" ON public.insurance_payments
FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Property policies
CREATE POLICY IF NOT EXISTS "Allow all operations for authenticated users" ON public.properties
FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Allow all operations for authenticated users" ON public.property_contracts
FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Allow all operations for authenticated users" ON public.property_payments
FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Accounting policies
CREATE POLICY IF NOT EXISTS "Allow all operations for authenticated users" ON public.accounting_entries
FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 8. DONNÉES DE TEST (OPTIONNEL)
-- ===============================

-- Insérer quelques données de test pour voyage
INSERT INTO public.travel_clients (nom, prenom, email, telephone, adresse, nationalite, type_voyageur)
VALUES 
  ('Diallo', 'Amadou', 'amadou@email.com', '77 123 45 67', 'Sacré-Coeur, Dakar', 'senegalaise', 'individuel'),
  ('Sow', 'Fatou', 'fatou@email.com', '78 987 65 43', 'Plateau, Dakar', 'senegalaise', 'entreprise')
ON CONFLICT DO NOTHING;

-- Insérer quelques données de test pour assurance
INSERT INTO public.insurance_clients (nom, prenom, email, telephone, adresse, nationalite, type_client, numero_permis)
VALUES 
  ('Ndiaye', 'Moussa', 'moussa@email.com', '77 555 66 77', 'Almadies, Dakar', 'senegalaise', 'particulier', 'DK001234'),
  ('Kane', 'Aissatou', 'aissatou@email.com', '78 444 55 66', 'Point E, Dakar', 'senegalaise', 'particulier', NULL)
ON CONFLICT DO NOTHING;