-- n051_user_preferences_apply.sql
-- Add language preference to users and default language to clients (tenants)

-- 1. Add language_preference to app_users (nullable, defaults to NULL = use tenant default)
ALTER TABLE public.app_users 
  ADD COLUMN IF NOT EXISTS language_preference VARCHAR(5) DEFAULT NULL;

COMMENT ON COLUMN public.app_users.language_preference IS 'User language preference (es, en). NULL = use tenant default.';

-- 2. Add default_language to clients (tenant-level default)
ALTER TABLE public.clients 
  ADD COLUMN IF NOT EXISTS default_language VARCHAR(5) DEFAULT 'es';

COMMENT ON COLUMN public.clients.default_language IS 'Tenant default language (es, en).';

-- 3. Set existing tenant to Spanish
UPDATE public.clients SET default_language = 'es' WHERE client_id = 'vonderk';
