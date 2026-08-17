import os
import pandas as pd
from sqlalchemy import create_engine
from dotenv import load_dotenv

load_dotenv()
engine = create_engine(os.getenv('DATABASE_URL').replace('?pgbouncer=true',''))

# Opciones de visualización para ver bien los datos
pd.set_option('display.max_columns', None)
pd.set_option('display.width', 1000)

queries = {
    "1. Top 10 Facturas Recientes (con COGS y Margen)": """
        SELECT 
            invoice_number, 
            sale_date, 
            customer_id, 
            rep_full_name, 
            class_name as categoria,
            SUM(quantity) as qty,
            SUM(net_amount_local) as net_amount, 
            SUM(cogs_local) as cogs, 
            SUM(gross_margin_local) as gross_margin
        FROM dm_fact_sales s
        LEFT JOIN dm_dim_sales_reps r ON s.salesrep_id = r.salesrep_id
        LEFT JOIN dm_dim_classifications c ON s.class_id = c.class_id
        WHERE transaction_type = 'CustInvc'
        GROUP BY 1,2,3,4,5
        ORDER BY sale_date DESC
        LIMIT 10
    """,
    "2. Estados actuales en Pipeline (SalesOrd)": """
        SELECT status, COUNT(*) as cantidad, SUM(amount_local) as monto_total
        FROM dm_fact_pipeline
        GROUP BY status
        ORDER BY monto_total DESC
    """,
    "3. Ventas por Categoría (Julio 2026)": """
        SELECT 
            COALESCE(c.class_name, 'Sin Categoría') as categoria,
            SUM(net_amount_local) as ventas
        FROM dm_fact_sales s
        LEFT JOIN dm_dim_classifications c ON s.class_id = c.class_id
        WHERE sale_month = '2026-07-01'
        GROUP BY 1
        ORDER BY 2 DESC
        LIMIT 10
    """
}

with open("validation_results.txt", "w", encoding="utf-8") as f:
    for title, query in queries.items():
        f.write(f"\n{'='*50}\n{title}\n{'='*50}\n")
        try:
            df = pd.read_sql(query, engine)
            # Para evitar montos negativos raros en ventas, mostrar absoluto si el usuario prefiere, pero dejaremos el raw
            f.write(df.to_string(index=False))
        except Exception as e:
            f.write(f"Error: {e}")
        f.write("\n")
