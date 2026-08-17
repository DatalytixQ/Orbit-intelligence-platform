import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()
db_url = os.getenv('DATABASE_URL').replace('?pgbouncer=true','').replace('postgresql://', 'postgres://')
if db_url.startswith('postgres://'):
    db_url = db_url.replace('postgres://', 'postgresql://')

conn = psycopg2.connect(db_url)
cur = conn.cursor()
cur.execute("SELECT COUNT(*) FROM raw_ns_transactions")
print("Transactions count:", cur.fetchone()[0])
cur.execute("SELECT COUNT(*) FROM raw_ns_transaction_lines")
print("Lines count:", cur.fetchone()[0])
cur.close()
conn.close()
