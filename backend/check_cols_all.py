import os
import pandas as pd
from sqlalchemy import create_engine
from dotenv import load_dotenv
load_dotenv()
engine = create_engine(os.getenv('DATABASE_URL').replace('?pgbouncer=true',''))
for table in ['raw_ns_transaction_lines', 'raw_ns_customers']:
    df = pd.read_sql(f"SELECT column_name FROM information_schema.columns WHERE table_name = '{table}'", engine)
    print(f"--- {table} ---")
    print(df['column_name'].tolist())
