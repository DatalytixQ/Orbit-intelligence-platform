-- Apply script for N002 Phase 3 (Config, Audit & AI tables)

-- 1. ar_settings
ALTER TABLE ar_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ar_settings_select_policy" ON ar_settings FOR SELECT USING (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');
CREATE POLICY "ar_settings_insert_policy" ON ar_settings FOR INSERT WITH CHECK (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');
CREATE POLICY "ar_settings_update_policy" ON ar_settings FOR UPDATE USING (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');
CREATE POLICY "ar_settings_delete_policy" ON ar_settings FOR DELETE USING (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');

-- 2. client_config
ALTER TABLE client_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "client_config_select_policy" ON client_config FOR SELECT USING (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');
CREATE POLICY "client_config_insert_policy" ON client_config FOR INSERT WITH CHECK (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');
CREATE POLICY "client_config_update_policy" ON client_config FOR UPDATE USING (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');
CREATE POLICY "client_config_delete_policy" ON client_config FOR DELETE USING (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');

-- 3. inventory_settings
ALTER TABLE inventory_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "inventory_settings_select_policy" ON inventory_settings FOR SELECT USING (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');
CREATE POLICY "inventory_settings_insert_policy" ON inventory_settings FOR INSERT WITH CHECK (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');
CREATE POLICY "inventory_settings_update_policy" ON inventory_settings FOR UPDATE USING (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');
CREATE POLICY "inventory_settings_delete_policy" ON inventory_settings FOR DELETE USING (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');

-- 4. sales_settings
ALTER TABLE sales_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sales_settings_select_policy" ON sales_settings FOR SELECT USING (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');
CREATE POLICY "sales_settings_insert_policy" ON sales_settings FOR INSERT WITH CHECK (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');
CREATE POLICY "sales_settings_update_policy" ON sales_settings FOR UPDATE USING (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');
CREATE POLICY "sales_settings_delete_policy" ON sales_settings FOR DELETE USING (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');

-- 5. alert_config
ALTER TABLE alert_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "alert_config_select_policy" ON alert_config FOR SELECT USING (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');
CREATE POLICY "alert_config_insert_policy" ON alert_config FOR INSERT WITH CHECK (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');
CREATE POLICY "alert_config_update_policy" ON alert_config FOR UPDATE USING (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');
CREATE POLICY "alert_config_delete_policy" ON alert_config FOR DELETE USING (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');

-- 6. inventory_category_settings
ALTER TABLE inventory_category_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "inventory_category_settings_select_policy" ON inventory_category_settings FOR SELECT USING (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');
CREATE POLICY "inventory_category_settings_insert_policy" ON inventory_category_settings FOR INSERT WITH CHECK (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');
CREATE POLICY "inventory_category_settings_update_policy" ON inventory_category_settings FOR UPDATE USING (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');
CREATE POLICY "inventory_category_settings_delete_policy" ON inventory_category_settings FOR DELETE USING (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');

-- 7. audit_log
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "audit_log_select_policy" ON audit_log FOR SELECT USING (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');
CREATE POLICY "audit_log_insert_policy" ON audit_log FOR INSERT WITH CHECK (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');
CREATE POLICY "audit_log_update_policy" ON audit_log FOR UPDATE USING (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');
CREATE POLICY "audit_log_delete_policy" ON audit_log FOR DELETE USING (client_id = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');

-- 8. ai_usage_logs (uuid::text cast)
ALTER TABLE ai_usage_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ai_usage_logs_select_policy" ON ai_usage_logs FOR SELECT USING (client_id::text = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');
CREATE POLICY "ai_usage_logs_insert_policy" ON ai_usage_logs FOR INSERT WITH CHECK (client_id::text = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');
CREATE POLICY "ai_usage_logs_update_policy" ON ai_usage_logs FOR UPDATE USING (client_id::text = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');
CREATE POLICY "ai_usage_logs_delete_policy" ON ai_usage_logs FOR DELETE USING (client_id::text = current_setting('request.jwt.claims', true)::jsonb ->> 'client_id');
