-- T015: Verify data_pipeline_step_log instrumentation

DO $$
BEGIN
    -- 1. Insert a dummy log entry simulating a pipeline step
    INSERT INTO data_pipeline_step_log (pipeline_name, step_name, status, rows_processed)
    VALUES ('test_pipeline', 'test_step', 'SUCCESS', 100);

    -- 2. Verify the entry exists
    IF NOT EXISTS (
        SELECT 1 FROM data_pipeline_step_log 
        WHERE pipeline_name = 'test_pipeline' AND step_name = 'test_step'
    ) THEN
        RAISE EXCEPTION 'Instrumentation verification failed: log entry not found';
    END IF;

    -- 3. Cleanup test entry
    DELETE FROM data_pipeline_step_log WHERE pipeline_name = 'test_pipeline' AND step_name = 'test_step';
END $$;
