-- T024 Apply: Implement C001 (Overdue Receivables Risk)

CREATE OR REPLACE FUNCTION evaluate_c001_overdue_receivables_risk()
RETURNS void AS $$
DECLARE
    r RECORD;
    v_severity TEXT;
    v_overdue_pct NUMERIC;
BEGIN
    FOR r IN (
        SELECT 
            customer_id,
            SUM(open_amount) AS total_open_balance,
            SUM(CASE WHEN due_date < CURRENT_DATE THEN open_amount ELSE 0 END) AS overdue_balance
        FROM stg_ar_open_items_clean
        GROUP BY customer_id
        HAVING SUM(open_amount) > 0
    ) LOOP
        v_overdue_pct := ROUND((r.overdue_balance / r.total_open_balance) * 100, 2);
        
        IF v_overdue_pct > 40 THEN
            v_severity := 'critico';
        ELSIF v_overdue_pct > 25 THEN
            v_severity := 'alerta';
        ELSIF v_overdue_pct > 15 THEN
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
                'C001_CUST_' || r.customer_id,
                'AR_OVERDUE_RISK',
                'High Overdue Receivables',
                'Customer ' || r.customer_id || ' has ' || v_overdue_pct || '% of their balance overdue.',
                v_severity,
                'Review customer credit terms and contact for collections.',
                'activo',
                jsonb_build_object(
                    'customer_id', r.customer_id,
                    'total_open_balance', r.total_open_balance,
                    'overdue_balance', r.overdue_balance,
                    'overdue_percentage', v_overdue_pct
                )
            ) ON CONFLICT (insight_key) 
            DO UPDATE SET 
                severity = EXCLUDED.severity,
                description = EXCLUDED.description,
                context_json = EXCLUDED.context_json,
                detected_at = now();
        ELSE
            -- Resolve existing insight if it falls below threshold
            UPDATE public.insights_log
            SET status = 'resuelto',
                detected_at = now()
            WHERE insight_key = 'C001_CUST_' || r.customer_id AND status = 'activo';
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;
