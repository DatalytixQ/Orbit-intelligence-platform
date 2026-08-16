-- Rollback script for N002 Phase 3 (Config, Audit & AI tables)

-- 1. ar_settings
DROP POLICY IF EXISTS "ar_settings_select_policy" ON ar_settings;
DROP POLICY IF EXISTS "ar_settings_insert_policy" ON ar_settings;
DROP POLICY IF EXISTS "ar_settings_update_policy" ON ar_settings;
DROP POLICY IF EXISTS "ar_settings_delete_policy" ON ar_settings;

-- 2. client_config
DROP POLICY IF EXISTS "client_config_select_policy" ON client_config;
DROP POLICY IF EXISTS "client_config_insert_policy" ON client_config;
DROP POLICY IF EXISTS "client_config_update_policy" ON client_config;
DROP POLICY IF EXISTS "client_config_delete_policy" ON client_config;

-- 3. inventory_settings
DROP POLICY IF EXISTS "inventory_settings_select_policy" ON inventory_settings;
DROP POLICY IF EXISTS "inventory_settings_insert_policy" ON inventory_settings;
DROP POLICY IF EXISTS "inventory_settings_update_policy" ON inventory_settings;
DROP POLICY IF EXISTS "inventory_settings_delete_policy" ON inventory_settings;

-- 4. sales_settings
DROP POLICY IF EXISTS "sales_settings_select_policy" ON sales_settings;
DROP POLICY IF EXISTS "sales_settings_insert_policy" ON sales_settings;
DROP POLICY IF EXISTS "sales_settings_update_policy" ON sales_settings;
DROP POLICY IF EXISTS "sales_settings_delete_policy" ON sales_settings;

-- 5. alert_config
DROP POLICY IF EXISTS "alert_config_select_policy" ON alert_config;
DROP POLICY IF EXISTS "alert_config_insert_policy" ON alert_config;
DROP POLICY IF EXISTS "alert_config_update_policy" ON alert_config;
DROP POLICY IF EXISTS "alert_config_delete_policy" ON alert_config;

-- 6. inventory_category_settings
DROP POLICY IF EXISTS "inventory_category_settings_select_policy" ON inventory_category_settings;
DROP POLICY IF EXISTS "inventory_category_settings_insert_policy" ON inventory_category_settings;
DROP POLICY IF EXISTS "inventory_category_settings_update_policy" ON inventory_category_settings;
DROP POLICY IF EXISTS "inventory_category_settings_delete_policy" ON inventory_category_settings;

-- 7. audit_log
DROP POLICY IF EXISTS "audit_log_select_policy" ON audit_log;
DROP POLICY IF EXISTS "audit_log_insert_policy" ON audit_log;
DROP POLICY IF EXISTS "audit_log_update_policy" ON audit_log;
DROP POLICY IF EXISTS "audit_log_delete_policy" ON audit_log;

-- 8. ai_usage_logs
DROP POLICY IF EXISTS "ai_usage_logs_select_policy" ON ai_usage_logs;
DROP POLICY IF EXISTS "ai_usage_logs_insert_policy" ON ai_usage_logs;
DROP POLICY IF EXISTS "ai_usage_logs_update_policy" ON ai_usage_logs;
DROP POLICY IF EXISTS "ai_usage_logs_delete_policy" ON ai_usage_logs;
