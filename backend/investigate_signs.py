import os
import pandas as pd
from sqlalchemy import create_engine
from dotenv import load_dotenv

load_dotenv()
engine = create_engine(os.getenv('DATABASE_URL').replace('?pgbouncer=true',''))
pd.set_option('display.max_columns', None)
pd.set_option('display.width', 1000)

queries = {
    "1. Sales Order signs": """
        SELECT type, SUM(tl.quantity) as sum_qty, SUM(tl.netamount) as sum_net
        FROM raw_ns_transactions t
        JOIN raw_ns_transaction_lines tl ON t.transaction_id = tl.transaction_id
        WHERE t.type = 'SalesOrd'
        GROUP BY 1
    """,
    "2. Invoice signs": """
        SELECT type, SUM(tl.quantity) as sum_qty, SUM(tl.netamount) as sum_net
        FROM raw_ns_transactions t
        JOIN raw_ns_transaction_lines tl ON t.transaction_id = tl.transaction_id
        WHERE t.type = 'CustInvc'
        GROUP BY 1
    """,
    "3. Estimate signs": """
        SELECT type, SUM(tl.quantity) as sum_qty, SUM(tl.netamount) as sum_net
        FROM raw_ns_transactions t
        JOIN raw_ns_transaction_lines tl ON t.transaction_id = tl.transaction_id
        WHERE t.type = 'Estimate'
        GROUP BY 1
    """
}

with open("investigate_signs.txt", "w", encoding="utf-8") as f:
    for title, q in queries.items():
        f.write(f"--- {title} ---\n")
        try:
            df = pd.read_sql(q, engine)
            f.write(df.to_string(index=False))
        except Exception as e:
            f.write(str(e))
        f.write("\n\n")
