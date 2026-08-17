import os
from sqlalchemy import create_engine
from sqlalchemy import text
from dotenv import load_dotenv

load_dotenv()
engine = create_engine(os.getenv('DATABASE_URL').replace('?pgbouncer=true',''))
with open(r"c:\Users\dario\erp-intelligence-foundation\sql\n050_commercial_v2_dm_apply.sql", "r", encoding="utf-8") as f:
    sql = f.read()

with engine.begin() as conn:
    conn.execute(text(sql))
    print("Migration n050 applied directly")
