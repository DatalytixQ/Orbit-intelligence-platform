import os
import psycopg2
from dotenv import load_dotenv
from orbitlink.netsuite import NetSuiteConnector

load_dotenv()
try:
    print("Iniciando actualización rápida de salesrep_id...")
    ns = NetSuiteConnector()
    conn = psycopg2.connect(os.environ['DATABASE_URL'].split('?')[0])
    cur = conn.cursor()
    
    # Extraer todos los employee (salesrep) de transactions validas
    query = "SELECT id, employee FROM transaction WHERE type IN ('CustInvc', 'CashSale', 'SalesOrd', 'Estimate', 'CreditMemo', 'ReturnAuth', 'CashRfnd', 'CustCred')"
    results = ns.execute_suiteql(query)
    
    print(f"Extraídos {len(results)} transacciones de NetSuite.")
    updates = 0
    for r in results:
        t_id = r.get("id")
        emp = r.get("employee")
        if emp:
            cur.execute("UPDATE raw_ns_transactions SET salesrep_id = %s WHERE transaction_id = %s", (emp, str(t_id)))
            updates += 1
            
    conn.commit()
    print(f"Actualizadas {updates} transacciones con salesrep_id.")
    
except Exception as e:
    print("Error:", e)
