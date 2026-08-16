-- N017: Activate data_pipeline_step_log

CREATE TABLE IF NOT EXISTS data_pipeline_step_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pipeline_name TEXT NOT NULL,
    step_name TEXT NOT NULL,
    status TEXT NOT NULL,
    start_time TIMESTAMPTZ NOT NULL DEFAULT now(),
    end_time TIMESTAMPTZ,
    rows_processed INTEGER DEFAULT 0,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_data_pipeline_step_log_pipeline ON data_pipeline_step_log(pipeline_name, step_name);
CREATE INDEX IF NOT EXISTS idx_data_pipeline_step_log_status ON data_pipeline_step_log(status);
CREATE INDEX IF NOT EXISTS idx_data_pipeline_step_log_start_time ON data_pipeline_step_log(start_time DESC);

ALTER TABLE data_pipeline_step_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_insert" ON data_pipeline_step_log 
FOR INSERT WITH CHECK (true);

CREATE POLICY "admin_select" ON data_pipeline_step_log 
FOR SELECT USING (current_setting('request.jwt.claims', true)::jsonb ->> 'role' = 'admin');

-- Example of instrumentation logic to be injected into all refresh_* functions:
-- INSERT INTO data_pipeline_step_log (pipeline_name, step_name, status) VALUES ('sales_pipeline', 'refresh_stg_sales_clean', 'SUCCESS');
