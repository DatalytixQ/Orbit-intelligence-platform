const sql = require('./db');

async function migrate() {
    try {
        console.log("Creando tabla tenant_business_policies...");
        
        await sql`
            CREATE TABLE IF NOT EXISTS tenant_business_policies (
                tenant_id INT DEFAULT 1,
                category VARCHAR(50),
                policy_key VARCHAR(100),
                policy_value VARCHAR(255),
                description TEXT,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (tenant_id, category, policy_key)
            );
        `;

        console.log("Insertando valores por defecto (compatibilidad hacia atrás)...");
        // Valores exactos actuales del sistema
        const policies = [
            // Localización
            { category: 'localization', key: 'currency_symbol', value: '$', desc: 'Símbolo de moneda base' },
            { category: 'localization', key: 'currency_code', value: 'USD', desc: 'Código de moneda' },
            
            // Finanzas
            { category: 'finance', key: 'best_possible_dso', value: '30', desc: 'Días de cobro ideal (Best Possible DSO)' },
            { category: 'finance', key: 'dso_gap_critical_threshold', value: '45', desc: 'DSO > X se considera crítico' },
            { category: 'finance', key: 'critical_aging_days', value: '90', desc: 'Mora mayor a X días es Capital Crítico' },
            { category: 'finance', key: 'critical_balance_minimum', value: '100000', desc: 'Balance en mora mínimo para disparar alerta en Top Offenders' },
            
            // Inventario
            { category: 'inventory', key: 'slow_moving_months_threshold', value: '6', desc: 'Meses sin salidas para considerar Stock Inmovilizado' },
            { category: 'inventory', key: 'target_coverage_months', value: '3', desc: 'Meses objetivo de cobertura general (referencia)' },
            { category: 'supply', key: 'supply_risk_days_threshold', value: '60', desc: 'Días de umbral para riesgo inminente de quiebre (OV)' },
            
            // Ventas
            { category: 'sales', key: 'monthly_sales_target', value: '50000000', desc: 'Meta comercial mensual (Fija)' },
            { category: 'sales', key: 'base_forecast_growth_pct', value: '5', desc: 'Porcentaje de crecimiento esperado base (%)' }
        ];

        for (const p of policies) {
            await sql`
                INSERT INTO tenant_business_policies (tenant_id, category, policy_key, policy_value, description)
                VALUES (1, ${p.category}, ${p.key}, ${p.value}, ${p.desc})
                ON CONFLICT (tenant_id, category, policy_key) 
                DO UPDATE SET policy_value = EXCLUDED.policy_value, description = EXCLUDED.description;
            `;
        }

        console.log("Creando función SQL get_policy_value...");
        await sql`
            CREATE OR REPLACE FUNCTION get_policy_value(p_tenant_id INT, p_category VARCHAR, p_key VARCHAR, p_default VARCHAR)
            RETURNS VARCHAR AS $$
            DECLARE
                v_value VARCHAR;
            BEGIN
                SELECT policy_value INTO v_value 
                FROM tenant_business_policies 
                WHERE tenant_id = p_tenant_id 
                  AND category = p_category 
                  AND policy_key = p_key;
                  
                IF v_value IS NULL THEN
                    RETURN p_default;
                END IF;
                
                RETURN v_value;
            END;
            $$ LANGUAGE plpgsql;
        `;
        
        console.log("Migración completada exitosamente.");
    } catch (err) {
        console.error("Error en la migración:", err);
    } finally {
        process.exit(0);
    }
}

migrate();
