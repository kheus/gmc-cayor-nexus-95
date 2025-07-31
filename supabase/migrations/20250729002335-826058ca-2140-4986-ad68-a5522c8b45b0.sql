-- Test d'insertion pour vérifier que tout fonctionne
INSERT INTO public.clients (nom, prenom, email, telephone, adresse, secteurs)
VALUES ('Test', 'Verification', 'verification@example.com', '+221771234567', 'Adresse Test', ARRAY['immobilier']);

-- Test d'insertion de paiement
INSERT INTO public.paiements (client_id, type_paiement, montant, mode_paiement, date_paiement, statut)
SELECT 
  id, 
  'loyer'::type_paiement_enum, 
  450000, 
  'virement'::mode_paiement_enum, 
  CURRENT_DATE, 
  'recu'::statut_paiement_enum
FROM public.clients 
WHERE email = 'verification@example.com'
LIMIT 1;