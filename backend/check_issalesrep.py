import os
import pandas as pd
from sqlalchemy import create_engine
from dotenv import load_dotenv

load_dotenv()
engine = create_engine(os.getenv('DATABASE_URL').replace('?pgbouncer=true',''))
df = pd.read_sql("SELECT id, issalesrep FROM raw_ns_employees LIMIT 5", engine)
print(df.to_string())
