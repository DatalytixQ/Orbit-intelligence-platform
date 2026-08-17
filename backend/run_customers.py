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
mapping_path = os.path.join(os.path.dirname(__file__), "..", "config", "etl", "netsuite_to_raw_ns_customers.json")
engine.run_pipeline(mapping_path, ns_connector, module_name="Master Data", entity_name="customers")
