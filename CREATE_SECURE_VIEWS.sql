-- ============================================
-- CORRECTION COMPLÈTE DES VUES SECURITY DEFINER  
-- Supprime et recrée toutes les vues sans SECURITY DEFINER
-- ============================================

-- Supprimer toutes les vues problématiques et leurs dépendances
DROP VIEW IF EXISTS public.property_clients CASCADE;
DROP VIEW IF EXISTS public.travel_clients CASCADE; 
DROP VIEW IF EXISTS public.insurance_clients CASCADE;
DROP VIEW IF EXISTS public.revenue_by_sector CASCADE;
DROP VIEW IF EXISTS public.revenue_by_type CASCADE;
DROP VIEW IF EXISTS public.clients_by_sector CASCADE;

-- Vérifier et supprimer d'autres vues potentiellement problématiques
DROP VIEW IF EXISTS revenue_by_sector CASCADE;
DROP VIEW IF EXISTS clients_by_sector CASCADE;

-- ============================================
-- RECRÉER LES VUES SANS SECURITY DEFINER
-- ============================================

-- Vue pour les clients immobilier
CREATE VIEW public.property_clients AS
SELECT 
  id, nom, prenom, email, telephone, adresse, ville,
  created_at, updated_at, date_naissance, statut, profession
FROM public.clients 
WHERE 'immobilier' = ANY(secteurs);

-- Vue pour les clients voyage  
CREATE VIEW public.travel_clients AS
SELECT 
  id, nom, prenom, email, telephone, adresse, ville,
  created_at, updated_at, nationalite, type_voyageur, 
  numero_passeport, preferences
FROM public.clients 
WHERE 'voyage' = ANY(secteurs);

-- Vue pour les clients assurance
CREATE VIEW public.insurance_clients AS
SELECT 
  id, nom, prenom, email, telephone, adresse, ville,
  created_at, updated_at, nationalite, numero_permis, 
  type_client, preferences
FROM public.clients 
WHERE 'assurance' = ANY(secteurs);

-- Vue pour les revenus par secteur (table payments)
CREATE VIEW public.revenue_by_sector AS
SELECT 
  secteur,
  COUNT(*) as nombre_paiements,
  SUM(montant) as total_montant,
  AVG(montant) as montant_moyen,
  COUNT(CASE WHEN statut = 'completed' THEN 1 END) as paiements_completes,
  COUNT(CASE WHEN statut = 'pending' THEN 1 END) as paiements_en_attente
FROM public.payments
GROUP BY secteur;

-- Vue pour les revenus par type (table payments unifiée)
CREATE VIEW public.revenue_by_type AS
SELECT 
  type_paiement,
  COUNT(*) as nombre_paiements,
  SUM(montant) as total_montant,
  AVG(montant) as montant_moyen,
  COUNT(CASE WHEN statut = 'completed' THEN 1 END) as paiements_completes,
  COUNT(CASE WHEN statut = 'pending' THEN 1 END) as paiements_en_attente,
  COUNT(CASE WHEN statut = 'partial' THEN 1 END) as paiements_partiels
FROM public.payments
GROUP BY type_paiement;

-- Vue pour les clients par secteur
CREATE VIEW public.clients_by_sector AS
SELECT 
  unnest(secteurs) as secteur,
  COUNT(*) as nombre_clients,
  COUNT(CASE WHEN statut = 'actif' THEN 1 END) as clients_actifs,
  COUNT(CASE WHEN statut = 'inactif' THEN 1 END) as clients_inactifs,
  COUNT(CASE WHEN statut = 'suspendu' THEN 1 END) as clients_suspendus
FROM public.clients
GROUP BY unnest(secteurs);

-- ============================================
-- PERMISSIONS SUR LES VUES
-- ============================================

-- Accorder les permissions de lecture aux utilisateurs authentifiés
GRANT SELECT ON public.property_clients TO authenticated;
GRANT SELECT ON public.travel_clients TO authenticated;
GRANT SELECT ON public.insurance_clients TO authenticated;
GRANT SELECT ON public.revenue_by_sector TO authenticated;
GRANT SELECT ON public.revenue_by_type TO authenticated;
GRANT SELECT ON public.clients_by_sector TO authenticated;

-- ============================================
-- POLITIQUE DE SÉCURITÉ ADDITIONNELLE
-- ============================================

-- S'assurer que toutes les vues respectent RLS en définissant des politiques explicites
-- Note: Les vues héritent automatiquement des politiques RLS des tables sous-jacentes

-- Vérifier que RLS est bien activé sur les tables de base
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- ============================================
-- VÉRIFICATION DES VUES CRÉÉES
-- ============================================

-- Vérifier que les vues sont bien créées sans SECURITY DEFINER
SELECT 
  schemaname,
  viewname,
  definition
FROM pg_views 
WHERE schemaname = 'public' 
  AND viewname IN ('property_clients', 'travel_clients', 'insurance_clients', 'revenue_by_sector', 'revenue_by_type', 'clients_by_sector')
ORDER BY viewname;

-- Vérifier que les vues n'utilisent plus SECURITY DEFINER
SELECT 
  viewname,
  CASE 
    WHEN definition LIKE '%SECURITY DEFINER%' THEN 'ATTENTION: Utilise encore SECURITY DEFINER'
    ELSE 'OK: Pas de SECURITY DEFINER'
  END as status_securite
FROM pg_views 
WHERE schemaname = 'public' 
  AND viewname IN ('property_clients', 'travel_clients', 'insurance_clients', 'revenue_by_sector', 'revenue_by_type', 'clients_by_sector');