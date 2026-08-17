import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

try:
    conn = psycopg2.connect(os.environ['DATABASE_URL'].split('?')[0])
    cur = conn.cursor()
    
    # Update NaN values to NULL in the raw table
    cur.execute("UPDATE raw_ns_transaction_lines SET netamount = NULL WHERE netamount = 'NaN'")
    cur.execute("UPDATE raw_ns_transaction_lines SET quantity = NULL WHERE quantity = 'NaN'")
    cur.execute("UPDATE raw_ns_transaction_lines SET rate = NULL WHERE rate = 'NaN'")
    
    conn.commit()
    print("Cleaned up NaN values in database.")

    # Re-calculate to see if dm_fact_sales is fixed
    cur.execute("SELECT SUM(net_amount_base) FROM dm_fact_sales")
    total = cur.fetchone()[0]
    print(f"Total Sales after cleanup: {total}")
    
except Exception as e:
    print(e)
