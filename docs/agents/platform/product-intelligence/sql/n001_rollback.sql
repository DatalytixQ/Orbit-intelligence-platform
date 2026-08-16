-- ============================================================
-- N001 ROLLBACK SQL
-- ============================================================
-- Task:      N001 — RLS policies on public.clients + public.app_users
-- Wave:      0B — Security Emergency / Database Track
-- Generated: 2026-07-10
-- Purpose:   Execute this script ONLY if N001 validation fails
--            or if a post-execution issue is discovered.
--
-- Effect:    Drops all policies created by n001_apply.sql.
--            RLS remains ENABLED on both tables (rowsecurity stays true).
--            Returns tables to their state prior to N001 execution:
--            RLS on, zero policies.
--
-- Safety:    All statements use IF EXISTS — safe to run even if
--            policies were never created or were partially applied.
--
-- Rollback time:   < 1 second
-- Data loss risk:  ZERO — DROP POLICY is metadata-only
-- Downtime required: NONE — can run while connections are active
-- ============================================================

-- ------------------------------------------------------------
-- ROLLBACK: public.clients policies
-- ------------------------------------------------------------

DROP POLICY IF EXISTS "n001_clients_select_own_tenant"   ON public.clients;
DROP POLICY IF EXISTS "n001_clients_insert_own_tenant"   ON public.clients;
DROP POLICY IF EXISTS "n001_clients_update_own_tenant"   ON public.clients;
DROP POLICY IF EXISTS "n001_clients_delete_own_tenant"   ON public.clients;

-- ------------------------------------------------------------
-- ROLLBACK: public.app_users policies
-- ------------------------------------------------------------

DROP POLICY IF EXISTS "n001_app_users_select_own_tenant" ON public.app_users;
DROP POLICY IF EXISTS "n001_app_users_insert_own_tenant" ON public.app_users;
DROP POLICY IF EXISTS "n001_app_users_update_own_tenant" ON public.app_users;
DROP POLICY IF EXISTS "n001_app_users_delete_own_tenant" ON public.app_users;

-- ------------------------------------------------------------
-- VERIFICATION: Run this after rollback to confirm clean state
-- Expected: policy_count = 0
-- ------------------------------------------------------------

SELECT COUNT(*) AS policy_count
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('clients', 'app_users');
