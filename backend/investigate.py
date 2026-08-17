import os
import pandas as pd
from sqlalchemy import create_engine
from dotenv import load_dotenv

load_dotenv()
engine = create_engine(os.getenv('DATABASE_URL').replace('?pgbouncer=true',''))
pd.set_option('display.max_columns', None)
pd.set_option('display.width', 1000)

queries = {
    "1. Transaction Lines for FC A-00007-00049651 (ID 387682)": """
        SELECT line_id, item_id, quantity, rate, netamount 
        FROM raw_ns_transaction_lines 
        WHERE transaction_id = '387682'
    """,
    "2. Duplicates check in dm_dim_items_enriched": """
        SELECT item_id, count(*) as cnt 
        FROM dm_dim_items_enriched 
        GROUP BY item_id 
        HAVING count(*) > 1 
        LIMIT 5
    """,
    "3. Customer 3984 info": """
        SELECT customer_id, companyname, salesrep_id 
        FROM raw_ns_customers 
        WHERE customer_id = '3984'
    """,
    "4. All Sales Reps in dm_dim_sales_reps": """
        SELECT salesrep_id, rep_entityid, rep_full_name 
        FROM dm_dim_sales_reps
    """,
    "5. Check raw_ns_transactions for duplicates": """
        SELECT transaction_id, count(*) 
        FROM raw_ns_transactions 
        WHERE transaction_id = '387682' 
        GROUP BY transaction_id
    """
}

with open("investigate.txt", "w", encoding="utf-8") as f:
    for title, q in queries.items():
        f.write(f"--- {title} ---\n")
        try:
            df = pd.read_sql(q, engine)
            f.write(df.to_string(index=False))
        except Exception as e:
            f.write(str(e))
        f.write("\n\n")
