-- Supprimer la table company_manager qui n'est plus nécessaire
DROP TABLE IF EXISTS public.company_manager CASCADE;

-- Fonction pour créer automatiquement le super admin au démarrage
CREATE OR REPLACE FUNCTION public.ensure_super_admin()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  admin_exists boolean;
BEGIN
  -- Vérifier si un admin existe déjà
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE role = 'admin'
  ) INTO admin_exists;
  
  -- Si aucun admin n'existe, créer le super admin
  IF NOT admin_exists THEN
    -- Cette fonction sera appelée manuellement via l'edge function create-super-admin
    -- car nous ne pouvons pas créer d'utilisateurs directement depuis une fonction SQL
    RAISE NOTICE 'No admin found. Please use the create-super-admin edge function.';
  END IF;
END;
$$;