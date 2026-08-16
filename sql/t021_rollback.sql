-- T021 Rollback: Remove AR STG from automated pipeline sequence
DO $$
BEGIN
    -- Unschedule the AR STG refresh job
    PERFORM cron.unschedule('refresh_ar_stg');
    
    RAISE NOTICE 'Unscheduled refresh_stg_ar_open_items_clean from pg_cron';
END $$;
