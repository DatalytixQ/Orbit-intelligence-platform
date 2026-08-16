-- ============================================================
-- N002 Phase 2 — Rollback SQL
-- Task: DROP all Phase 2 RLS policies
-- Tables: item_bom, item_bom_resolved, item_alias_map,
--         insight_execution_context, customer_segments,
--         data_load_runs, sync_runs,
--         business_review_rules, business_rule_thresholds
-- Generated: 2026-07-13
-- Usage: Execute this script to reverse Phase 2 entirely.
--        Idempotent — safe to run even if partial execution occurred.
-- ============================================================

-- item_bom
DROP POLICY IF EXISTS "n002_item_bom_select_own_tenant" ON public.item_bom;
DROP POLICY IF EXISTS "n002_item_bom_insert_own_tenant" ON public.item_bom;
DROP POLICY IF EXISTS "n002_item_bom_update_own_tenant" ON public.item_bom;
DROP POLICY IF EXISTS "n002_item_bom_delete_own_tenant" ON public.item_bom;

-- item_bom_resolved
DROP POLICY IF EXISTS "n002_item_bom_resolved_select_own_tenant" ON public.item_bom_resolved;
DROP POLICY IF EXISTS "n002_item_bom_resolved_insert_own_tenant" ON public.item_bom_resolved;
DROP POLICY IF EXISTS "n002_item_bom_resolved_update_own_tenant" ON public.item_bom_resolved;
DROP POLICY IF EXISTS "n002_item_bom_resolved_delete_own_tenant" ON public.item_bom_resolved;

-- item_alias_map
DROP POLICY IF EXISTS "n002_item_alias_map_select_own_tenant" ON public.item_alias_map;
DROP POLICY IF EXISTS "n002_item_alias_map_insert_own_tenant" ON public.item_alias_map;
DROP POLICY IF EXISTS "n002_item_alias_map_update_own_tenant" ON public.item_alias_map;
DROP POLICY IF EXISTS "n002_item_alias_map_delete_own_tenant" ON public.item_alias_map;

-- insight_execution_context
DROP POLICY IF EXISTS "n002_insight_execution_context_select_own_tenant" ON public.insight_execution_context;
DROP POLICY IF EXISTS "n002_insight_execution_context_insert_own_tenant" ON public.insight_execution_context;
DROP POLICY IF EXISTS "n002_insight_execution_context_update_own_tenant" ON public.insight_execution_context;
DROP POLICY IF EXISTS "n002_insight_execution_context_delete_own_tenant" ON public.insight_execution_context;

-- customer_segments
DROP POLICY IF EXISTS "n002_customer_segments_select_own_tenant" ON public.customer_segments;
DROP POLICY IF EXISTS "n002_customer_segments_insert_own_tenant" ON public.customer_segments;
DROP POLICY IF EXISTS "n002_customer_segments_update_own_tenant" ON public.customer_segments;
DROP POLICY IF EXISTS "n002_customer_segments_delete_own_tenant" ON public.customer_segments;

-- data_load_runs
DROP POLICY IF EXISTS "n002_data_load_runs_select_own_tenant" ON public.data_load_runs;
DROP POLICY IF EXISTS "n002_data_load_runs_insert_own_tenant" ON public.data_load_runs;
DROP POLICY IF EXISTS "n002_data_load_runs_update_own_tenant" ON public.data_load_runs;
DROP POLICY IF EXISTS "n002_data_load_runs_delete_own_tenant" ON public.data_load_runs;

-- sync_runs
DROP POLICY IF EXISTS "n002_sync_runs_select_own_tenant" ON public.sync_runs;
DROP POLICY IF EXISTS "n002_sync_runs_insert_own_tenant" ON public.sync_runs;
DROP POLICY IF EXISTS "n002_sync_runs_update_own_tenant" ON public.sync_runs;
DROP POLICY IF EXISTS "n002_sync_runs_delete_own_tenant" ON public.sync_runs;

-- business_review_rules
DROP POLICY IF EXISTS "n002_business_review_rules_select_own_tenant" ON public.business_review_rules;
DROP POLICY IF EXISTS "n002_business_review_rules_insert_own_tenant" ON public.business_review_rules;
DROP POLICY IF EXISTS "n002_business_review_rules_update_own_tenant" ON public.business_review_rules;
DROP POLICY IF EXISTS "n002_business_review_rules_delete_own_tenant" ON public.business_review_rules;

-- business_rule_thresholds
DROP POLICY IF EXISTS "n002_business_rule_thresholds_select_own_tenant" ON public.business_rule_thresholds;
DROP POLICY IF EXISTS "n002_business_rule_thresholds_insert_own_tenant" ON public.business_rule_thresholds;
DROP POLICY IF EXISTS "n002_business_rule_thresholds_update_own_tenant" ON public.business_rule_thresholds;
DROP POLICY IF EXISTS "n002_business_rule_thresholds_delete_own_tenant" ON public.business_rule_thresholds;

-- ============================================================
-- END OF ROLLBACK
-- Expected result: 0 Phase 2 policies on these 9 tables
-- Verify: SELECT COUNT(*) FROM pg_policies
--         WHERE policyname LIKE 'n002_%'
--         AND tablename IN ('item_bom','item_bom_resolved',
--         'item_alias_map','insight_execution_context',
--         'customer_segments','data_load_runs','sync_runs',
--         'business_review_rules','business_rule_thresholds');
-- ============================================================
