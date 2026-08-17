import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

try:
    conn = psycopg2.connect(os.environ['DATABASE_URL'].split('?')[0])
    cur = conn.cursor()
    cur.execute("SELECT COUNT(*) FROM raw_ns_transaction_lines WHERE netamount = 'NaN'")
    print(f"NaN netamount count: {cur.fetchone()[0]}")
    
    cur.execute("SELECT COUNT(*) FROM raw_ns_transactions WHERE exchange_rate = 'NaN'")
    print(f"NaN exchange_rate count: {cur.fetchone()[0]}")

    cur.execute("SELECT SUM(COALESCE(netamount, 0)) FROM raw_ns_transaction_lines WHERE netamount != 'NaN'")
    print(f"Total netamount non-NaN: {cur.fetchone()[0]}")

except Exception as e:
    print(e)
