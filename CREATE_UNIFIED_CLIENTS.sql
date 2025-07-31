-- ==============================================
-- MIGRATION VERS TABLE CLIENTS UNIFIÉE
-- Script pour migrer vers le nouveau système unifié
-- ==============================================

-- 1. SUPPRESSION DES TABLES SÉPARÉES (SI EXISTENT)
-- ================================================
DROP TABLE IF EXISTS public.travel_clients CASCADE;
DROP TABLE IF EXISTS public.insurance_clients CASCADE;

-- 2. MODIFICATION DE LA TABLE CLIENTS EXISTANTE
-- =============================================

-- Ajouter les nouvelles colonnes pour unifier tous les secteurs
ALTER TABLE public.clients 
ADD COLUMN IF NOT EXISTS secteurs TEXT[] DEFAULT ARRAY['immobilier'],
ADD COLUMN IF NOT EXISTS nationalite TEXT,
ADD COLUMN IF NOT EXISTS type_voyageur TEXT CHECK (type_voyageur IN ('individuel', 'groupe', 'entreprise')),
ADD COLUMN IF NOT EXISTS numero_passeport TEXT,
ADD COLUMN IF NOT EXISTS numero_permis TEXT,
ADD COLUMN IF NOT EXISTS type_client TEXT CHECK (type_client IN ('particulier', 'entreprise')),
ADD COLUMN IF NOT EXISTS preferences TEXT;

-- S'assurer que prenom n'est pas nullable
ALTER TABLE public.clients ALTER COLUMN prenom SET NOT NULL;
ALTER TABLE public.clients ALTER COLUMN prenom SET DEFAULT '';

-- Mettre à jour les clients existants pour avoir au moins le secteur immobilier
UPDATE public.clients 
SET secteurs = ARRAY['immobilier']
WHERE secteurs IS NULL OR array_length(secteurs, 1) IS NULL;

UPDATE public.clients 
SET prenom = COALESCE(prenom, '')
WHERE prenom IS NULL;

UPDATE public.clients 
SET nationalite = COALESCE(nationalite, '')
WHERE nationalite IS NULL;

UPDATE public.clients 
SET preferences = COALESCE(preferences, '')
WHERE preferences IS NULL;

-- 3. CONTRAINTES ET VALIDATIONS
-- =============================

-- Contrainte pour s'assurer qu'au moins un secteur est défini
ALTER TABLE public.clients 
ADD CONSTRAINT check_secteurs_not_empty 
CHECK (array_length(secteurs, 1) > 0);

-- Contrainte pour valider les secteurs
ALTER TABLE public.clients 
ADD CONSTRAINT check_valid_secteurs 
CHECK (secteurs <@ ARRAY['immobilier', 'voyage', 'assurance']);

-- 4. INDEXES OPTIMISÉS POUR LES SECTEURS
-- ======================================

-- Index GIN pour recherche efficace dans les secteurs
CREATE INDEX IF NOT EXISTS idx_clients_secteurs_gin ON public.clients USING GIN(secteurs);

-- Index pour les champs spécifiques voyage
CREATE INDEX IF NOT EXISTS idx_clients_type_voyageur ON public.clients(type_voyageur) WHERE type_voyageur IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_clients_numero_passeport ON public.clients(numero_passeport) WHERE numero_passeport IS NOT NULL;

-- Index pour les champs spécifiques assurance  
CREATE INDEX IF NOT EXISTS idx_clients_numero_permis ON public.clients(numero_permis) WHERE numero_permis IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_clients_type_client ON public.clients(type_client) WHERE type_client IS NOT NULL;

-- Index pour la nationalité
CREATE INDEX IF NOT EXISTS idx_clients_nationalite ON public.clients(nationalite) WHERE nationalite IS NOT NULL;

-- 5. VUES POUR COMPATIBILITÉ AVEC L'ANCIEN SYSTÈME
-- ================================================

-- Vue pour les clients immobilier (pour compatibilité)
CREATE OR REPLACE VIEW property_clients AS 
SELECT 
  id, nom, prenom, email, telephone, adresse, ville, profession, 
  date_naissance, statut, created_at, updated_at
FROM public.clients 
WHERE 'immobilier' = ANY(secteurs);

-- Vue pour les clients voyage
CREATE OR REPLACE VIEW travel_clients AS 
SELECT 
  id, nom, prenom, email, telephone, adresse, ville, nationalite,
  type_voyageur, numero_passeport, preferences, created_at, updated_at
FROM public.clients 
WHERE 'voyage' = ANY(secteurs);

