import pandas as pd
from sqlalchemy import text
from datetime import datetime

class ETLAuditor:
    def __init__(self, db_connection):
        self.db = db_connection

    def start_audit(self, module: str, entity: str) -> int:
        if not self.db:
            return -1
        
        try:
            query = text("""
                INSERT INTO sys_etl_audit_log (module, entity, status, start_time)
                VALUES (:module, :entity, 'RUNNING', CURRENT_TIMESTAMP)
                RETURNING id
            """)
            with self.db.begin() as conn:
                result = conn.execute(query, {"module": module, "entity": entity})
                return result.fetchone()[0]
        except Exception as e:
            print(f"[Audit] Error starting audit for {module}.{entity}: {e}")
            return -1

    def get_watermark(self, module: str, entity: str) -> str:
        if not self.db:
            return "2020-01-01 00:00:00"
            
        try:
            query = text("""
                SELECT watermark_timestamp 
                FROM sys_etl_audit_log 
                WHERE module = :module AND entity = :entity AND status = 'SUCCESS'
                ORDER BY watermark_timestamp DESC NULLS LAST
                LIMIT 1
            """)
            with self.db.begin() as conn:
                result = conn.execute(query, {"module": module, "entity": entity}).fetchone()
                if result and result[0]:
                    # return as string format expected by NetSuite
                    return result[0].strftime("%Y-%m-%d %H:%M:%S")
        except Exception as e:
            print(f"[Audit] Error getting watermark for {module}.{entity}: {e}")
            
        return "2020-01-01 00:00:00"

    def finish_audit(self, audit_id: int, status: str, extracted: int, loaded: int, watermark: str = None, error_msg: str = None):
        if not self.db or audit_id == -1:
            return
            
        try:
            query = text("""
                UPDATE sys_etl_audit_log 
                SET end_time = CURRENT_TIMESTAMP,
                    status = :status,
                    records_extracted = :extracted,
                    records_loaded = :loaded,
                    watermark_timestamp = :watermark,
                    error_message = :error_msg
                WHERE id = :id
            """)
            
            # Cast string watermark back to datetime if possible for PostgreSQL
            watermark_dt = None
            if watermark:
                try:
                    watermark_dt = pd.to_datetime(watermark, dayfirst=True)
                except:
                    pass

            with self.db.begin() as conn:
                conn.execute(query, {
                    "status": status,
                    "extracted": extracted,
                    "loaded": loaded,
                    "watermark": watermark_dt,
                    "error_msg": str(error_msg)[:2000] if error_msg else None,
                    "id": audit_id
                })
        except Exception as e:
            print(f"[Audit] Error finishing audit {audit_id}: {e}")
