import os
import pandas as pd
from sqlalchemy import create_engine
from dotenv import load_dotenv

load_dotenv('../.env')
db_url = os.getenv('SUPABASE_DB_URL')
if db_url:
    db_url = db_url.replace('?pgbouncer=true', '')
engine = create_engine(db_url)
df = pd.read_sql("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'raw_ns_transaction_lines'", engine)
print(list(df['column_name']))
