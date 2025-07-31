-- Corriger les tables qui n'ont pas d'auto-génération d'ID
-- 1. Table insurance_clients
ALTER TABLE public.insurance_clients 
ALTER COLUMN id SET DEFAULT gen_random_uuid(),
ALTER COLUMN id SET NOT NULL;

-- 2. Table property_clients  
ALTER TABLE public.property_clients 
ALTER COLUMN id SET DEFAULT gen_random_uuid(),
ALTER COLUMN id SET NOT NULL;

-- 3. Table travel_clients
ALTER TABLE public.travel_clients 
ALTER COLUMN id SET DEFAULT gen_random_uuid(),
ALTER COLUMN id SET NOT NULL;

-- Ajouter des contraintes PRIMARY KEY si elles n'existent pas
-- (Vérifier d'abord s'il n'y a pas déjà une contrainte)
DO $$ 
BEGIN
  -- Pour insurance_clients
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'insurance_clients' AND constraint_type = 'PRIMARY KEY'
  ) THEN
    ALTER TABLE public.insurance_clients ADD PRIMARY KEY (id);
  END IF;
  
  -- Pour property_clients
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'property_clients' AND constraint_type = 'PRIMARY KEY'
  ) THEN
    ALTER TABLE public.property_clients ADD PRIMARY KEY (id);
  END IF;
  
  -- Pour travel_clients
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'travel_clients' AND constraint_type = 'PRIMARY KEY'
  ) THEN
    ALTER TABLE public.travel_clients ADD PRIMARY KEY (id);
  END IF;
END $$;