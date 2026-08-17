"""
Script para cargar Sales Reps desde NetSuite REST Record API.
Requiere permiso: Rol NS → Listas → Registro de empleado (Ver)

Uso: 
  1. Agregar permiso en NetSuite (ver instrucciones abajo)
  2. Ejecutar: venv\Scripts\python seed_sales_reps.py

Instrucciones NetSuite:
  Setup → Users/Roles → Manage Roles → [Rol del token]
  → Permisos → Listas → buscar "Registro de empleado" → agregar con nivel "Ver"
"""
import os, sys, requests
from datetime import datetime
from dotenv import load_dotenv
from requests_oauthlib import OAuth1
from oauthlib.oauth1 import SIGNATURE_HMAC_SHA256
load_dotenv()
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from orbitlink.netsuite import NetSuiteConnector

# DB connection
from sqlalchemy import create_engine, text
db_url = os.getenv("DATABASE_URL").replace("?pgbouncer=true", "").replace("&pgbouncer=true", "")
db = create_engine(db_url)

# NS connector
ns = NetSuiteConnector()
account_id = os.getenv("NS_ACCOUNT_ID")
url_account_id = account_id.lower().replace("-", "_")
auth = OAuth1(
    client_key=os.getenv("NS_CONSUMER_KEY"),
    client_secret=os.getenv("NS_CONSUMER_SECRET"),
    resource_owner_key=os.getenv("NS_TOKEN_ID"),
    resource_owner_secret=os.getenv("NS_TOKEN_SECRET"),
    realm=account_id.replace("_", "-").upper(),
    signature_method=SIGNATURE_HMAC_SHA256
)
headers = {"Content-Type": "application/json", "Accept": "application/json"}

def fetch_employee(emp_id: str) -> dict | None:
    """Fetch employee record via REST API (requires Listas → Registro de empleado permission)"""
    url = f"https://{url_account_id}.suitetalk.api.netsuite.com/services/rest/record/v1/employee/{emp_id}"
    resp = requests.get(url, headers=headers, auth=auth, timeout=15)
    if resp.status_code == 200:
        return resp.json()
    elif resp.status_code == 403:
        print(f"  [403 PERMISSION] Agregar 'Listas → Registro de empleado' al rol en NetSuite")
        return None
    else:
        print(f"  [{resp.status_code}] ID {emp_id}: {resp.text[:100]}")
        return None

def run():
    print("=== Seed: Sales Reps desde NetSuite REST API ===")
    
    # 1. Get all unique salesrep IDs from customer table
    print("\n[1] Obteniendo IDs de representantes de clientes...")
    rep_data = ns.execute_suiteql(
        "SELECT DISTINCT c.salesrep FROM customer c WHERE c.salesrep IS NOT NULL AND c.salesrep != '-5' OFFSET 0 ROWS FETCH NEXT 100 ROWS ONLY"
    )
    rep_ids = [str(r['salesrep']) for r in rep_data]
    print(f"  {len(rep_ids)} IDs encontrados: {rep_ids}")
    
    # 2. Fetch each employee via REST
    print("\n[2] Resolviendo nombres via REST API...")
    resolved = []
    permission_error = False
    
    for rep_id in rep_ids:
        emp = fetch_employee(rep_id)
        if emp:
            resolved.append({
                'salesrep_id': rep_id,
                'entityid': emp.get('entityid', ''),
                'firstname': emp.get('firstname', ''),
                'lastname': emp.get('lastname', ''),
                'email': emp.get('email', ''),
                'source_system': 'netsuite',
                'client_id': 'vonderk',
                'snapshot_ts': datetime.now()
            })
            print(f"  [OK] {rep_id}: {emp.get('firstname','')} {emp.get('lastname','')} ({emp.get('entityid','')})")
        elif '403' in str(fetch_employee.__doc__):
            permission_error = True
            break
    
    if permission_error:
        print("\n[ERROR] Falta el permiso. Agregar en NS:")
        print("  Setup → Users/Roles → Manage Roles → [Rol]")
        print("  Permisos → Listas → 'Registro de empleado' → Ver")
        return
    
    if not resolved:
        print("[WARNING] No se resolvio ningun representante. Verificar permisos NS.")
        return
    
    # 3. Load into raw_ns_sales_reps
    print(f"\n[3] Cargando {len(resolved)} representantes en raw_ns_sales_reps...")
    import pandas as pd
    df = pd.DataFrame(resolved)
    
    with db.begin() as conn:
        ids = tuple(df['salesrep_id'].tolist())
        if len(ids) == 1:
            conn.execute(text(f"DELETE FROM raw_ns_sales_reps WHERE salesrep_id = :id"), {"id": ids[0]})
        elif len(ids) > 1:
            id_list = "('" + "','".join(ids) + "')"
            conn.execute(text(f"DELETE FROM raw_ns_sales_reps WHERE salesrep_id IN {id_list}"))
    
    df.to_sql('raw_ns_sales_reps', db, if_exists='append', index=False)
    print(f"  [OK] {len(df)} representantes cargados exitosamente.")
    
    # Show result
    print("\n=== Representantes de Venta Cargados ===")
    for _, row in df.iterrows():
        name = f"{row.get('firstname','')} {row.get('lastname','')}".strip() or row.get('entityid','')
        print(f"  ID {row['salesrep_id']}: {name} ({row.get('email','')})")

if __name__ == "__main__":
    run()
