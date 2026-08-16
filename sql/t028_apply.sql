-- T028 Apply: Implement C005 (Critical Overdue Documents)

CREATE OR REPLACE FUNCTION evaluate_c005_critical_overdue_documents()
RETURNS void AS $$
DECLARE
    r RECORD;
    v_severity TEXT;
BEGIN
    FOR r IN (
        SELECT 
            transaction_id,
            customer_id,
            transaction_number,
            open_amount,
            due_date,
            (CURRENT_DATE - due_date) as days_overdue
        FROM stg_ar_open_items_clean
        WHERE open_amount > 10000 -- Threshold for "Critical" high-value
          AND due_date < CURRENT_DATE - interval '30 days'
    ) LOOP
        -- Map days_overdue to insight severity for critical documents
        IF r.days_overdue > 90 THEN
            v_severity := 'critico';
        ELSIF r.days_overdue > 60 THEN
            v_severity := 'alerta';
        ELSE
            v_severity := 'warning';
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
                'C005_DOC_' || r.transaction_id,
                'CRITICAL_OVERDUE_DOCUMENT',
                'Critical Overdue Document',
                'Invoice ' || r.transaction_number || ' for Customer ' || r.customer_id || ' is ' || r.days_overdue || ' days overdue. Amount: ' || r.open_amount,
                v_severity,
                'Escalamiento inmediato para cobranza de documento crítico.',
                'activo',
                jsonb_build_object(
                    'transaction_id', r.transaction_id,
                    'customer_id', r.customer_id,
                    'transaction_number', r.transaction_number,
                    'open_amount', r.open_amount,
                    'days_overdue', r.days_overdue
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
            WHERE insight_key = 'C005_DOC_' || r.transaction_id AND status = 'activo';
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;
