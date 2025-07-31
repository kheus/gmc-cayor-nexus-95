-- Create user profiles table linked to auth.users
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  nom_complet TEXT,
  email TEXT,
  telephone TEXT,
  role TEXT NOT NULL DEFAULT 'employee',
  actif BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles table
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "System can insert profiles"
ON public.profiles
FOR INSERT
WITH CHECK (true);

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, nom_complet, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'nom_complet', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'employee')
  );
  RETURN NEW;
END;
$$;

-- Trigger to create profile on user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to get current user role (security definer to avoid RLS recursion)
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT
LANGUAGE SQL
SECURITY DEFINER STABLE
AS $$
  SELECT role FROM public.profiles WHERE user_id = auth.uid();
$$;

-- Enable RLS on all existing tables
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contrats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proprietes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paiements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assurances_auto ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions_financieres ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.echeances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.utilisateurs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parametres_systeme ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for clients table
CREATE POLICY "Authenticated users can view clients"
ON public.clients
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert clients"
ON public.clients
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update clients"
ON public.clients
FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete clients"
ON public.clients
FOR DELETE
TO authenticated
USING (true);

-- Create RLS policies for contrats table
CREATE POLICY "Authenticated users can manage contrats"
ON public.contrats
FOR ALL
TO authenticated
USING (true);

-- Create RLS policies for proprietes table
CREATE POLICY "Authenticated users can manage proprietes"
ON public.proprietes
FOR ALL
TO authenticated
USING (true);

-- Create RLS policies for paiements table
CREATE POLICY "Authenticated users can manage paiements"
ON public.paiements
FOR ALL
TO authenticated
USING (true);

-- Create RLS policies for maintenance table
CREATE POLICY "Authenticated users can manage maintenance"
ON public.maintenance
FOR ALL
TO authenticated
USING (true);

-- Create RLS policies for assurances_auto table
CREATE POLICY "Authenticated users can manage assurances_auto"
ON public.assurances_auto
FOR ALL
TO authenticated
USING (true);

-- Create RLS policies for transactions_financieres table
CREATE POLICY "Authenticated users can manage transactions_financieres"
ON public.transactions_financieres
FOR ALL
TO authenticated
USING (true);

-- Create RLS policies for echeances table
CREATE POLICY "Authenticated users can manage echeances"
ON public.echeances
FOR ALL
TO authenticated
USING (true);

-- Create RLS policies for utilisateurs table
CREATE POLICY "Authenticated users can manage utilisateurs"
ON public.utilisateurs
FOR ALL
TO authenticated
USING (true);

-- Create RLS policies for parametres_systeme table (admin only)
CREATE POLICY "Admin users can manage system parameters"
ON public.parametres_systeme
FOR ALL
TO authenticated
USING (public.get_current_user_role() = 'admin');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add update triggers for profiles table
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();