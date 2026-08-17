import os
from sqlalchemy import create_engine
from sqlalchemy import text
from dotenv import load_dotenv
from orbitlink.engine import OrbitLinkEngine
from orbitlink.netsuite import NetSuiteConnector

load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

engine = create_engine(os.getenv('DATABASE_URL').replace('?pgbouncer=true',''))
# with engine.begin() as conn:
#     conn.execute(text("UPDATE _etl_sync_logs SET max_timestamp = '2000-01-01' WHERE table_name IN ('raw_ns_items', 'raw_ns_transaction_lines', 'raw_ns_classifications', 'raw_ns_subsidiaries', 'raw_ns_customers')"))
#     print("Reset sync logs para forzar sincronizacion completa.")

print("Iniciando extraccion NetSuite para Fase A...")
ns_connector = NetSuiteConnector()
orbit_engine = OrbitLinkEngine(db_connection=engine)

mappings = [
    "netsuite_to_raw_ns_subsidiaries.json",
    "netsuite_to_raw_ns_classifications.json",
    "netsuite_to_raw_ns_items.json",
    "netsuite_to_raw_ns_customers.json",
    "netsuite_to_raw_ns_transaction_lines.json"
]

for map_file in mappings:
    mapping_path = os.path.join(os.path.dirname(__file__), "..", "config", "etl", map_file)
    print(f"Sincronizando {map_file}...")
    try:
        df = orbit_engine.run_pipeline(mapping_path, ns_connector)
        if df is not None:
            print(f" -> {len(df)} registros cargados.")
        else:
            print(f" -> Sin datos.")
    except Exception as e:
        print(f" -> Error: {e}")
