-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create enum for roles
CREATE TYPE public.app_role AS ENUM ('admin', 'client');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Utilisateur'),
    NEW.raw_user_meta_data->>'phone'
  );
  
  -- Assign client role by default
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'client');
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update company_requests table to link to users
ALTER TABLE public.company_requests 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Create associates table
CREATE TABLE public.company_associates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_request_id UUID REFERENCES public.company_requests(id) ON DELETE CASCADE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  id_number TEXT,
  cash_contribution DECIMAL(15, 2) DEFAULT 0,
  nature_contribution_description TEXT,
  nature_contribution_value DECIMAL(15, 2) DEFAULT 0,
  total_contribution DECIMAL(15, 2) GENERATED ALWAYS AS (cash_contribution + nature_contribution_value) STORED,
  percentage DECIMAL(5, 2),
  share_start INTEGER,
  share_end INTEGER,
  number_of_shares INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.company_associates ENABLE ROW LEVEL SECURITY;

-- Create manager info table
CREATE TABLE public.company_manager (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_request_id UUID REFERENCES public.company_requests(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  id_number TEXT,
  birth_certificate TEXT,
  criminal_record TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.company_manager ENABLE ROW LEVEL SECURITY;

-- Create documents table
CREATE TABLE public.company_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_request_id UUID REFERENCES public.company_requests(id) ON DELETE CASCADE NOT NULL,
  associate_id UUID REFERENCES public.company_associates(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.company_documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

-- RLS Policies for company_requests
DROP POLICY IF EXISTS "Users can view their own requests" ON public.company_requests;

CREATE POLICY "Users can view their own requests"
  ON public.company_requests FOR SELECT
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can update their own requests"
  ON public.company_requests FOR UPDATE
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view all requests"
  ON public.company_requests FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all requests"
  ON public.company_requests FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for associates
CREATE POLICY "Users can view associates of their requests"
  ON public.company_associates FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.company_requests
      WHERE id = company_request_id
        AND (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
    )
  );

CREATE POLICY "Users can insert associates for their requests"
  ON public.company_associates FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.company_requests
      WHERE id = company_request_id AND user_id = auth.uid()
    )
  );

-- RLS Policies for manager
CREATE POLICY "Users can view manager of their requests"
  ON public.company_manager FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.company_requests
      WHERE id = company_request_id
        AND (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
    )
  );

CREATE POLICY "Users can insert manager for their requests"
  ON public.company_manager FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.company_requests
      WHERE id = company_request_id AND user_id = auth.uid()
    )
  );

-- RLS Policies for documents
CREATE POLICY "Users can view documents of their requests"
  ON public.company_documents FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.company_requests
      WHERE id = company_request_id
        AND (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
    )
  );

CREATE POLICY "Users can insert documents for their requests"
  ON public.company_documents FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.company_requests
      WHERE id = company_request_id AND user_id = auth.uid()
    )
  );

-- Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('company-documents', 'company-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Users can upload their own documents"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'company-documents' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own documents"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'company-documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Admins can view all documents"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'company-documents'
    AND public.has_role(auth.uid(), 'admin')
  );

-- Trigger for profiles updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();