-- Force complete removal of all potentially problematic views
-- Check all schemas for SECURITY DEFINER views and remove them

DO $$
DECLARE
    view_record RECORD;
BEGIN
    -- Drop all views that might have SECURITY DEFINER in any schema
    FOR view_record IN 
        SELECT schemaname, viewname 
        FROM pg_views 
        WHERE viewname IN ('property_clients', 'travel_clients', 'insurance_clients', 'revenue_by_sector', 'clients_by_sector', 'revenue_by_type')
    LOOP
        EXECUTE format('DROP VIEW IF EXISTS %I.%I CASCADE', view_record.schemaname, view_record.viewname);
    END LOOP;
END $$;

-- Now recreate the views as simple views
CREATE VIEW public.property_clients AS
SELECT 
  id, nom, prenom, email, telephone, adresse, ville,
  created_at, updated_at, date_naissance, statut, profession
FROM public.clients 
WHERE 'immobilier' = ANY(secteurs);

CREATE VIEW public.travel_clients AS
SELECT 
  id, nom, prenom, email, telephone, adresse, ville,
  created_at, updated_at, nationalite, type_voyageur, 
  numero_passeport, preferences
FROM public.clients 
WHERE 'voyage' = ANY(secteurs);

CREATE VIEW public.insurance_clients AS
SELECT 
  id, nom, prenom, email, telephone, adresse, ville,
  created_at, updated_at, nationalite, numero_permis, 
  type_client, preferences
FROM public.clients 
WHERE 'assurance' = ANY(secteurs);

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

CREATE VIEW public.clients_by_sector AS
SELECT 
  unnest(secteurs) as secteur,
  COUNT(*) as nombre_clients,
  COUNT(CASE WHEN statut = 'actif' THEN 1 END) as clients_actifs
FROM public.clients
GROUP BY unnest(secteurs);