-- ========================================
-- TABLES POUR LE SUIVI DES CLIENTS - GMC
-- ========================================

-- 1. TABLE SUIVI DES CLIENTS
-- ========================================
CREATE TABLE IF NOT EXISTS public.client_follow_ups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Référence au client
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  
  -- Dates de contact
  last_contact TIMESTAMPTZ NOT NULL,
  next_contact TIMESTAMPTZ,
  
  -- Type et statut
  contact_type TEXT NOT NULL CHECK (contact_type IN ('email', 'sms', 'phone', 'meeting')),
  status TEXT NOT NULL DEFAULT 'prospect' CHECK (status IN ('prospect', 'actif', 'a_relancer', 'inactif')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  
  -- Notes et observations
  notes TEXT,
  
  -- Contrainte unicité par client
  UNIQUE(client_id)
);

-- 2. TABLE MODÈLES DE COMMUNICATION
-- ========================================
CREATE TABLE IF NOT EXISTS public.communication_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Informations du modèle
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('email', 'sms')),
  subject TEXT, -- Pour les emails seulement
  content TEXT NOT NULL,
  
  -- Catégorisation
  sector TEXT CHECK (sector IN ('immobilier', 'voyage', 'assurance', 'general')),
  target_status TEXT CHECK (target_status IN ('prospect', 'actif', 'a_relancer', 'inactif')),
  
  -- Métadonnées
  usage_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true
);

-- 3. TABLE LOGS DE COMMUNICATION
-- ========================================
CREATE TABLE IF NOT EXISTS public.communication_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Référence au client
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  
  -- Détails de la communication
  type TEXT NOT NULL CHECK (type IN ('email', 'sms', 'phone', 'meeting')),
  subject TEXT, -- Pour les emails
  content TEXT,
  
  -- Timing et statut
  sent_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'failed', 'pending')),
  
  -- Références
  template_id UUID REFERENCES public.communication_templates(id),
  
  -- Métadonnées
  metadata JSONB DEFAULT '{}'
);

-- 4. INDEX POUR PERFORMANCE
-- ========================================

-- Index sur les suivis
CREATE INDEX IF NOT EXISTS idx_client_follow_ups_client_id ON public.client_follow_ups(client_id);
CREATE INDEX IF NOT EXISTS idx_client_follow_ups_next_contact ON public.client_follow_ups(next_contact);
CREATE INDEX IF NOT EXISTS idx_client_follow_ups_status ON public.client_follow_ups(status);
CREATE INDEX IF NOT EXISTS idx_client_follow_ups_priority ON public.client_follow_ups(priority);

-- Index sur les modèles
CREATE INDEX IF NOT EXISTS idx_communication_templates_type ON public.communication_templates(type);
CREATE INDEX IF NOT EXISTS idx_communication_templates_sector ON public.communication_templates(sector);
CREATE INDEX IF NOT EXISTS idx_communication_templates_target_status ON public.communication_templates(target_status);
CREATE INDEX IF NOT EXISTS idx_communication_templates_active ON public.communication_templates(is_active);

-- Index sur les logs
CREATE INDEX IF NOT EXISTS idx_communication_logs_client_id ON public.communication_logs(client_id);
CREATE INDEX IF NOT EXISTS idx_communication_logs_type ON public.communication_logs(type);
CREATE INDEX IF NOT EXISTS idx_communication_logs_sent_at ON public.communication_logs(sent_at);
CREATE INDEX IF NOT EXISTS idx_communication_logs_status ON public.communication_logs(status);
CREATE INDEX IF NOT EXISTS idx_communication_logs_template_id ON public.communication_logs(template_id);

-- 5. TRIGGERS POUR UPDATED_AT
-- ========================================

-- Trigger pour client_follow_ups
CREATE TRIGGER trigger_client_follow_ups_updated_at
  BEFORE UPDATE ON public.client_follow_ups
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Trigger pour communication_templates
CREATE TRIGGER trigger_communication_templates_updated_at
  BEFORE UPDATE ON public.communication_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Trigger pour communication_logs
