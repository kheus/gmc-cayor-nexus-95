-- ============================================
-- PHASE 1: CRITICAL SECURITY FIXES - RLS AND ACCESS CONTROL
-- ============================================

-- 1. ENABLE RLS ON VULNERABLE TABLES
-- ============================================

-- Enable RLS on clients table (CRITICAL - contains personal data)
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- Enable RLS on paiements table (CRITICAL - contains financial data) 
ALTER TABLE public.paiements ENABLE ROW LEVEL SECURITY;

-- 2. CREATE SECURE RLS POLICIES FOR CLIENTS TABLE
-- ============================================

-- Policy for clients table - authenticated users can view all clients
CREATE POLICY "clients_select_policy" ON public.clients
  FOR SELECT 
  USING (auth.role() = 'authenticated');

-- Policy for clients table - authenticated users can insert clients
CREATE POLICY "clients_insert_policy" ON public.clients
  FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

-- Policy for clients table - authenticated users can update clients
CREATE POLICY "clients_update_policy" ON public.clients
  FOR UPDATE 
  USING (auth.role() = 'authenticated');

-- Policy for clients table - authenticated users can delete clients
CREATE POLICY "clients_delete_policy" ON public.clients
  FOR DELETE 
  USING (auth.role() = 'authenticated');

-- 3. CREATE SECURE RLS POLICIES FOR PAIEMENTS TABLE
-- ============================================

-- Policy for paiements table - authenticated users can view all payments
CREATE POLICY "paiements_select_policy" ON public.paiements
  FOR SELECT 
  USING (auth.role() = 'authenticated');

-- Policy for paiements table - authenticated users can insert payments
CREATE POLICY "paiements_insert_policy" ON public.paiements
  FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

-- Policy for paiements table - authenticated users can update payments
CREATE POLICY "paiements_update_policy" ON public.paiements
  FOR UPDATE 
  USING (auth.role() = 'authenticated');

-- Policy for paiements table - authenticated users can delete payments
CREATE POLICY "paiements_delete_policy" ON public.paiements
  FOR DELETE 
  USING (auth.role() = 'authenticated');

-- 4. ENHANCE PROFILES TABLE SECURITY
-- ============================================

-- Add policy to prevent users from changing their own role
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Users can update their own profile (excluding role)" ON public.profiles
  FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id 
    AND (
      OLD.role = NEW.role OR 
      get_current_user_role() = 'admin'
    )
  );

-- 5. IMPROVE DATABASE FUNCTION SECURITY
-- ============================================

-- Recreate update_updated_at function with proper security
DROP FUNCTION IF EXISTS public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Recreate client sector functions with proper security
DROP FUNCTION IF EXISTS public.add_client_secteur(uuid, text);
DROP FUNCTION IF EXISTS public.remove_client_secteur(uuid, text);
DROP FUNCTION IF EXISTS public.get_clients_by_secteur(text);

CREATE OR REPLACE FUNCTION public.add_client_secteur(client_id uuid, new_secteur text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Only allow authenticated users
  IF auth.role() != 'authenticated' THEN
    RAISE EXCEPTION 'Access denied: Authentication required';
  END IF;
  
  UPDATE public.clients 
  SET secteurs = array_append(secteurs, new_secteur)
  WHERE id = client_id 
  AND NOT (new_secteur = ANY(secteurs))
  AND new_secteur IN ('immobilier', 'voyage', 'assurance');
END;
$$;

CREATE OR REPLACE FUNCTION public.remove_client_secteur(client_id uuid, secteur_to_remove text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Only allow authenticated users
  IF auth.role() != 'authenticated' THEN
    RAISE EXCEPTION 'Access denied: Authentication required';
  END IF;
  
  UPDATE public.clients 
  SET secteurs = array_remove(secteurs, secteur_to_remove)
  WHERE id = client_id 
  AND array_length(array_remove(secteurs, secteur_to_remove), 1) > 0;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_clients_by_secteur(target_secteur text)
RETURNS TABLE(id uuid, nom text, prenom text, email text, telephone text, adresse text, ville text, secteurs text[], statut text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Only allow authenticated users
  IF auth.role() != 'authenticated' THEN
    RAISE EXCEPTION 'Access denied: Authentication required';
  END IF;
  
  RETURN QUERY
  SELECT c.id, c.nom, c.prenom, c.email, c.telephone, 
         c.adresse, c.ville, c.secteurs, c.statut
  FROM public.clients c
  WHERE target_secteur = ANY(c.secteurs)
  ORDER BY c.created_at DESC;
END;
$$;

-- 6. ADD AUDIT LOGGING FUNCTION
-- ============================================

-- Create audit log table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name text NOT NULL,
  operation text NOT NULL,
  user_id uuid REFERENCES auth.users(id),
  old_values jsonb,
  new_values jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on audit logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "audit_logs_admin_only" ON public.audit_logs
  FOR ALL
  USING (get_current_user_role() = 'admin');

-- Create audit logging function
CREATE OR REPLACE FUNCTION public.log_audit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.audit_logs (table_name, operation, user_id, old_values, new_values)
  VALUES (
    TG_TABLE_NAME,
    TG_OP,
    auth.uid(),
    CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
    CASE WHEN TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN to_jsonb(NEW) ELSE NULL END
  );
  
  RETURN CASE WHEN TG_OP = 'DELETE' THEN OLD ELSE NEW END;
END;
$$;