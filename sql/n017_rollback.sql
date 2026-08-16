-- N017: Rollback data_pipeline_step_log

DROP POLICY IF EXISTS "service_role_insert" ON data_pipeline_step_log;
DROP POLICY IF EXISTS "admin_select" ON data_pipeline_step_log;

DROP INDEX IF EXISTS idx_data_pipeline_step_log_pipeline;
DROP INDEX IF EXISTS idx_data_pipeline_step_log_status;
DROP INDEX IF EXISTS idx_data_pipeline_step_log_start_time;

DROP TABLE IF EXISTS data_pipeline_step_log;
