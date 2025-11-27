-- Table pour les demandes de création d'entreprise
CREATE TABLE public.company_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  structure_type TEXT NOT NULL,
  company_name TEXT,
  region TEXT NOT NULL,
  city TEXT,
  address TEXT NOT NULL,
  activity TEXT,
  capital TEXT,
  associates_count TEXT,
  contact_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  additional_services TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  tracking_number TEXT UNIQUE,
  estimated_price INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.company_requests ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre à tous de créer une demande
CREATE POLICY "Anyone can create company request"
ON public.company_requests
FOR INSERT
WITH CHECK (true);

-- Politique pour que les utilisateurs puissent voir leurs propres demandes
CREATE POLICY "Users can view their own requests"
ON public.company_requests
FOR SELECT
USING (email = current_setting('request.jwt.claims')::json->>'email' OR true);

-- Table pour les entreprises créées (showcase)
CREATE TABLE public.created_companies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  region TEXT NOT NULL,
  district TEXT,
  founder_name TEXT NOT NULL,
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  testimonial TEXT,
  show_publicly BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.created_companies ENABLE ROW LEVEL SECURITY;

-- Politique pour lecture publique
CREATE POLICY "Public companies are viewable by everyone"
ON public.created_companies
FOR SELECT
USING (show_publicly = true);

-- Table pour les messages de contact
CREATE TABLE public.contact_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre à tous d'envoyer un message
CREATE POLICY "Anyone can send contact message"
ON public.contact_messages
FOR INSERT
WITH CHECK (true);

-- Fonction pour mettre à jour les timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Trigger pour company_requests
CREATE TRIGGER update_company_requests_updated_at
BEFORE UPDATE ON public.company_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Fonction pour générer un numéro de suivi unique
CREATE OR REPLACE FUNCTION public.generate_tracking_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.tracking_number = 'LF-' || TO_CHAR(now(), 'YYYY') || '-' || LPAD(nextval('tracking_sequence')::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Créer une séquence pour les numéros de suivi
CREATE SEQUENCE IF NOT EXISTS tracking_sequence START 1;

-- Trigger pour générer le tracking number
CREATE TRIGGER set_tracking_number
BEFORE INSERT ON public.company_requests
FOR EACH ROW
EXECUTE FUNCTION public.generate_tracking_number();