import sys
sys.path.append(r'C:\Users\dario\erp-intelligence-foundation\backend')
from dotenv import load_dotenv
import os
from sqlalchemy import create_engine
import pandas as pd
load_dotenv()
try:
    db_url = os.getenv("DATABASE_URL").replace("?pgbouncer=true", "").replace("&pgbouncer=true", "")
    engine = create_engine(db_url)
    df = pd.read_sql("SELECT COUNT(*) as cnt FROM raw_ns_customers", engine)
    print("Clientes en DB:", df.iloc[0]['cnt'])
except Exception as e:
    print("Error:", e)
