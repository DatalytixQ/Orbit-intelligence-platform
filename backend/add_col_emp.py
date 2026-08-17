import os
from sqlalchemy import create_engine
from sqlalchemy import text
from dotenv import load_dotenv
load_dotenv()
engine = create_engine(os.getenv('DATABASE_URL').replace('?pgbouncer=true',''))
with engine.begin() as conn:
    conn.execute(text("ALTER TABLE raw_ns_employees ADD COLUMN IF NOT EXISTS subsidiary VARCHAR(255), ADD COLUMN IF NOT EXISTS department VARCHAR(255)"))
    print("Columns added to employees")
