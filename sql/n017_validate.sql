-- N017: Validate data_pipeline_step_log

DO $$
BEGIN
    -- Check if table exists
    IF NOT EXISTS (
        SELECT FROM pg_tables
        WHERE schemaname = 'public' AND tablename = 'data_pipeline_step_log'
    ) THEN
        RAISE EXCEPTION 'Table data_pipeline_step_log does not exist';
    END IF;

    -- Check if RLS is enabled
    IF NOT EXISTS (
        SELECT FROM pg_class
        WHERE relname = 'data_pipeline_step_log' AND relrowsecurity = true
    ) THEN
        RAISE EXCEPTION 'RLS is not enabled on data_pipeline_step_log';
    END IF;

    -- Check if policies exist
    IF NOT EXISTS (
        SELECT FROM pg_policies
        WHERE tablename = 'data_pipeline_step_log' AND policyname = 'service_role_insert'
    ) THEN
        RAISE EXCEPTION 'Policy service_role_insert does not exist';
    END IF;
END $$;
