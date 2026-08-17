import os
import pandas as pd
from sqlalchemy import create_engine
from dotenv import load_dotenv

load_dotenv()
engine = create_engine(os.getenv('DATABASE_URL').replace('?pgbouncer=true',''))
pd.set_option('display.max_columns', None)
pd.set_option('display.width', 1000)

queries = {
    "1. Transaction types in July 2026": """
        SELECT type, count(*), sum(tl.netamount) 
        FROM raw_ns_transactions t
        JOIN raw_ns_transaction_lines tl ON t.transaction_id = tl.transaction_id
        WHERE DATE_TRUNC('month', t.trandate) = '2026-07-01'
        GROUP BY 1
    """,
    "2. Check if there are other months with data": """
        SELECT DATE_TRUNC('month', trandate) as month, count(*), sum(tl.netamount)
        FROM raw_ns_transactions t
        JOIN raw_ns_transaction_lines tl ON t.transaction_id = tl.transaction_id
        GROUP BY 1
        ORDER BY 1 DESC
    """,
    "3. Check specific Customer 13 from images (CLI000013 La Fabrica de iluminacion SRL) in July": """
        SELECT t.tranid, t.type, t.trandate, SUM(tl.netamount) 
        FROM raw_ns_transactions t
        JOIN raw_ns_transaction_lines tl ON t.transaction_id = tl.transaction_id
        WHERE t.entity_id = '106' -- Wait, CLI000013 internal ID might not be 13.
        -- Let's find the customer ID for CLI000013
        AND DATE_TRUNC('month', t.trandate) = '2026-07-01'
        GROUP BY 1, 2, 3
        LIMIT 10
    """,
    "4. Find Customer CLI000013": """
        SELECT customer_id, companyname, entityid FROM raw_ns_customers WHERE entityid LIKE '%CLI000013%'
    """
}

with open("investigate2.txt", "w", encoding="utf-8") as f:
    for title, q in queries.items():
        f.write(f"--- {title} ---\n")
        try:
            df = pd.read_sql(q, engine)
            f.write(df.to_string(index=False))
        except Exception as e:
            f.write(str(e))
        f.write("\n\n")
