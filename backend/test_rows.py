import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

try:
    conn = psycopg2.connect(os.environ['DATABASE_URL'].split('?')[0])
    cur = conn.cursor()
    cur.execute("SELECT COUNT(*) FROM raw_ns_transaction_lines")
    print(f"Lines count: {cur.fetchone()[0]}")
    
    # Let's check how many transactions were completely extracted
    cur.execute("SELECT COUNT(DISTINCT transaction_id) FROM raw_ns_transaction_lines")
    print(f"Distinct Transactions with lines: {cur.fetchone()[0]}")
    
except Exception as e:
    print(e)
