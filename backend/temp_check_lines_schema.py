import os
import pandas as pd
from sqlalchemy import create_engine
from dotenv import load_dotenv

load_dotenv()
engine = create_engine(os.getenv('DATABASE_URL'))
df = pd.read_sql("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'raw_ns_transaction_lines'", engine)
print(df)
