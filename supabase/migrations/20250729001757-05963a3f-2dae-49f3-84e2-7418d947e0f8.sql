-- ============================================
-- SECURITY FIX: REMOVE SECURITY DEFINER FROM VIEWS
-- ============================================

-- Drop all existing problematic views first
DROP VIEW IF EXISTS public.property_clients CASCADE;
DROP VIEW IF EXISTS public.travel_clients CASCADE; 
DROP VIEW IF EXISTS public.insurance_clients CASCADE;
DROP VIEW IF EXISTS public.revenue_by_sector CASCADE;
DROP VIEW IF EXISTS public.clients_by_sector CASCADE;
DROP VIEW IF EXISTS public.revenue_by_type CASCADE;

-- Recreate all views as regular views (without SECURITY DEFINER)

-- Property clients view
CREATE VIEW public.property_clients AS
SELECT 
  id, nom, prenom, email, telephone, adresse, ville,
  created_at, updated_at, date_naissance, statut, profession
FROM public.clients 
WHERE 'immobilier' = ANY(secteurs);

-- Travel clients view  
CREATE VIEW public.travel_clients AS
SELECT 
  id, nom, prenom, email, telephone, adresse, ville,
  created_at, updated_at, nationalite, type_voyageur, 
  numero_passeport, preferences
FROM public.clients 
WHERE 'voyage' = ANY(secteurs);

-- Insurance clients view
CREATE VIEW public.insurance_clients AS
SELECT 
  id, nom, prenom, email, telephone, adresse, ville,
  created_at, updated_at, nationalite, numero_permis, 
  type_client, preferences
FROM public.clients 
WHERE 'assurance' = ANY(secteurs);

-- Revenue by payment type view
CREATE VIEW public.revenue_by_type AS
SELECT 
  type_paiement,
  COUNT(*) as nombre_paiements,
  SUM(montant) as total_montant,
  AVG(montant) as montant_moyen,
  COUNT(CASE WHEN statut = 'recu' THEN 1 END) as paiements_recus,
  COUNT(CASE WHEN statut = 'en_attente' THEN 1 END) as paiements_en_attente,
  COUNT(CASE WHEN statut = 'rejete' THEN 1 END) as paiements_rejetes
FROM public.paiements
GROUP BY type_paiement;

-- Clients by sector view
CREATE VIEW public.clients_by_sector AS
SELECT 
  unnest(secteurs) as secteur,
  COUNT(*) as nombre_clients,
  COUNT(CASE WHEN statut = 'actif' THEN 1 END) as clients_actifs
FROM public.clients
GROUP BY unnest(secteurs);