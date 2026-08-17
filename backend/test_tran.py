import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

try:
    conn = psycopg2.connect(os.environ['DATABASE_URL'].split('?')[0])
    cur = conn.cursor()
    cur.execute("SELECT * FROM raw_ns_transactions WHERE tranid = 'FC A-00007-00049651'")
    cols = [desc[0] for desc in cur.description]
    row = cur.fetchone()
    if row:
        print(dict(zip(cols, row)))
    else:
        print("Transaction not found")
        
except Exception as e:
    print(e)
