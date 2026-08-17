import os
import pandas as pd
from sqlalchemy import create_engine
from dotenv import load_dotenv
load_dotenv()
engine = create_engine(os.getenv('DATABASE_URL').replace('?pgbouncer=true',''))
queries = {
    "Ventas y Margen (Top 5)": "SELECT sale_year, sale_month, SUM(net_amount_base) as ventas, SUM(cogs_base) as cogs, SUM(gross_margin_local) as margen FROM dm_fact_sales GROUP BY 1, 2 ORDER BY 1 DESC, 2 DESC LIMIT 5",
    "Top Vendedores": "SELECT rep_full_name, SUM(net_amount_base) as ventas FROM dm_fact_sales JOIN dm_dim_sales_reps USING (salesrep_id) GROUP BY 1 ORDER BY 2 DESC NULLS LAST LIMIT 5",
    "Pipeline (Pending)": "SELECT status, COUNT(*), SUM(amount_base) FROM dm_fact_pipeline GROUP BY 1 ORDER BY 2 DESC",
    "RFM (Top 5 Clientes)": "SELECT customer_id, recency_days, frequency, monetary_total_base FROM dm_fact_rfm ORDER BY monetary_total_base DESC NULLS LAST LIMIT 5"
}

for title, sql in queries.items():
    print(f"--- {title} ---")
    try:
        df = pd.read_sql(sql, engine)
        print(df.to_string())
    except Exception as e:
        print(f"Error: {e}")
    print("\n")
