-- Fix search_path for the document path generation function
CREATE OR REPLACE FUNCTION generate_document_path(
  doc_type text,
  associate_name text,
  is_manager boolean,
  original_filename text
)
RETURNS text
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
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