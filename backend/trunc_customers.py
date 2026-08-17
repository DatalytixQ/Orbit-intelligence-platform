import os
from sqlalchemy import create_engine
from sqlalchemy import text
from dotenv import load_dotenv
load_dotenv()
engine = create_engine(os.getenv('DATABASE_URL').replace('?pgbouncer=true',''))
with engine.begin() as conn:
    conn.execute(text("TRUNCATE TABLE raw_ns_customers"))
    print("Table truncated")
