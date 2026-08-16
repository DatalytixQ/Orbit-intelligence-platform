-- n054_etl_audit_table.sql
-- Crea la tabla del log de auditoría para el ETL y define la lógica de Watermark incremental.

CREATE TABLE IF NOT EXISTS sys_etl_audit_log (
    id SERIAL PRIMARY KEY,
    module VARCHAR(100) NOT NULL,            -- e.g. 'Master Data', 'Sales'
    entity VARCHAR(100) NOT NULL,            -- e.g. 'customers', 'transactions'
    start_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) NOT NULL,             -- 'RUNNING', 'SUCCESS', 'ERROR'
    records_extracted INTEGER DEFAULT 0,
    records_loaded INTEGER DEFAULT 0,
    watermark_timestamp TIMESTAMP WITH TIME ZONE, -- The max dateLastModified fetched from the ERP
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para facilitar las búsquedas rápidas de watermarks
CREATE INDEX idx_sys_etl_audit_module_entity ON sys_etl_audit_log(module, entity);
CREATE INDEX idx_sys_etl_audit_status ON sys_etl_audit_log(status);
CREATE INDEX idx_sys_etl_audit_start_time ON sys_etl_audit_log(start_time);
