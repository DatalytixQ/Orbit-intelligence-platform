-- Migration n018: Apply missing RLS

ALTER TABLE raw_netsuite_customers ENABLE ROW LEVEL SECURITY;
CREATE POLICY n018_raw_netsuite_customers_select_own_tenant ON raw_netsuite_customers FOR SELECT TO authenticated USING (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text));
CREATE POLICY n018_raw_netsuite_customers_insert_own_tenant ON raw_netsuite_customers FOR INSERT TO authenticated WITH CHECK (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text));
CREATE POLICY n018_raw_netsuite_customers_update_own_tenant ON raw_netsuite_customers FOR UPDATE TO authenticated USING (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text)) WITH CHECK (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text));
CREATE POLICY n018_raw_netsuite_customers_delete_own_tenant ON raw_netsuite_customers FOR DELETE TO authenticated USING (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text));

ALTER TABLE raw_collections ENABLE ROW LEVEL SECURITY;
CREATE POLICY n018_raw_collections_select_own_tenant ON raw_collections FOR SELECT TO authenticated USING (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text));
CREATE POLICY n018_raw_collections_insert_own_tenant ON raw_collections FOR INSERT TO authenticated WITH CHECK (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text));
CREATE POLICY n018_raw_collections_update_own_tenant ON raw_collections FOR UPDATE TO authenticated USING (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text)) WITH CHECK (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text));
CREATE POLICY n018_raw_collections_delete_own_tenant ON raw_collections FOR DELETE TO authenticated USING (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text));

ALTER TABLE raw_customers ENABLE ROW LEVEL SECURITY;
CREATE POLICY n018_raw_customers_select_own_tenant ON raw_customers FOR SELECT TO authenticated USING (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text));
CREATE POLICY n018_raw_customers_insert_own_tenant ON raw_customers FOR INSERT TO authenticated WITH CHECK (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text));
CREATE POLICY n018_raw_customers_update_own_tenant ON raw_customers FOR UPDATE TO authenticated USING (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text)) WITH CHECK (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text));
CREATE POLICY n018_raw_customers_delete_own_tenant ON raw_customers FOR DELETE TO authenticated USING (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text));

ALTER TABLE raw_sales_lines ENABLE ROW LEVEL SECURITY;
CREATE POLICY n018_raw_sales_lines_select_own_tenant ON raw_sales_lines FOR SELECT TO authenticated USING (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text));
CREATE POLICY n018_raw_sales_lines_insert_own_tenant ON raw_sales_lines FOR INSERT TO authenticated WITH CHECK (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text));
CREATE POLICY n018_raw_sales_lines_update_own_tenant ON raw_sales_lines FOR UPDATE TO authenticated USING (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text)) WITH CHECK (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text));
CREATE POLICY n018_raw_sales_lines_delete_own_tenant ON raw_sales_lines FOR DELETE TO authenticated USING (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text));

ALTER TABLE stg_inventory_transactions_clean ENABLE ROW LEVEL SECURITY;
CREATE POLICY n018_stg_inventory_transactions_clean_select_own_tenant ON stg_inventory_transactions_clean FOR SELECT TO authenticated USING (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text));
CREATE POLICY n018_stg_inventory_transactions_clean_insert_own_tenant ON stg_inventory_transactions_clean FOR INSERT TO authenticated WITH CHECK (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text));
CREATE POLICY n018_stg_inventory_transactions_clean_update_own_tenant ON stg_inventory_transactions_clean FOR UPDATE TO authenticated USING (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text)) WITH CHECK (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text));
CREATE POLICY n018_stg_inventory_transactions_clean_delete_own_tenant ON stg_inventory_transactions_clean FOR DELETE TO authenticated USING (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text));

ALTER TABLE raw_sales ENABLE ROW LEVEL SECURITY;
CREATE POLICY n018_raw_sales_select_own_tenant ON raw_sales FOR SELECT TO authenticated USING (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text));
CREATE POLICY n018_raw_sales_insert_own_tenant ON raw_sales FOR INSERT TO authenticated WITH CHECK (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text));
CREATE POLICY n018_raw_sales_update_own_tenant ON raw_sales FOR UPDATE TO authenticated USING (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text)) WITH CHECK (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text));
CREATE POLICY n018_raw_sales_delete_own_tenant ON raw_sales FOR DELETE TO authenticated USING (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text));

