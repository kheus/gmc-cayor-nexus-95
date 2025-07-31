-- ============================================
-- PHASE 2: FIX SECURITY DEFINER VIEWS
-- ============================================

-- Drop and recreate views without SECURITY DEFINER to fix security warnings
-- The existing views are causing security definer warnings

-- Drop existing views
DROP VIEW IF EXISTS public.property_clients;
DROP VIEW IF EXISTS public.travel_clients;
DROP VIEW IF EXISTS public.insurance_clients;
DROP VIEW IF EXISTS public.revenue_by_sector;
DROP VIEW IF EXISTS public.clients_by_sector;

-- Recreate property_clients view as regular view
CREATE VIEW public.property_clients AS
SELECT 
  id, nom, prenom, email, telephone, adresse, ville,
  created_at, updated_at, date_naissance, statut, profession
FROM public.clients 
WHERE 'immobilier' = ANY(secteurs);

-- Recreate travel_clients view as regular view  
CREATE VIEW public.travel_clients AS
SELECT 
  id, nom, prenom, email, telephone, adresse, ville,
  created_at, updated_at, nationalite, type_voyageur, 
  numero_passeport, preferences
FROM public.clients 
WHERE 'voyage' = ANY(secteurs);

-- Recreate insurance_clients view as regular view
CREATE VIEW public.insurance_clients AS
SELECT 
  id, nom, prenom, email, telephone, adresse, ville,
  created_at, updated_at, nationalite, numero_permis, 
  type_client, preferences
FROM public.clients 
WHERE 'assurance' = ANY(secteurs);

-- Recreate revenue_by_sector view as regular view
CREATE VIEW public.revenue_by_sector AS
SELECT 
  secteur,
  COUNT(*) as nombre_paiements,
  SUM(montant) as total_montant,
  AVG(montant) as montant_moyen,
  COUNT(CASE WHEN statut = 'completed' THEN 1 END) as paiements_completes,
  COUNT(CASE WHEN statut = 'pending' THEN 1 END) as paiements_en_attente
FROM public.paiements
GROUP BY secteur;

-- Recreate clients_by_sector view as regular view
CREATE VIEW public.clients_by_sector AS
SELECT 
  unnest(secteurs) as secteur,
  COUNT(*) as nombre_clients,
  COUNT(CASE WHEN statut = 'actif' THEN 1 END) as clients_actifs
FROM public.clients
GROUP BY unnest(secteurs);