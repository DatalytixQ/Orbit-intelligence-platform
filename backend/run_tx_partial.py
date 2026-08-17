import os
import json
import traceback
from datetime import datetime
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from orbitlink.netsuite import NetSuiteConnector
from orbitlink.engine import OrbitLinkEngine
import pandas as pd

load_dotenv()

def run_partial_sync():
    db_url = os.getenv("DATABASE_URL").replace("?pgbouncer=true", "")
    if db_url.startswith("postgres://"):
        db_url = db_url.replace("postgres://", "postgresql://")
        
    engine = create_engine(db_url)
    ns_connector = NetSuiteConnector()
    ol_engine = OrbitLinkEngine(db_connection=engine)

    configs = [
        "netsuite_to_raw_ns_transactions.json",
        "netsuite_to_raw_ns_transaction_lines.json"
    ]

    print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] Iniciando Extracción Parcial (Desde 2024-07-01)...")

    # Limpiar tablas para la muestra limpia
    with engine.begin() as conn:
        print("Insertando mock date...")
        conn.execute(text("TRUNCATE TABLE public.raw_ns_transactions CASCADE;"))
        conn.execute(text("TRUNCATE TABLE public.raw_ns_transaction_lines CASCADE;"))
        # Insert a dummy record with max date = '2024-07-01 00:00:00' so OrbitLinkEngine uses it
        conn.execute(text("INSERT INTO public.raw_ns_transactions (transaction_id, last_modified_ts) VALUES ('dummy1', '2024-07-01 00:00:00')"))
        conn.execute(text("INSERT INTO public.raw_ns_transaction_lines (transaction_id, line_id, last_modified_ts) VALUES ('dummy1', '1', '2024-07-01 00:00:00')"))

    for config_file in configs:
        config_path = os.path.join(os.path.dirname(__file__), "..", "config", "etl", config_file)
        print(f"\n--- Procesando {config_file} ---")
        try:
            ol_engine.run_pipeline(config_path, ns_connector)
        except Exception as e:
            print(f"Error procesando {config_file}: {e}")
            traceback.print_exc()
            
    with engine.begin() as conn:
        print("Eliminando mock date...")
        conn.execute(text("DELETE FROM public.raw_ns_transactions WHERE transaction_id = 'dummy1'"))
        conn.execute(text("DELETE FROM public.raw_ns_transaction_lines WHERE transaction_id = 'dummy1'"))

if __name__ == "__main__":
    run_partial_sync()
