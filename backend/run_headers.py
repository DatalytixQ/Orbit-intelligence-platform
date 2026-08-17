import os
from dotenv import load_dotenv
from orbitlink.engine import OrbitLinkEngine
from orbitlink.netsuite import NetSuiteConnector
from sqlalchemy import create_engine

load_dotenv()
try:
    print("Iniciando ETL de Cabeceras de Transacciones...")
    ns_connector = NetSuiteConnector()
    db_url = os.getenv("DATABASE_URL").replace("?pgbouncer=true", "")
    db_conn = create_engine(db_url)
    engine = OrbitLinkEngine(db_connection=db_conn)
    
    mapping_path = os.path.join(os.path.dirname(__file__), "..", "config", "etl", "netsuite_to_raw_ns_transactions.json")
    engine.run_pipeline(mapping_path, ns_connector)
    print("Carga finalizada.")
except Exception as e:
    print("Error:", e)
