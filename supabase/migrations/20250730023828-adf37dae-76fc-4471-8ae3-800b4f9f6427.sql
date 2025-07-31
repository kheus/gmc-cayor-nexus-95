-- Activer RLS sur la table payments
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Créer des politiques RLS pour permettre aux utilisateurs de voir leurs propres paiements
CREATE POLICY "Utilisateurs peuvent voir leurs propres paiements" 
ON public.payments 
FOR SELECT 
USING (true); -- Pour l'instant, permettre à tous les utilisateurs authentifiés de voir tous les paiements

-- Créer une politique pour permettre l'insertion
CREATE POLICY "Utilisateurs peuvent créer des paiements" 
ON public.payments 
FOR INSERT 
WITH CHECK (true); -- Pour l'instant, permettre à tous les utilisateurs authentifiés de créer des paiements

-- Créer une politique pour permettre la mise à jour
CREATE POLICY "Utilisateurs peuvent modifier des paiements" 
ON public.payments 
FOR UPDATE 
USING (true)
WITH CHECK (true);

-- Créer une politique pour permettre la suppression
CREATE POLICY "Utilisateurs peuvent supprimer des paiements" 
ON public.payments 
FOR DELETE 
USING (true);