CREATE TRIGGER trigger_communication_logs_updated_at
  BEFORE UPDATE ON public.communication_logs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- 6. ROW LEVEL SECURITY (RLS)
-- ========================================

-- Activer RLS
ALTER TABLE public.client_follow_ups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communication_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communication_logs ENABLE ROW LEVEL SECURITY;

-- Politiques pour client_follow_ups
CREATE POLICY "client_follow_ups_select" ON public.client_follow_ups
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "client_follow_ups_insert" ON public.client_follow_ups
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "client_follow_ups_update" ON public.client_follow_ups
  FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "client_follow_ups_delete" ON public.client_follow_ups
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- Politiques pour communication_templates
CREATE POLICY "communication_templates_select" ON public.communication_templates
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "communication_templates_insert" ON public.communication_templates
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "communication_templates_update" ON public.communication_templates
  FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "communication_templates_delete" ON public.communication_templates
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- Politiques pour communication_logs
CREATE POLICY "communication_logs_select" ON public.communication_logs
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "communication_logs_insert" ON public.communication_logs
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "communication_logs_update" ON public.communication_logs
  FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "communication_logs_delete" ON public.communication_logs
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- 7. VUES UTILES POUR REPORTING
-- ========================================

-- Vue statistiques de suivi par statut
CREATE OR REPLACE VIEW client_follow_up_stats AS
SELECT 
  status,
  COUNT(*) as count,
  COUNT(CASE WHEN next_contact::date = CURRENT_DATE THEN 1 END) as due_today,
  COUNT(CASE WHEN next_contact::date < CURRENT_DATE THEN 1 END) as overdue,
  AVG(EXTRACT(days FROM (CURRENT_TIMESTAMP - last_contact))) as avg_days_since_contact
FROM public.client_follow_ups
GROUP BY status;

-- Vue des communications par type et période
CREATE OR REPLACE VIEW communication_stats AS
SELECT 
  DATE_TRUNC('month', sent_at) as month,
  type,
  COUNT(*) as total_sent,
  COUNT(CASE WHEN status = 'delivered' THEN 1 END) as delivered,
  COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed,
  ROUND(
    COUNT(CASE WHEN status = 'delivered' THEN 1 END)::numeric / 
    COUNT(*)::numeric * 100, 2
  ) as delivery_rate
FROM public.communication_logs
GROUP BY DATE_TRUNC('month', sent_at), type
ORDER BY month DESC, type;

-- Vue des modèles les plus utilisés
CREATE OR REPLACE VIEW popular_templates AS
SELECT 
  ct.id,
  ct.name,
  ct.type,
  ct.sector,
  ct.target_status,
  COUNT(cl.id) as usage_count,
  MAX(cl.sent_at) as last_used
FROM public.communication_templates ct
LEFT JOIN public.communication_logs cl ON ct.id = cl.template_id
WHERE ct.is_active = true
GROUP BY ct.id, ct.name, ct.type, ct.sector, ct.target_status
ORDER BY usage_count DESC;

-- 8. FONCTIONS UTILITAIRES
-- ========================================

