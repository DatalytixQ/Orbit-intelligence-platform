import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
import pandas as pd
load_dotenv()
db_url = os.getenv('DATABASE_URL').replace('?pgbouncer=true', '').replace('&pgbouncer=true', '')
engine = create_engine(db_url)

views_to_check = ['vw_rule_c007', 'vw_rule_c008', 'vw_rule_C007', 'vw_rule_C008']

for v in views_to_check:
    print(f"--- {v} ---")
    df = pd.read_sql(f"SELECT definition FROM pg_views WHERE viewname ILIKE '{v}'", engine)
    if not df.empty:
        print(df.iloc[0]['definition'])
    else:
        print('View not found')
