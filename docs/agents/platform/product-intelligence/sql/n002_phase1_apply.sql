-- ============================================================
-- N002 Phase 1 — Apply SQL
-- Task: CREATE RLS policies on 10 Core Business Tables
-- Generated: 2026-07-13
-- All policies: PERMISSIVE, role = authenticated
-- Expression: client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id'
-- ============================================================

-- ========== TABLE 1: sales (15,229 rows) ==========

CREATE POLICY "n002_sales_select_own_tenant" ON public.sales
  FOR SELECT TO authenticated
  USING (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');

CREATE POLICY "n002_sales_insert_own_tenant" ON public.sales
  FOR INSERT TO authenticated
  WITH CHECK (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');

CREATE POLICY "n002_sales_update_own_tenant" ON public.sales
  FOR UPDATE TO authenticated
  USING (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id')
  WITH CHECK (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');

CREATE POLICY "n002_sales_delete_own_tenant" ON public.sales
  FOR DELETE TO authenticated
  USING (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');

-- ========== TABLE 2: sales_lines (54,232 rows) ==========

CREATE POLICY "n002_sales_lines_select_own_tenant" ON public.sales_lines
  FOR SELECT TO authenticated
  USING (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');

CREATE POLICY "n002_sales_lines_insert_own_tenant" ON public.sales_lines
  FOR INSERT TO authenticated
  WITH CHECK (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');

CREATE POLICY "n002_sales_lines_update_own_tenant" ON public.sales_lines
  FOR UPDATE TO authenticated
  USING (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id')
  WITH CHECK (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');

CREATE POLICY "n002_sales_lines_delete_own_tenant" ON public.sales_lines
  FOR DELETE TO authenticated
  USING (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');

-- ========== TABLE 3: finance_ar_open_items (1,061 rows) ==========

CREATE POLICY "n002_finance_ar_open_items_select_own_tenant" ON public.finance_ar_open_items
  FOR SELECT TO authenticated
  USING (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');

CREATE POLICY "n002_finance_ar_open_items_insert_own_tenant" ON public.finance_ar_open_items
  FOR INSERT TO authenticated
  WITH CHECK (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');

CREATE POLICY "n002_finance_ar_open_items_update_own_tenant" ON public.finance_ar_open_items
  FOR UPDATE TO authenticated
  USING (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id')
  WITH CHECK (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');

CREATE POLICY "n002_finance_ar_open_items_delete_own_tenant" ON public.finance_ar_open_items
  FOR DELETE TO authenticated
  USING (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');

-- ========== TABLE 4: customer_payments (36,798 rows) ==========

CREATE POLICY "n002_customer_payments_select_own_tenant" ON public.customer_payments
  FOR SELECT TO authenticated
  USING (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');

CREATE POLICY "n002_customer_payments_insert_own_tenant" ON public.customer_payments
  FOR INSERT TO authenticated
  WITH CHECK (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');

CREATE POLICY "n002_customer_payments_update_own_tenant" ON public.customer_payments
  FOR UPDATE TO authenticated
  USING (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id')
  WITH CHECK (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');

CREATE POLICY "n002_customer_payments_delete_own_tenant" ON public.customer_payments
  FOR DELETE TO authenticated
  USING (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');

-- ========== TABLE 5: insights (1,371 rows) ==========

CREATE POLICY "n002_insights_select_own_tenant" ON public.insights
  FOR SELECT TO authenticated
  USING (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');

CREATE POLICY "n002_insights_insert_own_tenant" ON public.insights
  FOR INSERT TO authenticated
  WITH CHECK (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');

CREATE POLICY "n002_insights_update_own_tenant" ON public.insights
  FOR UPDATE TO authenticated
  USING (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id')
  WITH CHECK (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');

CREATE POLICY "n002_insights_delete_own_tenant" ON public.insights
  FOR DELETE TO authenticated
  USING (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');

-- ========== TABLE 6: inventory_stock (7,853 rows) ==========

CREATE POLICY "n002_inventory_stock_select_own_tenant" ON public.inventory_stock
  FOR SELECT TO authenticated
  USING (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');

CREATE POLICY "n002_inventory_stock_insert_own_tenant" ON public.inventory_stock
  FOR INSERT TO authenticated
  WITH CHECK (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');

CREATE POLICY "n002_inventory_stock_update_own_tenant" ON public.inventory_stock
  FOR UPDATE TO authenticated
  USING (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id')
  WITH CHECK (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');

CREATE POLICY "n002_inventory_stock_delete_own_tenant" ON public.inventory_stock
  FOR DELETE TO authenticated
  USING (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');

-- ========== TABLE 7: items_master (4,539 rows) ==========

CREATE POLICY "n002_items_master_select_own_tenant" ON public.items_master
  FOR SELECT TO authenticated
  USING (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');

CREATE POLICY "n002_items_master_insert_own_tenant" ON public.items_master
  FOR INSERT TO authenticated
  WITH CHECK (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');

CREATE POLICY "n002_items_master_update_own_tenant" ON public.items_master
  FOR UPDATE TO authenticated
  USING (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id')
  WITH CHECK (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');

CREATE POLICY "n002_items_master_delete_own_tenant" ON public.items_master
  FOR DELETE TO authenticated
  USING (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');

-- ========== TABLE 8: inventory_movements (97,941 rows) ==========

CREATE POLICY "n002_inventory_movements_select_own_tenant" ON public.inventory_movements
  FOR SELECT TO authenticated
  USING (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');

CREATE POLICY "n002_inventory_movements_insert_own_tenant" ON public.inventory_movements
  FOR INSERT TO authenticated
  WITH CHECK (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');

CREATE POLICY "n002_inventory_movements_update_own_tenant" ON public.inventory_movements
  FOR UPDATE TO authenticated
  USING (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id')
  WITH CHECK (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');

CREATE POLICY "n002_inventory_movements_delete_own_tenant" ON public.inventory_movements
  FOR DELETE TO authenticated
  USING (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');

-- ========== TABLE 9: inbound_shipments (251 rows) ==========

CREATE POLICY "n002_inbound_shipments_select_own_tenant" ON public.inbound_shipments
  FOR SELECT TO authenticated
  USING (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');

CREATE POLICY "n002_inbound_shipments_insert_own_tenant" ON public.inbound_shipments
  FOR INSERT TO authenticated
  WITH CHECK (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');

CREATE POLICY "n002_inbound_shipments_update_own_tenant" ON public.inbound_shipments
  FOR UPDATE TO authenticated
  USING (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id')
  WITH CHECK (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');

CREATE POLICY "n002_inbound_shipments_delete_own_tenant" ON public.inbound_shipments
  FOR DELETE TO authenticated
  USING (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');

-- ========== TABLE 10: open_sales_order_demand (341 rows) ==========

CREATE POLICY "n002_open_sales_order_demand_select_own_tenant" ON public.open_sales_order_demand
  FOR SELECT TO authenticated
  USING (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');

CREATE POLICY "n002_open_sales_order_demand_insert_own_tenant" ON public.open_sales_order_demand
  FOR INSERT TO authenticated
  WITH CHECK (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');

CREATE POLICY "n002_open_sales_order_demand_update_own_tenant" ON public.open_sales_order_demand
  FOR UPDATE TO authenticated
  USING (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id')
  WITH CHECK (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');

CREATE POLICY "n002_open_sales_order_demand_delete_own_tenant" ON public.open_sales_order_demand
  FOR DELETE TO authenticated
  USING (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');

-- ============================================================
-- END OF APPLY
-- Expected result: 40 policies with prefix n002_ on 10 tables
-- ============================================================
