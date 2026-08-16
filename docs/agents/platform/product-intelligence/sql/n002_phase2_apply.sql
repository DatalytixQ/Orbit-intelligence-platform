-- ============================================================
-- N002 Phase 2 — Apply SQL
-- Task: CREATE RLS policies on 9 Analytics & Intelligence Tables
-- Generated: 2026-07-13
-- All policies: PERMISSIVE, role = authenticated
-- Expression: client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id'
-- ============================================================

-- ========== TABLE 1: item_bom (3,548 rows) ==========

CREATE POLICY "n002_item_bom_select_own_tenant" ON public.item_bom
  FOR SELECT TO authenticated
  USING (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');

CREATE POLICY "n002_item_bom_insert_own_tenant" ON public.item_bom
  FOR INSERT TO authenticated
  WITH CHECK (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');

CREATE POLICY "n002_item_bom_update_own_tenant" ON public.item_bom
  FOR UPDATE TO authenticated
  USING (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id')
  WITH CHECK (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');

CREATE POLICY "n002_item_bom_delete_own_tenant" ON public.item_bom
  FOR DELETE TO authenticated
  USING (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');

-- ========== TABLE 2: item_bom_resolved (3,556 rows) ==========

CREATE POLICY "n002_item_bom_resolved_select_own_tenant" ON public.item_bom_resolved
  FOR SELECT TO authenticated
  USING (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');

CREATE POLICY "n002_item_bom_resolved_insert_own_tenant" ON public.item_bom_resolved
  FOR INSERT TO authenticated
  WITH CHECK (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');

CREATE POLICY "n002_item_bom_resolved_update_own_tenant" ON public.item_bom_resolved
  FOR UPDATE TO authenticated
  USING (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id')
  WITH CHECK (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');

CREATE POLICY "n002_item_bom_resolved_delete_own_tenant" ON public.item_bom_resolved
  FOR DELETE TO authenticated
  USING (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');

-- ========== TABLE 3: item_alias_map (52 rows) ==========

CREATE POLICY "n002_item_alias_map_select_own_tenant" ON public.item_alias_map
  FOR SELECT TO authenticated
  USING (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');

CREATE POLICY "n002_item_alias_map_insert_own_tenant" ON public.item_alias_map
  FOR INSERT TO authenticated
  WITH CHECK (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');

CREATE POLICY "n002_item_alias_map_update_own_tenant" ON public.item_alias_map
  FOR UPDATE TO authenticated
  USING (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id')
  WITH CHECK (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');

CREATE POLICY "n002_item_alias_map_delete_own_tenant" ON public.item_alias_map
  FOR DELETE TO authenticated
  USING (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');

-- ========== TABLE 4: insight_execution_context (1 row) ==========

CREATE POLICY "n002_insight_execution_context_select_own_tenant" ON public.insight_execution_context
  FOR SELECT TO authenticated
  USING (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');

CREATE POLICY "n002_insight_execution_context_insert_own_tenant" ON public.insight_execution_context
  FOR INSERT TO authenticated
  WITH CHECK (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');

CREATE POLICY "n002_insight_execution_context_update_own_tenant" ON public.insight_execution_context
  FOR UPDATE TO authenticated
  USING (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id')
  WITH CHECK (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');

CREATE POLICY "n002_insight_execution_context_delete_own_tenant" ON public.insight_execution_context
  FOR DELETE TO authenticated
  USING (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');

-- ========== TABLE 5: customer_segments (0 rows) ==========

CREATE POLICY "n002_customer_segments_select_own_tenant" ON public.customer_segments
  FOR SELECT TO authenticated
  USING (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');

CREATE POLICY "n002_customer_segments_insert_own_tenant" ON public.customer_segments
  FOR INSERT TO authenticated
  WITH CHECK (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');

CREATE POLICY "n002_customer_segments_update_own_tenant" ON public.customer_segments
  FOR UPDATE TO authenticated
  USING (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id')
  WITH CHECK (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');

CREATE POLICY "n002_customer_segments_delete_own_tenant" ON public.customer_segments
  FOR DELETE TO authenticated
  USING (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');

-- ========== TABLE 6: data_load_runs (0 rows) ==========

CREATE POLICY "n002_data_load_runs_select_own_tenant" ON public.data_load_runs
  FOR SELECT TO authenticated
  USING (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');

CREATE POLICY "n002_data_load_runs_insert_own_tenant" ON public.data_load_runs
  FOR INSERT TO authenticated
  WITH CHECK (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');

CREATE POLICY "n002_data_load_runs_update_own_tenant" ON public.data_load_runs
  FOR UPDATE TO authenticated
  USING (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id')
  WITH CHECK (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');

CREATE POLICY "n002_data_load_runs_delete_own_tenant" ON public.data_load_runs
  FOR DELETE TO authenticated
  USING (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');

-- ========== TABLE 7: sync_runs (0 rows) ==========

CREATE POLICY "n002_sync_runs_select_own_tenant" ON public.sync_runs
  FOR SELECT TO authenticated
  USING (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');

CREATE POLICY "n002_sync_runs_insert_own_tenant" ON public.sync_runs
  FOR INSERT TO authenticated
  WITH CHECK (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');

CREATE POLICY "n002_sync_runs_update_own_tenant" ON public.sync_runs
  FOR UPDATE TO authenticated
  USING (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id')
  WITH CHECK (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');

CREATE POLICY "n002_sync_runs_delete_own_tenant" ON public.sync_runs
  FOR DELETE TO authenticated
  USING (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');

-- ========== TABLE 8: business_review_rules (0 rows) ==========

CREATE POLICY "n002_business_review_rules_select_own_tenant" ON public.business_review_rules
  FOR SELECT TO authenticated
  USING (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');

CREATE POLICY "n002_business_review_rules_insert_own_tenant" ON public.business_review_rules
  FOR INSERT TO authenticated
  WITH CHECK (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');

CREATE POLICY "n002_business_review_rules_update_own_tenant" ON public.business_review_rules
  FOR UPDATE TO authenticated
  USING (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id')
  WITH CHECK (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');

CREATE POLICY "n002_business_review_rules_delete_own_tenant" ON public.business_review_rules
  FOR DELETE TO authenticated
  USING (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');

-- ========== TABLE 9: business_rule_thresholds (15 rows) ==========

CREATE POLICY "n002_business_rule_thresholds_select_own_tenant" ON public.business_rule_thresholds
  FOR SELECT TO authenticated
  USING (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');

CREATE POLICY "n002_business_rule_thresholds_insert_own_tenant" ON public.business_rule_thresholds
  FOR INSERT TO authenticated
  WITH CHECK (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');

CREATE POLICY "n002_business_rule_thresholds_update_own_tenant" ON public.business_rule_thresholds
  FOR UPDATE TO authenticated
  USING (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id')
  WITH CHECK (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');

CREATE POLICY "n002_business_rule_thresholds_delete_own_tenant" ON public.business_rule_thresholds
  FOR DELETE TO authenticated
  USING (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');

-- ============================================================
-- END OF APPLY
-- Expected result: 36 new policies with prefix n002_ on 9 tables
-- Total policies in DB after Phase 2: 84 (8 N001 + 40 Ph1 + 36 Ph2)
-- ============================================================
