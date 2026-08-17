"""Run only exchange rates ETL"""
import os, sys
from dotenv import load_dotenv
load_dotenv()
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from orbitlink.engine import OrbitLinkEngine
from orbitlink.netsuite import NetSuiteConnector
from sqlalchemy import create_engine

ns_connector = NetSuiteConnector()
db_url = os.getenv("DATABASE_URL").replace("?pgbouncer=true", "").replace("&pgbouncer=true", "")
db_conn = create_engine(db_url)
engine = OrbitLinkEngine(db_connection=db_conn)

mapping_path = os.path.join(os.path.dirname(__file__), "..", "config", "etl", "netsuite_to_raw_ns_exchange_rates.json")
df = engine.run_pipeline(mapping_path, ns_connector)
if df is not None:
    print(f"Exchange rates cargados: {len(df)} registros")
    print(df[['currency_symbol', 'exchangerate']].to_string())
