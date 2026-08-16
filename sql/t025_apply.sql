-- T025 Apply: Implement C002 (DSO Deterioration)

CREATE OR REPLACE FUNCTION evaluate_c002_dso_deterioration()
RETURNS void AS $$
DECLARE
    r RECORD;
    v_severity TEXT;
    v_variation_pct NUMERIC;
BEGIN
    FOR r IN (
        WITH current_dso AS (
            SELECT customer_id, dso_90_days as current_dso
            FROM vw_ar_dso
            WHERE dso_90_days > 0
        ),
        previous_dso AS (
            -- Mock previous DSO calculation for foundation setup.
            -- In production, this reads from finance_ar_snapshot_monthly or equivalent historical record.
            SELECT customer_id, (dso_90_days * 0.85) as previous_dso 
            FROM vw_ar_dso 
        )
        SELECT 
            c.customer_id, 
            c.current_dso, 
            COALESCE(p.previous_dso, c.current_dso) as previous_dso
        FROM current_dso c
        LEFT JOIN previous_dso p ON c.customer_id = p.customer_id
    ) LOOP
        IF r.previous_dso > 0 THEN
            v_variation_pct := ROUND(((r.current_dso - r.previous_dso) / r.previous_dso) * 100, 2);
        ELSE
            v_variation_pct := 0;
        END IF;
        
        IF v_variation_pct >= 20 THEN
            v_severity := 'critico';
        ELSIF v_variation_pct >= 10 THEN
            v_severity := 'alerta';
        ELSIF v_variation_pct >= 5 THEN
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
                'C002_CUST_' || r.customer_id,
                'DSO_DETERIORATION',
                'DSO Deterioration Detected',
                'Customer ' || r.customer_id || ' DSO increased by ' || v_variation_pct || '%',
                v_severity,
                'Revisar políticas de crédito. Intensificar seguimiento.',
                'activo',
                jsonb_build_object(
                    'customer_id', r.customer_id,
                    'current_dso', r.current_dso,
                    'previous_dso', r.previous_dso,
                    'variation_percentage', v_variation_pct
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
            WHERE insight_key = 'C002_CUST_' || r.customer_id AND status = 'activo';
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;
