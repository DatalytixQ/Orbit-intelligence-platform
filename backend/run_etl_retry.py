"""
Run only the 2 failed mappings: ap_open_items and journal_entries
"""
import os
import sys
from dotenv import load_dotenv
load_dotenv()

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from orbitlink.engine import OrbitLinkEngine
from orbitlink.netsuite import NetSuiteConnector
from sqlalchemy import create_engine

print("--- Retry: AP Open Items + Journal Entries ---")
ns_connector = NetSuiteConnector()

db_url = os.getenv("DATABASE_URL").replace("?pgbouncer=true", "").replace("&pgbouncer=true", "")
db_conn = create_engine(db_url)
engine = OrbitLinkEngine(db_connection=db_conn)

mappings = [
    "netsuite_to_raw_ns_ap_open_items.json",
    "netsuite_to_raw_ns_journal_entries.json",
]

errors = []
for map_file in mappings:
    mapping_path = os.path.join(os.path.dirname(__file__), "..", "config", "etl", map_file)
    print(f"\n======================================")
    print(f"Usando mapping: {map_file}")
    try:
        df = engine.run_pipeline(mapping_path, ns_connector)
        if df is not None and not df.empty:
            print(f"Total registros cargados: {len(df)}")
        else:
            print(f"No hay datos nuevos (0 deltas).")
    except Exception as e:
        err_msg = str(e)[:300]
        print(f"[ERROR] {err_msg}")
        errors.append(err_msg)

print(f"\n{'='*50}")
if errors:
    print(f"ERRORES ({len(errors)}):")
    for e in errors:
        print(f"  - {e}")
else:
    print("COMPLETADO SIN ERRORES")
