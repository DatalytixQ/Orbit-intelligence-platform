import os
import sqlite3
from dotenv import load_dotenv
from orbitlink.engine import OrbitLinkEngine
from orbitlink.netsuite import NetSuiteConnector

load_dotenv()

def run():
    print("--- INICIANDO DQORBIT ETL ---")
    # Initialize NetSuite Connector
    ns_connector = NetSuiteConnector()
    
    # Initialize Engine with Supabase connection
    db_url = os.getenv("DATABASE_URL")
    if not db_url:
        print("Error: DATABASE_URL no encontrada en el .env")
        return
    # Remove pgbouncer option for psycopg2 compatibility
    db_url = db_url.replace("?pgbouncer=true", "").replace("&pgbouncer=true", "")
        
    from sqlalchemy import create_engine
    db_conn = create_engine(db_url)
    engine = OrbitLinkEngine(db_connection=db_conn)
    
    mappings = [
        # === MAESTROS (Dimensions) ===
        "netsuite_to_raw_ns_accounts.json",          # Plan de Cuentas
        "netsuite_to_raw_ns_currencies.json",         # Monedas
        "netsuite_to_raw_ns_exchange_rates.json",     # Tasas de Cambio
        "netsuite_to_raw_ns_subsidiaries.json",       # Subsidiarias (NUEVO)
        "netsuite_to_raw_ns_locations.json",          # Ubicaciones (NUEVO)
        "netsuite_to_raw_ns_items.json",              # Maestro de Artículos (NUEVO)
        "netsuite_to_raw_ns_customers.json",          # Clientes
        # === TRANSACCIONES (Facts) ===
        "netsuite_to_raw_ns_transactions.json",       # Cabeceras (Invoices, SO, etc.)
        "netsuite_to_raw_ns_transaction_lines.json",  # Líneas de transacciones
        "netsuite_to_raw_ns_vendors.json",
        "netsuite_to_raw_ns_vendor_payments.json",
        "netsuite_to_raw_ns_journal_entries.json",
        "netsuite_to_raw_ns_accounts.json",
        "netsuite_to_raw_ns_employees.json",
        "netsuite_to_raw_ns_departments.json",
        "netsuite_to_raw_ns_classifications.json"
    ]
    
    errors = []
    for map_file in mappings:
        mapping_path = os.path.join(os.path.dirname(__file__), "..", "config", "etl", map_file)
        print(f"\n======================================")
        print(f"Usando mapping: {mapping_path}")
        try:
            df = engine.run_pipeline(mapping_path, ns_connector)
            if df is not None and not df.empty:
                print(f"\nTotal registros cargados para {map_file}: {len(df)}")
            else:
                print(f"No se cargaron datos para {map_file} (pueden ser 0 deltas).")
        except Exception as e:
            err_msg = f"[ERROR] Fallo en mapping {map_file}: {str(e)[:300]}"
            print(err_msg)
            errors.append(err_msg)
            print("Continuando con el siguiente mapping...")

    print(f"\n{'='*50}")
    print(f"ETL FINALIZADO. Mappings con error: {len(errors)}")
    for err in errors:
        print(f"  - {err}")

if __name__ == "__main__":
    run()
