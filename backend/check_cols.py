import os
import pandas as pd
from sqlalchemy import create_engine
from dotenv import load_dotenv
load_dotenv()
engine = create_engine(os.getenv('DATABASE_URL').replace('?pgbouncer=true',''))
df = pd.read_sql("SELECT column_name FROM information_schema.columns WHERE table_name = 'raw_items_master'", engine)
print(df.to_string())
