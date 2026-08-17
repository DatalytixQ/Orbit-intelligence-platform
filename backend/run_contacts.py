import os
from sqlalchemy import create_engine
from dotenv import load_dotenv
from orbitlink.engine import OrbitLinkEngine
from orbitlink.netsuite import NetSuiteConnector

load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))
engine = create_engine(os.getenv('DATABASE_URL').replace('?pgbouncer=true',''))
ns_connector = NetSuiteConnector()
orbit_engine = OrbitLinkEngine(db_connection=engine)

mapping_path = os.path.join(os.path.dirname(__file__), "..", "config", "etl", "netsuite_to_raw_ns_contacts.json")
print("Sincronizando Contactos...")
df = orbit_engine.run_pipeline(mapping_path, ns_connector, module_name="Master Data", entity_name="contacts")
if df is not None:
    print(f" -> {len(df)} contactos cargados.")
else:
    print(" -> Sin datos de contactos.")
