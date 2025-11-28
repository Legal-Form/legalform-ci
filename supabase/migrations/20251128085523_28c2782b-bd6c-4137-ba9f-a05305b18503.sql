-- Fix critical security issue: Require authentication for company requests
DROP POLICY IF EXISTS "Anyone can create company request" ON company_requests;

CREATE POLICY "Authenticated users can create company request" 
ON company_requests 
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- Make user_id required to prevent orphan records
ALTER TABLE company_requests ALTER COLUMN user_id SET NOT NULL;

-- Add SELECT policy for admins to view contact messages
CREATE POLICY "Admins can view contact messages" 
ON contact_messages 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Improve company_associates table structure
ALTER TABLE company_associates 
ADD COLUMN IF NOT EXISTS birth_date date,
ADD COLUMN IF NOT EXISTS birth_place text,
ADD COLUMN IF NOT EXISTS marital_status text,
ADD COLUMN IF NOT EXISTS marital_regime text,
ADD COLUMN IF NOT EXISTS children_count integer,
ADD COLUMN IF NOT EXISTS residence_address text,
ADD COLUMN IF NOT EXISTS is_manager boolean DEFAULT false;

-- Add document tracking columns
ALTER TABLE company_documents
ADD COLUMN IF NOT EXISTS uploaded_by uuid REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS original_name text;

-- Create function to automatically rename documents based on role
CREATE OR REPLACE FUNCTION generate_document_path(
  doc_type text,
  associate_name text,
  is_manager boolean,
  original_filename text
)
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  role_prefix text;
  extension text;
BEGIN
  -- Determine role prefix
  role_prefix := CASE WHEN is_manager THEN 'Gerant' ELSE 'Associe' END;
  
  -- Extract file extension
  extension := substring(original_filename from '\.([^.]+)$');
  
  -- Generate path: documents/company_id/doc_type_role_name.ext
  RETURN format('%s_%s.%s', doc_type, role_prefix || '_' || replace(associate_name, ' ', '_'), extension);
END;
$$;