-- Fonction pour marquer un client comme à relancer
CREATE OR REPLACE FUNCTION mark_client_for_follow_up(
  p_client_id UUID,
  p_next_contact_date TIMESTAMPTZ DEFAULT NULL,
  p_priority TEXT DEFAULT 'medium',
  p_notes TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.client_follow_ups (
    client_id, 
    last_contact, 
    next_contact, 
    contact_type, 
    status, 
    priority, 
    notes
  )
  VALUES (
    p_client_id,
    CURRENT_TIMESTAMP,
    COALESCE(p_next_contact_date, CURRENT_TIMESTAMP + INTERVAL '7 days'),
    'phone',
    'a_relancer',
    p_priority,
    p_notes
  )
  ON CONFLICT (client_id) 
  DO UPDATE SET
    next_contact = COALESCE(p_next_contact_date, CURRENT_TIMESTAMP + INTERVAL '7 days'),
    status = 'a_relancer',
    priority = p_priority,
    notes = COALESCE(p_notes, client_follow_ups.notes),
    updated_at = CURRENT_TIMESTAMP;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour obtenir les clients à contacter aujourd'hui
CREATE OR REPLACE FUNCTION get_clients_due_today()
RETURNS TABLE(
  client_id UUID,
  client_name TEXT,
  client_email TEXT,
  client_phone TEXT,
  follow_up_status TEXT,
  priority TEXT,
  next_contact TIMESTAMPTZ,
  notes TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    CONCAT(c.prenom, ' ', c.nom),
    c.email,
    c.telephone,
    f.status,
    f.priority,
    f.next_contact,
    f.notes
  FROM public.clients c
  INNER JOIN public.client_follow_ups f ON c.id = f.client_id
  WHERE f.next_contact::date <= CURRENT_DATE
    AND f.status IN ('prospect', 'a_relancer')
  ORDER BY f.priority DESC, f.next_contact ASC;
END;
$$ LANGUAGE plpgsql;

-- 9. DONNÉES D'EXEMPLE POUR LES MODÈLES
-- ========================================

-- Modèles d'emails pour l'immobilier
INSERT INTO public.communication_templates (
  name, type, subject, content, sector, target_status
) VALUES 
(
  'Première prise de contact - Immobilier',
  'email',
  'Votre projet immobilier avec GMC',
  'Bonjour {prenom},

Merci pour votre intérêt pour nos services immobiliers. Nous serions ravis de vous accompagner dans votre projet.

Nos services incluent :
- Gestion locative complète
- Vente et achat de biens
- Conseil en investissement immobilier

Pourrions-nous planifier un rendez-vous pour discuter de vos besoins ?

Cordialement,
L''équipe GMC',
  'immobilier',
  'prospect'
),
(
  'Relance client immobilier',
  'email',
  'Suivi de votre dossier immobilier',
  'Bonjour {prenom},

J''espère que vous allez bien. Je me permets de revenir vers vous concernant votre projet immobilier.

Avez-vous eu l''occasion de réfléchir à notre proposition ? Je reste à votre disposition pour répondre à toutes vos questions.

N''hésitez pas à me contacter au {telephone} ou à répondre à cet email.

Bien cordialement,
L''équipe GMC',
  'immobilier',
  'a_relancer'
),
(
  'SMS rappel rendez-vous',
  'sms',
  NULL,
  'Bonjour {prenom}, rappel de votre RDV avec GMC demain à {heure}. Confirmez votre présence. Merci.',
  'general',
  'actif'
)
ON CONFLICT DO NOTHING;

-- 10. COMMENTAIRES SUR LES COLONNES
-- ========================================

COMMENT ON TABLE public.client_follow_ups IS 'Table de suivi des interactions avec les clients';
COMMENT ON COLUMN public.client_follow_ups.status IS 'Statut du client: prospect, actif, a_relancer, inactif';
COMMENT ON COLUMN public.client_follow_ups.priority IS 'Priorité de suivi: low, medium, high';
COMMENT ON COLUMN public.client_follow_ups.contact_type IS 'Type du dernier contact: email, sms, phone, meeting';

COMMENT ON TABLE public.communication_templates IS 'Modèles réutilisables pour les communications';
COMMENT ON COLUMN public.communication_templates.sector IS 'Secteur d''activité ciblé par le modèle';
COMMENT ON COLUMN public.communication_templates.target_status IS 'Statut de client ciblé par le modèle';

COMMENT ON TABLE public.communication_logs IS 'Historique de toutes les communications envoyées';
COMMENT ON COLUMN public.communication_logs.status IS 'Statut d''envoi: sent, delivered, failed, pending';
COMMENT ON COLUMN public.communication_logs.metadata IS 'Métadonnées additionnelles au format JSON';

-- 11. GRANTS ET PERMISSIONS
-- ========================================

GRANT ALL ON public.client_follow_ups TO authenticated;
GRANT ALL ON public.communication_templates TO authenticated;
GRANT ALL ON public.communication_logs TO authenticated;

GRANT EXECUTE ON FUNCTION mark_client_for_follow_up(UUID, TIMESTAMPTZ, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_clients_due_today() TO authenticated;