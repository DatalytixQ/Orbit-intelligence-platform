-- T021 Apply: Integrate AR STG into automated pipeline sequence
DO $$
BEGIN
    -- Enable pg_cron extension if not already enabled
    -- Note: In Supabase, extensions should be enabled by superuser, but this ensures it's documented.
    CREATE EXTENSION IF NOT EXISTS pg_cron;

    -- Schedule the AR STG refresh job to run daily at 01:30 AM
    -- Ensure it is part of the sequence (e.g., after RAW but before Business/Semantic layers)
    PERFORM cron.schedule(
        'refresh_ar_stg',
        '30 1 * * *',
        'SELECT refresh_stg_ar_open_items_clean()'
    );

    RAISE NOTICE 'Scheduled refresh_stg_ar_open_items_clean via pg_cron';
END $$;
