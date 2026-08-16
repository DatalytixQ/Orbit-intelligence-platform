-- N004c Rollback: Revert renaming of insights table
DO $$
BEGIN
    -- Check if the deprecated legacy insights table exists
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'legacy_insights_deprecated') THEN
        RAISE NOTICE 'Restoring legacy insights table...';
        ALTER TABLE public.legacy_insights_deprecated RENAME TO insights;
    ELSE
        RAISE NOTICE 'Deprecated legacy table not found. Nothing to rollback.';
    END IF;
END $$;
