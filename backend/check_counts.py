import os
from sqlalchemy import create_engine
from dotenv import load_dotenv

load_dotenv()
engine = create_engine(os.getenv('DATABASE_URL').replace('?pgbouncer=true',''))
with engine.begin() as conn:
    result = conn.execute("SELECT COUNT(*) FROM raw_ns_transactions").scalar()
    print("Transactions count:", result)
    result = conn.execute("SELECT COUNT(*) FROM raw_ns_transaction_lines").scalar()
    print("Lines count:", result)
