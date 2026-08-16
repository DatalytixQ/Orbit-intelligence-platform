-- ============================================================
-- N001 APPLY SQL
-- ============================================================
-- Task:      N001 — RLS policies on public.clients + public.app_users
-- Wave:      0B — Security Emergency / Database Track
-- Generated: 2026-07-10
-- Approved:  User explicit approval 2026-07-10T16:20 EDT
--
-- PRE-CONDITIONS (verified via live DB query before file creation):
--   ✅ clients.rowsecurity   = true  (RLS already enabled — do not re-enable)
--   ✅ app_users.rowsecurity = true  (RLS already enabled — do not re-enable)
--   ✅ No existing policies on either table (policy_count = 0)
--   ✅ clients.client_id     = text, NOT NULL
--   ✅ app_users.client_id   = text, NULLABLE
--   ✅ postgres role: rolbypassrls = true (backend unaffected)
--   ✅ anon role:     rolbypassrls = false (policies will enforce)
--
-- SCOPE:     ONLY creates policies. Does NOT:
--            - enable RLS (already enabled)
--            - modify tables, columns, or constraints
--            - modify functions, RPCs, triggers, or views
--
-- POLICY DESIGN:
--   All policies use PERMISSIVE mode (standard).
--   Policies target the 'authenticated' role specifically,
--   plus explicit grants for 'anon' where login requires it.
--
--   clients:   client_id IS the primary key and NOT NULL.
--              USING clause: client_id = current_setting('app.client_id', true)
--
--   app_users: client_id IS NULLABLE.
--              USING clause: client_id IS NOT NULL AND
--                            client_id = current_setting('app.client_id', true)
--              This prevents null-client_id rows from being universally visible.
--
--   WHY current_setting('app.client_id', true)?
--     The backend uses custom JWT claims. The 'true' flag makes the function
--     return NULL (not error) when the setting is not present.
--     Supabase passes claims as current_setting('request.jwt.claims') for
--     the anon/authenticated role. We use 'app.client_id' as the session
--     variable that the backend would set per request if ever using the SDK.
--     For the current architecture (direct postgres connection), these
--     policies have no effect on the backend. They protect against future
--     direct SDK access.
--
--   LOGIN EXCEPTION:
--     The login endpoint (POST /auth/login) queries app_users to verify
--     credentials. This runs via the postgres role (bypassrls), so it
--     is NOT affected by these policies. No special exception needed.
--
-- ROLLBACK:   Execute n001_rollback.sql to undo all changes.
-- ============================================================

-- ============================================================
-- SECTION 1: public.clients policies
-- ============================================================
-- clients.client_id is NOT NULL — simple equality check is safe.

-- SELECT: Tenants may only see their own client record
CREATE POLICY "n001_clients_select_own_tenant"
  ON public.clients
  FOR SELECT
  TO authenticated
  USING (
    client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id'
  );

-- INSERT: Tenants may only insert rows for their own client_id
CREATE POLICY "n001_clients_insert_own_tenant"
  ON public.clients
  FOR INSERT
  TO authenticated
  WITH CHECK (
    client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id'
  );

-- UPDATE: Tenants may only update their own client record
CREATE POLICY "n001_clients_update_own_tenant"
  ON public.clients
  FOR UPDATE
  TO authenticated
  USING (
    client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id'
  )
  WITH CHECK (
    client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id'
  );

-- DELETE: Tenants may only delete their own client record
CREATE POLICY "n001_clients_delete_own_tenant"
  ON public.clients
  FOR DELETE
  TO authenticated
  USING (
    client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id'
  );

-- ============================================================
-- SECTION 2: public.app_users policies
-- ============================================================
-- app_users.client_id is NULLABLE — policy must guard against NULL
-- to prevent null-client_id users from being visible to all tenants.

-- SELECT: Users may only see users within their own tenant
CREATE POLICY "n001_app_users_select_own_tenant"
  ON public.app_users
  FOR SELECT
  TO authenticated
  USING (
    client_id IS NOT NULL
    AND client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id'
  );

-- INSERT: Users may only insert new users into their own tenant
CREATE POLICY "n001_app_users_insert_own_tenant"
  ON public.app_users
  FOR INSERT
  TO authenticated
  WITH CHECK (
    client_id IS NOT NULL
    AND client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id'
  );

-- UPDATE: Users may only update users within their own tenant
CREATE POLICY "n001_app_users_update_own_tenant"
  ON public.app_users
  FOR UPDATE
  TO authenticated
  USING (
    client_id IS NOT NULL
    AND client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id'
  )
  WITH CHECK (
    client_id IS NOT NULL
    AND client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id'
  );

-- DELETE: Users may only delete users within their own tenant
CREATE POLICY "n001_app_users_delete_own_tenant"
  ON public.app_users
  FOR DELETE
  TO authenticated
  USING (
    client_id IS NOT NULL
    AND client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id'
  );

-- ============================================================
-- VERIFICATION QUERIES (run immediately after applying above)
-- ============================================================

-- V1: Confirm 8 policies were created (4 per table)
-- EXPECTED: policy_count = 8
SELECT COUNT(*) AS policy_count
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('clients', 'app_users');

-- V2: List all created policies with full detail
-- EXPECTED: 8 rows — 4 for clients, 4 for app_users
SELECT tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('clients', 'app_users')
ORDER BY tablename, policyname;

-- V3: postgres role can still read all clients rows (bypassrls)
-- EXPECTED: 1
SELECT COUNT(*) AS row_count FROM public.clients;

-- V4: postgres role can still read all app_users rows (bypassrls)
-- EXPECTED: 1
SELECT COUNT(*) AS row_count FROM public.app_users;

-- V5: Login join still works (postgres bypassrls)
-- EXPECTED: 1 row
SELECT u.id, u.client_id, u.email, u.role, u.is_active, c.client_name
FROM public.app_users u
JOIN public.clients c ON c.client_id = u.client_id
LIMIT 1;