ALTER TABLE raw_subsidiaries ENABLE ROW LEVEL SECURITY;
CREATE POLICY n018_raw_subsidiaries_select_own_tenant ON raw_subsidiaries FOR SELECT TO authenticated USING (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text));
CREATE POLICY n018_raw_subsidiaries_insert_own_tenant ON raw_subsidiaries FOR INSERT TO authenticated WITH CHECK (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text));
CREATE POLICY n018_raw_subsidiaries_update_own_tenant ON raw_subsidiaries FOR UPDATE TO authenticated USING (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text)) WITH CHECK (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text));
CREATE POLICY n018_raw_subsidiaries_delete_own_tenant ON raw_subsidiaries FOR DELETE TO authenticated USING (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text));

ALTER TABLE raw_locations ENABLE ROW LEVEL SECURITY;
CREATE POLICY n018_raw_locations_select_own_tenant ON raw_locations FOR SELECT TO authenticated USING (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text));
CREATE POLICY n018_raw_locations_insert_own_tenant ON raw_locations FOR INSERT TO authenticated WITH CHECK (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text));
CREATE POLICY n018_raw_locations_update_own_tenant ON raw_locations FOR UPDATE TO authenticated USING (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text)) WITH CHECK (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text));
CREATE POLICY n018_raw_locations_delete_own_tenant ON raw_locations FOR DELETE TO authenticated USING (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text));

ALTER TABLE stg_sales_lines_clean ENABLE ROW LEVEL SECURITY;
CREATE POLICY n018_stg_sales_lines_clean_select_own_tenant ON stg_sales_lines_clean FOR SELECT TO authenticated USING (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text));
CREATE POLICY n018_stg_sales_lines_clean_insert_own_tenant ON stg_sales_lines_clean FOR INSERT TO authenticated WITH CHECK (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text));
CREATE POLICY n018_stg_sales_lines_clean_update_own_tenant ON stg_sales_lines_clean FOR UPDATE TO authenticated USING (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text)) WITH CHECK (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text));
CREATE POLICY n018_stg_sales_lines_clean_delete_own_tenant ON stg_sales_lines_clean FOR DELETE TO authenticated USING (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text));

ALTER TABLE raw_ar_open_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY n018_raw_ar_open_items_select_own_tenant ON raw_ar_open_items FOR SELECT TO authenticated USING (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text));
CREATE POLICY n018_raw_ar_open_items_insert_own_tenant ON raw_ar_open_items FOR INSERT TO authenticated WITH CHECK (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text));
CREATE POLICY n018_raw_ar_open_items_update_own_tenant ON raw_ar_open_items FOR UPDATE TO authenticated USING (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text)) WITH CHECK (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text));
CREATE POLICY n018_raw_ar_open_items_delete_own_tenant ON raw_ar_open_items FOR DELETE TO authenticated USING (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text));

ALTER TABLE stg_sales_clean ENABLE ROW LEVEL SECURITY;
CREATE POLICY n018_stg_sales_clean_select_own_tenant ON stg_sales_clean FOR SELECT TO authenticated USING (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text));
CREATE POLICY n018_stg_sales_clean_insert_own_tenant ON stg_sales_clean FOR INSERT TO authenticated WITH CHECK (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text));
CREATE POLICY n018_stg_sales_clean_update_own_tenant ON stg_sales_clean FOR UPDATE TO authenticated USING (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text)) WITH CHECK (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text));
CREATE POLICY n018_stg_sales_clean_delete_own_tenant ON stg_sales_clean FOR DELETE TO authenticated USING (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text));

ALTER TABLE raw_customer_payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY n018_raw_customer_payments_select_own_tenant ON raw_customer_payments FOR SELECT TO authenticated USING (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text));
CREATE POLICY n018_raw_customer_payments_insert_own_tenant ON raw_customer_payments FOR INSERT TO authenticated WITH CHECK (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text));
CREATE POLICY n018_raw_customer_payments_update_own_tenant ON raw_customer_payments FOR UPDATE TO authenticated USING (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text)) WITH CHECK (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text));
CREATE POLICY n018_raw_customer_payments_delete_own_tenant ON raw_customer_payments FOR DELETE TO authenticated USING (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text));

