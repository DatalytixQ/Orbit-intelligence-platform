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
SELECT 
    TO_CHAR(sale_month, 'YYYY-MM') as month,
    SUM(net_amount_base) as total_net,
    SUM(cogs_base) as total_cogs,
    SUM(quantity) as total_qty
FROM dm_fact_sales
WHERE sale_month >= '2024-01-01'
GROUP BY 1
ORDER BY 1 DESC
"""
df = pd.read_sql(query, conn)
print("--- dm_fact_sales aggregates by month ---")
print(df)

query2 = """
SELECT invoice_number, transaction_type, net_amount_base, cogs_base, quantity, salesrep_id
FROM dm_fact_sales
WHERE invoice_number IN ('FC A-00007-00049651', 'FC A-00007-00049652', 'MEX-9900022420', 'MEX-9900022423')
"""
df2 = pd.read_sql(query2, conn)
print("\n--- Specific Invoices ---")
print(df2)

conn.close()
