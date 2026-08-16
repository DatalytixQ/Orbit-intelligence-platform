-- T026 Apply: Implement C003 (Customer Credit Risk)

CREATE OR REPLACE FUNCTION evaluate_c003_customer_credit_risk()
RETURNS void AS $$
DECLARE
    r RECORD;
    v_severity TEXT;
BEGIN
    FOR r IN (
        -- Select customers with elevated risk from the latest snapshot
        SELECT 
            customer_id, 
            risk_score, 
            risk_category, 
            open_balance, 
            credit_limit
        FROM public.finance_customer_risk_snapshot
        WHERE snapshot_date = CURRENT_DATE
          AND risk_category IN ('Medio', 'Alto', 'Muy Alto')
    ) LOOP
        -- Map risk_category to insight severity
        IF r.risk_category = 'Muy Alto' THEN
            v_severity := 'critico';
        ELSIF r.risk_category = 'Alto' THEN
            v_severity := 'alerta';
        ELSIF r.risk_category = 'Medio' THEN
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
                'C003_CUST_' || r.customer_id,
                'CREDIT_RISK',
                'Elevated Customer Credit Risk',
                'Customer ' || r.customer_id || ' is classified as ' || r.risk_category || ' risk.',
                v_severity,
                'Review credit limit and consider blocking future sales on credit.',
                'activo',
                jsonb_build_object(
                    'customer_id', r.customer_id,
                    'risk_score', r.risk_score,
                    'risk_category', r.risk_category,
                    'open_balance', r.open_balance,
                    'credit_limit', r.credit_limit
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
            WHERE insight_key = 'C003_CUST_' || r.customer_id AND status = 'activo';
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;
