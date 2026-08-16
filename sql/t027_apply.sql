-- T027 Apply: Implement C004 (Collection Efficiency)

CREATE OR REPLACE FUNCTION evaluate_c004_collection_efficiency()
RETURNS void AS $$
DECLARE
    r RECORD;
    v_severity TEXT;
BEGIN
    FOR r IN (
        SELECT 
            customer_id, 
            month,
            collected_amount, 
            billed_amount, 
            collection_efficiency_percentage
        FROM vw_collection_efficiency
        WHERE collection_efficiency_percentage IS NOT NULL
          AND month = date_trunc('month', CURRENT_DATE)
    ) LOOP
        -- Apply C004 thresholds
        IF r.collection_efficiency_percentage < 80 THEN
            v_severity := 'critico';
        ELSIF r.collection_efficiency_percentage < 90 THEN
            v_severity := 'alerta';
        ELSIF r.collection_efficiency_percentage < 95 THEN
            v_severity := 'warning';
        ELSE
            v_severity := 'ok';
        END IF;

        IF v_severity != 'ok' THEN
            INSERT INTO public.insights_log (
                insight_key,
                insight_type,
                title,
                description,
                severity,
                action_suggested,
                status,
                context_json
            ) VALUES (
                'C004_CUST_' || r.customer_id,
                'COLLECTION_EFFICIENCY',
                'Low Collection Efficiency',
                'Customer ' || r.customer_id || ' collection efficiency is ' || r.collection_efficiency_percentage || '%',
                v_severity,
                'Contactar cliente para agilizar pagos y revisar proceso de facturación.',
                'activo',
                jsonb_build_object(
                    'customer_id', r.customer_id,
                    'month', r.month,
                    'collected_amount', r.collected_amount,
                    'billed_amount', r.billed_amount,
                    'collection_efficiency_percentage', r.collection_efficiency_percentage
                )
            ) ON CONFLICT (insight_key) 
            DO UPDATE SET 
                severity = EXCLUDED.severity,
                description = EXCLUDED.description,
                context_json = EXCLUDED.context_json,
                detected_at = now();
        ELSE
            UPDATE public.insights_log
            SET status = 'resuelto',
                detected_at = now()
            WHERE insight_key = 'C004_CUST_' || r.customer_id AND status = 'activo';
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;
