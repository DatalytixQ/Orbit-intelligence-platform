import os
import psycopg2
import pandas as pd
from dotenv import load_dotenv

load_dotenv()
db_url = os.getenv('DATABASE_URL').replace('?pgbouncer=true','').replace('postgresql://', 'postgres://')
if db_url.startswith('postgres://'):
    db_url = db_url.replace('postgres://', 'postgresql://')

conn = psycopg2.connect(db_url)
query = """
SELECT COUNT(*) 
FROM raw_ns_transactions t 
JOIN raw_ns_transaction_lines tl ON t.transaction_id = tl.transaction_id 
WHERE t.type IN ('CustInvc', 'CashSale', 'CustCred', 'CashRfnd')
"""
df = pd.read_sql(query, conn)
print("Count with filter:", df)
conn.close()