ALTER TABLE raw_inbound_shipments ENABLE ROW LEVEL SECURITY;
CREATE POLICY n018_raw_inbound_shipments_select_own_tenant ON raw_inbound_shipments FOR SELECT TO authenticated USING (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text));
CREATE POLICY n018_raw_inbound_shipments_insert_own_tenant ON raw_inbound_shipments FOR INSERT TO authenticated WITH CHECK (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text));
CREATE POLICY n018_raw_inbound_shipments_update_own_tenant ON raw_inbound_shipments FOR UPDATE TO authenticated USING (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text)) WITH CHECK (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text));
CREATE POLICY n018_raw_inbound_shipments_delete_own_tenant ON raw_inbound_shipments FOR DELETE TO authenticated USING (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text));

ALTER TABLE raw_inventory ENABLE ROW LEVEL SECURITY;
CREATE POLICY n018_raw_inventory_select_own_tenant ON raw_inventory FOR SELECT TO authenticated USING (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text));
CREATE POLICY n018_raw_inventory_insert_own_tenant ON raw_inventory FOR INSERT TO authenticated WITH CHECK (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text));
CREATE POLICY n018_raw_inventory_update_own_tenant ON raw_inventory FOR UPDATE TO authenticated USING (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text)) WITH CHECK (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text));
CREATE POLICY n018_raw_inventory_delete_own_tenant ON raw_inventory FOR DELETE TO authenticated USING (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text));

ALTER TABLE raw_inventory_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY n018_raw_inventory_transactions_select_own_tenant ON raw_inventory_transactions FOR SELECT TO authenticated USING (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text));
CREATE POLICY n018_raw_inventory_transactions_insert_own_tenant ON raw_inventory_transactions FOR INSERT TO authenticated WITH CHECK (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text));
CREATE POLICY n018_raw_inventory_transactions_update_own_tenant ON raw_inventory_transactions FOR UPDATE TO authenticated USING (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text)) WITH CHECK (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text));
CREATE POLICY n018_raw_inventory_transactions_delete_own_tenant ON raw_inventory_transactions FOR DELETE TO authenticated USING (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text));

ALTER TABLE stg_inbound_shipments_clean ENABLE ROW LEVEL SECURITY;
CREATE POLICY n018_stg_inbound_shipments_clean_select_own_tenant ON stg_inbound_shipments_clean FOR SELECT TO authenticated USING (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text));
CREATE POLICY n018_stg_inbound_shipments_clean_insert_own_tenant ON stg_inbound_shipments_clean FOR INSERT TO authenticated WITH CHECK (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text));
CREATE POLICY n018_stg_inbound_shipments_clean_update_own_tenant ON stg_inbound_shipments_clean FOR UPDATE TO authenticated USING (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text)) WITH CHECK (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text));
CREATE POLICY n018_stg_inbound_shipments_clean_delete_own_tenant ON stg_inbound_shipments_clean FOR DELETE TO authenticated USING (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text));

ALTER TABLE stg_items_master_clean ENABLE ROW LEVEL SECURITY;
CREATE POLICY n018_stg_items_master_clean_select_own_tenant ON stg_items_master_clean FOR SELECT TO authenticated USING (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text));
CREATE POLICY n018_stg_items_master_clean_insert_own_tenant ON stg_items_master_clean FOR INSERT TO authenticated WITH CHECK (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text));
CREATE POLICY n018_stg_items_master_clean_update_own_tenant ON stg_items_master_clean FOR UPDATE TO authenticated USING (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text)) WITH CHECK (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text));
CREATE POLICY n018_stg_items_master_clean_delete_own_tenant ON stg_items_master_clean FOR DELETE TO authenticated USING (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text));

