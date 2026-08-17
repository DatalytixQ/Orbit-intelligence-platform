import os
from dotenv import load_dotenv
from orbitlink.engine import OrbitLinkEngine
from orbitlink.netsuite import NetSuiteConnector
load_dotenv()
ns_connector = NetSuiteConnector()
db_url = os.getenv("DATABASE_URL").replace("?pgbouncer=true", "").replace("&pgbouncer=true", "")
from sqlalchemy import create_engine
db_conn = create_engine(db_url)
engine = OrbitLinkEngine(db_connection=db_conn)

# No truncamos las tablas para permitir la carga incremental vía UPSERT
print("Ejecutando carga incremental de Transacciones y Líneas...")

mappings = [
    "netsuite_to_raw_ns_transactions.json",
    "netsuite_to_raw_ns_transaction_lines.json"
]

for map_file in mappings:
    mapping_path = os.path.join(os.path.dirname(__file__), "..", "config", "etl", map_file)
    print(f"Running {map_file}...")
    entity_name = map_file.replace("netsuite_to_raw_ns_", "").replace(".json", "")
    engine.run_pipeline(mapping_path, ns_connector, module_name="Sales & Transactions", entity_name=entity_name)