-- Vue pour les clients assurance
CREATE OR REPLACE VIEW insurance_clients AS 
SELECT 
  id, nom, prenom, email, telephone, adresse, ville, nationalite,
  numero_permis, type_client, preferences, created_at, updated_at
FROM public.clients 
WHERE 'assurance' = ANY(secteurs);

-- 6. FONCTIONS UTILITAIRES
-- ========================

-- Fonction pour ajouter un secteur à un client
CREATE OR REPLACE FUNCTION add_client_secteur(client_id UUID, new_secteur TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE public.clients 
  SET secteurs = array_append(secteurs, new_secteur)
  WHERE id = client_id 
  AND NOT (new_secteur = ANY(secteurs))
  AND new_secteur IN ('immobilier', 'voyage', 'assurance');
END;
$$ LANGUAGE plpgsql;

-- Fonction pour retirer un secteur d'un client
CREATE OR REPLACE FUNCTION remove_client_secteur(client_id UUID, secteur_to_remove TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE public.clients 
  SET secteurs = array_remove(secteurs, secteur_to_remove)
  WHERE id = client_id 
  AND array_length(array_remove(secteurs, secteur_to_remove), 1) > 0; -- Garder au moins un secteur
END;
$$ LANGUAGE plpgsql;

-- Fonction pour obtenir les clients par secteur
CREATE OR REPLACE FUNCTION get_clients_by_secteur(target_secteur TEXT)
RETURNS TABLE(
  id UUID, nom TEXT, prenom TEXT, email TEXT, telephone TEXT, 
  adresse TEXT, ville TEXT, secteurs TEXT[], statut TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT c.id, c.nom, c.prenom, c.email, c.telephone, 
         c.adresse, c.ville, c.secteurs, c.statut
  FROM public.clients c
  WHERE target_secteur = ANY(c.secteurs)
  ORDER BY c.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- 7. DONNÉES DE TEST POUR LE SYSTÈME UNIFIÉ
-- ==========================================

-- Insérer quelques clients multi-secteurs pour tester
INSERT INTO public.clients (
  nom, prenom, email, telephone, adresse, ville, nationalite,
  secteurs, profession, type_voyageur, numero_passeport, type_client, preferences
) VALUES 
(
  'Diallo', 'Amadou', 'amadou.multi@email.com', '77 111 22 33', 
  'Almadies, Dakar', 'Dakar', 'sénégalaise',
  ARRAY['immobilier', 'voyage'], 'Entrepreneur', 'entreprise', 'DK123456', 
  'entreprise', 'Client VIP - multi-secteurs'
),
(
  'Fall', 'Fatou', 'fatou.voyage@email.com', '78 444 55 66', 
  'Point E, Dakar', 'Dakar', 'sénégalaise',
  ARRAY['voyage', 'assurance'], NULL, 'individuel', 'DK789012', 
  'particulier', 'Voyages fréquents en Europe'
),
(
  'Sow', 'Moussa', 'moussa.immobilier@email.com', '77 777 88 99', 
  'Plateau, Dakar', 'Dakar', 'sénégalaise',
  ARRAY['immobilier'], 'Architecte', NULL, NULL, 
  NULL, 'Spécialisé en immobilier commercial'
)
ON CONFLICT (email) DO NOTHING;

-- 8. COMMENTAIRES SUR LES COLONNES
-- ================================

COMMENT ON COLUMN public.clients.secteurs IS 'Secteurs d''activité du client: immobilier, voyage, assurance';
COMMENT ON COLUMN public.clients.type_voyageur IS 'Type de voyageur pour le secteur voyage';
COMMENT ON COLUMN public.clients.numero_passeport IS 'Numéro de passeport pour le secteur voyage';
COMMENT ON COLUMN public.clients.numero_permis IS 'Numéro de permis de conduire pour le secteur assurance';
COMMENT ON COLUMN public.clients.type_client IS 'Type de client pour le secteur assurance';
COMMENT ON COLUMN public.clients.preferences IS 'Préférences et notes générales du client';

-- 9. GRANTS ET PERMISSIONS
-- ========================

-- S'assurer que les utilisateurs authentifiés ont accès
GRANT ALL ON public.clients TO authenticated;
GRANT EXECUTE ON FUNCTION add_client_secteur(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION remove_client_secteur(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_clients_by_secteur(TEXT) TO authenticated;

-- 10. VÉRIFICATIONS FINALES
-- =========================

-- Vérifier la structure finale
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'clients' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- Compter les clients par secteur
SELECT 
  unnest(secteurs) as secteur,
  COUNT(*) as nombre_clients
FROM public.clients 
GROUP BY unnest(secteurs)
ORDER BY nombre_clients DESC;