ALTER TABLE raw_items_master ENABLE ROW LEVEL SECURITY;
CREATE POLICY n018_raw_items_master_select_own_tenant ON raw_items_master FOR SELECT TO authenticated USING (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text));
CREATE POLICY n018_raw_items_master_insert_own_tenant ON raw_items_master FOR INSERT TO authenticated WITH CHECK (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text));
CREATE POLICY n018_raw_items_master_update_own_tenant ON raw_items_master FOR UPDATE TO authenticated USING (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text)) WITH CHECK (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text));
CREATE POLICY n018_raw_items_master_delete_own_tenant ON raw_items_master FOR DELETE TO authenticated USING (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text));

ALTER TABLE stg_customer_payments_clean ENABLE ROW LEVEL SECURITY;
CREATE POLICY n018_stg_customer_payments_clean_select_own_tenant ON stg_customer_payments_clean FOR SELECT TO authenticated USING (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text));
CREATE POLICY n018_stg_customer_payments_clean_insert_own_tenant ON stg_customer_payments_clean FOR INSERT TO authenticated WITH CHECK (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text));
CREATE POLICY n018_stg_customer_payments_clean_update_own_tenant ON stg_customer_payments_clean FOR UPDATE TO authenticated USING (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text)) WITH CHECK (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text));
CREATE POLICY n018_stg_customer_payments_clean_delete_own_tenant ON stg_customer_payments_clean FOR DELETE TO authenticated USING (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text));

ALTER TABLE raw_item_bom ENABLE ROW LEVEL SECURITY;
CREATE POLICY n018_raw_item_bom_select_own_tenant ON raw_item_bom FOR SELECT TO authenticated USING (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text));
CREATE POLICY n018_raw_item_bom_insert_own_tenant ON raw_item_bom FOR INSERT TO authenticated WITH CHECK (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text));
CREATE POLICY n018_raw_item_bom_update_own_tenant ON raw_item_bom FOR UPDATE TO authenticated USING (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text)) WITH CHECK (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text));
CREATE POLICY n018_raw_item_bom_delete_own_tenant ON raw_item_bom FOR DELETE TO authenticated USING (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text));

ALTER TABLE raw_open_sales_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY n018_raw_open_sales_orders_select_own_tenant ON raw_open_sales_orders FOR SELECT TO authenticated USING (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text));
CREATE POLICY n018_raw_open_sales_orders_insert_own_tenant ON raw_open_sales_orders FOR INSERT TO authenticated WITH CHECK (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text));
CREATE POLICY n018_raw_open_sales_orders_update_own_tenant ON raw_open_sales_orders FOR UPDATE TO authenticated USING (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text)) WITH CHECK (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text));
CREATE POLICY n018_raw_open_sales_orders_delete_own_tenant ON raw_open_sales_orders FOR DELETE TO authenticated USING (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text));

ALTER TABLE stg_ar_open_items_clean ENABLE ROW LEVEL SECURITY;
CREATE POLICY n018_stg_ar_open_items_clean_select_own_tenant ON stg_ar_open_items_clean FOR SELECT TO authenticated USING (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text));
CREATE POLICY n018_stg_ar_open_items_clean_insert_own_tenant ON stg_ar_open_items_clean FOR INSERT TO authenticated WITH CHECK (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text));
CREATE POLICY n018_stg_ar_open_items_clean_update_own_tenant ON stg_ar_open_items_clean FOR UPDATE TO authenticated USING (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text)) WITH CHECK (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text));
CREATE POLICY n018_stg_ar_open_items_clean_delete_own_tenant ON stg_ar_open_items_clean FOR DELETE TO authenticated USING (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text));

ALTER TABLE stg_inventory_clean ENABLE ROW LEVEL SECURITY;
CREATE POLICY n018_stg_inventory_clean_select_own_tenant ON stg_inventory_clean FOR SELECT TO authenticated USING (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text));
CREATE POLICY n018_stg_inventory_clean_insert_own_tenant ON stg_inventory_clean FOR INSERT TO authenticated WITH CHECK (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text));
CREATE POLICY n018_stg_inventory_clean_update_own_tenant ON stg_inventory_clean FOR UPDATE TO authenticated USING (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text)) WITH CHECK (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text));
CREATE POLICY n018_stg_inventory_clean_delete_own_tenant ON stg_inventory_clean FOR DELETE TO authenticated USING (client_id = ((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'client_id'::text));

