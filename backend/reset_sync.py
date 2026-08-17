import os
from sqlalchemy import create_engine
from sqlalchemy import text
from dotenv import load_dotenv

load_dotenv()
engine = create_engine(os.getenv('DATABASE_URL').replace('?pgbouncer=true',''))
with engine.begin() as conn:
    conn.execute(text("UPDATE _etl_sync_logs SET max_timestamp = '2020-01-01 00:00:00' WHERE table_name IN ('raw_ns_transactions', 'raw_ns_transaction_lines')"))
    print("Reset sync logs for transactions")
