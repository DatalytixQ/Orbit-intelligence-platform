import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

try:
    conn = psycopg2.connect(os.environ['DATABASE_URL'].split('?')[0])
    cur = conn.cursor()
    cur.execute("SELECT COUNT(*) FROM dm_fact_sales")
    print(f"dm_fact_sales count: {cur.fetchone()[0]}")
    
    cur.execute("SELECT SUM(net_amount_base) FROM dm_fact_sales")
    print(f"Total Sales: {cur.fetchone()[0]}")
except Exception as e:
    print(e)
