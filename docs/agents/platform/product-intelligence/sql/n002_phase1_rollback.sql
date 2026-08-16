-- ============================================================
-- N002 Phase 1 — Rollback SQL
-- Task: DROP all Phase 1 RLS policies
-- Tables: sales, sales_lines, finance_ar_open_items,
--         customer_payments, insights, inventory_stock,
--         items_master, inventory_movements,
--         inbound_shipments, open_sales_order_demand
-- Generated: 2026-07-13
-- Usage: Execute this script to reverse Phase 1 entirely.
-- ============================================================

-- sales
DROP POLICY IF EXISTS "n002_sales_select_own_tenant" ON public.sales;
DROP POLICY IF EXISTS "n002_sales_insert_own_tenant" ON public.sales;
DROP POLICY IF EXISTS "n002_sales_update_own_tenant" ON public.sales;
DROP POLICY IF EXISTS "n002_sales_delete_own_tenant" ON public.sales;

-- sales_lines
DROP POLICY IF EXISTS "n002_sales_lines_select_own_tenant" ON public.sales_lines;
DROP POLICY IF EXISTS "n002_sales_lines_insert_own_tenant" ON public.sales_lines;
DROP POLICY IF EXISTS "n002_sales_lines_update_own_tenant" ON public.sales_lines;
DROP POLICY IF EXISTS "n002_sales_lines_delete_own_tenant" ON public.sales_lines;

-- finance_ar_open_items
DROP POLICY IF EXISTS "n002_finance_ar_open_items_select_own_tenant" ON public.finance_ar_open_items;
DROP POLICY IF EXISTS "n002_finance_ar_open_items_insert_own_tenant" ON public.finance_ar_open_items;
DROP POLICY IF EXISTS "n002_finance_ar_open_items_update_own_tenant" ON public.finance_ar_open_items;
DROP POLICY IF EXISTS "n002_finance_ar_open_items_delete_own_tenant" ON public.finance_ar_open_items;

-- customer_payments
DROP POLICY IF EXISTS "n002_customer_payments_select_own_tenant" ON public.customer_payments;
DROP POLICY IF EXISTS "n002_customer_payments_insert_own_tenant" ON public.customer_payments;
DROP POLICY IF EXISTS "n002_customer_payments_update_own_tenant" ON public.customer_payments;
DROP POLICY IF EXISTS "n002_customer_payments_delete_own_tenant" ON public.customer_payments;

-- insights
DROP POLICY IF EXISTS "n002_insights_select_own_tenant" ON public.insights;
DROP POLICY IF EXISTS "n002_insights_insert_own_tenant" ON public.insights;
DROP POLICY IF EXISTS "n002_insights_update_own_tenant" ON public.insights;
DROP POLICY IF EXISTS "n002_insights_delete_own_tenant" ON public.insights;

-- inventory_stock
DROP POLICY IF EXISTS "n002_inventory_stock_select_own_tenant" ON public.inventory_stock;
DROP POLICY IF EXISTS "n002_inventory_stock_insert_own_tenant" ON public.inventory_stock;
DROP POLICY IF EXISTS "n002_inventory_stock_update_own_tenant" ON public.inventory_stock;
DROP POLICY IF EXISTS "n002_inventory_stock_delete_own_tenant" ON public.inventory_stock;

-- items_master
DROP POLICY IF EXISTS "n002_items_master_select_own_tenant" ON public.items_master;
DROP POLICY IF EXISTS "n002_items_master_insert_own_tenant" ON public.items_master;
DROP POLICY IF EXISTS "n002_items_master_update_own_tenant" ON public.items_master;
DROP POLICY IF EXISTS "n002_items_master_delete_own_tenant" ON public.items_master;

-- inventory_movements
DROP POLICY IF EXISTS "n002_inventory_movements_select_own_tenant" ON public.inventory_movements;
DROP POLICY IF EXISTS "n002_inventory_movements_insert_own_tenant" ON public.inventory_movements;
DROP POLICY IF EXISTS "n002_inventory_movements_update_own_tenant" ON public.inventory_movements;
DROP POLICY IF EXISTS "n002_inventory_movements_delete_own_tenant" ON public.inventory_movements;

-- inbound_shipments
DROP POLICY IF EXISTS "n002_inbound_shipments_select_own_tenant" ON public.inbound_shipments;
DROP POLICY IF EXISTS "n002_inbound_shipments_insert_own_tenant" ON public.inbound_shipments;
DROP POLICY IF EXISTS "n002_inbound_shipments_update_own_tenant" ON public.inbound_shipments;
DROP POLICY IF EXISTS "n002_inbound_shipments_delete_own_tenant" ON public.inbound_shipments;

-- open_sales_order_demand
DROP POLICY IF EXISTS "n002_open_sales_order_demand_select_own_tenant" ON public.open_sales_order_demand;
DROP POLICY IF EXISTS "n002_open_sales_order_demand_insert_own_tenant" ON public.open_sales_order_demand;
DROP POLICY IF EXISTS "n002_open_sales_order_demand_update_own_tenant" ON public.open_sales_order_demand;
DROP POLICY IF EXISTS "n002_open_sales_order_demand_delete_own_tenant" ON public.open_sales_order_demand;

-- ============================================================
-- END OF ROLLBACK
-- Expected result: 0 policies with prefix n002_ on these 10 tables
-- ============================================================
