-- N004c Apply: Migrate legacy insights to insights_log
DO $$
BEGIN
    -- Check if the legacy insights table exists
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'insights') THEN
        
        -- Check if insights_log exists before inserting
        IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'insights_log') THEN
            
            RAISE NOTICE 'Migrating data from insights to insights_log...';
            
            -- Insert missing insights, mapping legacy columns to new schema
            -- Note: Adapting columns based on typical mappings.
            INSERT INTO public.insights_log (
                insight_key,
                insight_type,
                title,
                description,
                severity,
                action_suggested,
                status,
                detected_at
            )
            SELECT 
                insight_key,
                insight_type,
                title,
                description,
                severity,
                action_suggested,
                status,
                created_at as detected_at
            FROM public.insights
            ON CONFLICT (insight_key) DO NOTHING;
            
            RAISE NOTICE 'Migration completed. Renaming legacy table.';
            
            -- Rename legacy table to prevent future use but keep data just in case
            ALTER TABLE public.insights RENAME TO legacy_insights_deprecated;
            
        ELSE
            RAISE NOTICE 'Target table insights_log does not exist. Skipping migration.';
        END IF;
    ELSE
        RAISE NOTICE 'Legacy table insights does not exist. No migration needed.';
    END IF;
END $$;
