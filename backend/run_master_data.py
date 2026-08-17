import os
from orbitlink.netsuite import NetSuiteConnector
from sqlalchemy import create_engine
from orbitlink.engine import OrbitLinkEngine
from dotenv import load_dotenv

def run():
    load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))
    db_url = os.getenv('DATABASE_URL').replace('?pgbouncer=true','')
    db_conn = create_engine(db_url)
    
    ns_connector = NetSuiteConnector()
    orbit_engine = OrbitLinkEngine(db_connection=db_conn)
    
    print("--- INICIANDO ETL: MASTER DATA ---")
    
    # 1. Customers
    mapping_path = os.path.join(os.path.dirname(__file__), "..", "config", "etl", "netsuite_to_raw_ns_customers.json")
    print("\nSincronizando Customers...")
    orbit_engine.run_pipeline(mapping_path, ns_connector, module_name="Master Data", entity_name="customers")
    
    # 2. Contacts
    mapping_path = os.path.join(os.path.dirname(__file__), "..", "config", "etl", "netsuite_to_raw_ns_contacts.json")
    print("\nSincronizando Contacts...")
    orbit_engine.run_pipeline(mapping_path, ns_connector, module_name="Master Data", entity_name="contacts")
    
    # 3. Employees
    mapping_path = os.path.join(os.path.dirname(__file__), "..", "config", "etl", "netsuite_to_raw_ns_employees.json")
    print("\nSincronizando Employees...")
    orbit_engine.run_pipeline(mapping_path, ns_connector, module_name="Master Data", entity_name="employees")
    
    print("\n--- ETL MASTER DATA FINALIZADO ---")

if __name__ == "__main__":
    run()
