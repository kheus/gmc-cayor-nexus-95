-- Création des tables pour la gestion des prospects
CREATE TABLE IF NOT EXISTS public.client_follow_ups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL,
  last_contact TIMESTAMPTZ,
  next_contact TIMESTAMPTZ,
  contact_type TEXT CHECK (contact_type IN ('email', 'sms', 'phone', 'meeting')) DEFAULT 'email',
  notes TEXT,
  status TEXT CHECK (status IN ('prospect', 'actif', 'a_relancer', 'inactif')) DEFAULT 'prospect',
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(client_id)
);

CREATE TABLE IF NOT EXISTS public.communication_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('email', 'sms')) NOT NULL,
  subject TEXT,
  content TEXT NOT NULL,
  sector TEXT CHECK (sector IN ('immobilier', 'voyage', 'assurance', 'general')) DEFAULT 'general',
  target_status TEXT CHECK (target_status IN ('prospect', 'actif', 'a_relancer')) DEFAULT 'prospect',
  usage_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.communication_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL,
  type TEXT CHECK (type IN ('email', 'sms', 'phone', 'meeting')) NOT NULL,
  subject TEXT,
  content TEXT,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  status TEXT CHECK (status IN ('sent', 'delivered', 'failed')) DEFAULT 'sent',
  template_id UUID,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_client_follow_ups_client_id ON public.client_follow_ups(client_id);
CREATE INDEX IF NOT EXISTS idx_client_follow_ups_next_contact ON public.client_follow_ups(next_contact);
CREATE INDEX IF NOT EXISTS idx_client_follow_ups_status ON public.client_follow_ups(status);
CREATE INDEX IF NOT EXISTS idx_communication_templates_type ON public.communication_templates(type);
CREATE INDEX IF NOT EXISTS idx_communication_templates_sector ON public.communication_templates(sector);
CREATE INDEX IF NOT EXISTS idx_communication_logs_client_id ON public.communication_logs(client_id);
CREATE INDEX IF NOT EXISTS idx_communication_logs_sent_at ON public.communication_logs(sent_at);

-- Triggers pour updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_client_follow_ups_updated_at ON public.client_follow_ups;
CREATE TRIGGER update_client_follow_ups_updated_at
  BEFORE UPDATE ON public.client_follow_ups
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_communication_templates_updated_at ON public.communication_templates;
CREATE TRIGGER update_communication_templates_updated_at
  BEFORE UPDATE ON public.communication_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_communication_logs_updated_at ON public.communication_logs;
CREATE TRIGGER update_communication_logs_updated_at
  BEFORE UPDATE ON public.communication_logs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Politiques RLS
ALTER TABLE public.client_follow_ups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communication_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communication_logs ENABLE ROW LEVEL SECURITY;

-- Policies pour client_follow_ups
CREATE POLICY "client_follow_ups_select_policy" ON public.client_follow_ups
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "client_follow_ups_insert_policy" ON public.client_follow_ups
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "client_follow_ups_update_policy" ON public.client_follow_ups
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "client_follow_ups_delete_policy" ON public.client_follow_ups
  FOR DELETE USING (auth.role() = 'authenticated');

-- Policies pour communication_templates
CREATE POLICY "communication_templates_select_policy" ON public.communication_templates
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "communication_templates_insert_policy" ON public.communication_templates
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "communication_templates_update_policy" ON public.communication_templates
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "communication_templates_delete_policy" ON public.communication_templates
  FOR DELETE USING (auth.role() = 'authenticated');

-- Policies pour communication_logs
CREATE POLICY "communication_logs_select_policy" ON public.communication_logs
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "communication_logs_insert_policy" ON public.communication_logs
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "communication_logs_update_policy" ON public.communication_logs
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "communication_logs_delete_policy" ON public.communication_logs
  FOR DELETE USING (auth.role() = 'authenticated');

-- Fonction pour marquer un client pour suivi
CREATE OR REPLACE FUNCTION public.mark_client_for_follow_up(
  p_client_id UUID,
  p_next_contact_date TIMESTAMPTZ,
  p_priority TEXT DEFAULT 'medium',
  p_notes TEXT DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.client_follow_ups (client_id, next_contact, priority, notes)
  VALUES (p_client_id, p_next_contact_date, p_priority, p_notes)
  ON CONFLICT (client_id) 
  DO UPDATE SET 
    next_contact = p_next_contact_date,
    priority = p_priority,
    notes = COALESCE(p_notes, client_follow_ups.notes),
    updated_at = now();
END;
$$;

-- Fonction pour obtenir les clients à contacter aujourd'hui
CREATE OR REPLACE FUNCTION public.get_clients_due_today()
RETURNS TABLE(
  client_id UUID,
  client_name TEXT,
  client_email TEXT,
  next_contact TIMESTAMPTZ,
  priority TEXT,
  notes TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    cf.client_id,
    CONCAT(c.prenom, ' ', c.nom) as client_name,
    c.email as client_email,
    cf.next_contact,
    cf.priority,
    cf.notes
  FROM public.client_follow_ups cf
  JOIN public.clients c ON c.id = cf.client_id
  WHERE cf.next_contact::date <= CURRENT_DATE
    AND cf.status IN ('prospect', 'a_relancer')
  ORDER BY cf.next_contact ASC;
END;
$$;

-- Données de test pour les modèles
INSERT INTO public.communication_templates (name, type, subject, content, sector, target_status) VALUES
('Premier contact - Immobilier', 'email', 'Votre projet immobilier avec GMC', 'Bonjour,\n\nNous serions ravis de vous accompagner dans votre projet immobilier. Notre équipe expérimentée est à votre disposition pour vous conseiller.\n\nCordialement,\nÉquipe GMC', 'immobilier', 'prospect'),
('Relance prospect - Voyage', 'sms', '', 'Bonjour, nous revenons vers vous concernant votre projet voyage. Contactez-nous au 0X XX XX XX XX.', 'voyage', 'a_relancer'),
('Suivi client actif', 'email', 'Suivi de votre dossier', 'Bonjour,\n\nNous espérons que tout se passe bien. N''hésitez pas à nous contacter si vous avez des questions.\n\nCordialement,\nÉquipe GMC', 'general', 'actif')
ON CONFLICT DO NOTHING;