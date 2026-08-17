"""
Test campos de cabecera de transacciones: salesrep, department, class, location
Validar antes de actualizar el ETL y el schema
"""
import os, sys
from dotenv import load_dotenv
load_dotenv()
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from orbitlink.netsuite import NetSuiteConnector

ns = NetSuiteConnector()

def test_query(name, query):
    print(f"\n--- {name} ---")
    try:
        data = ns.execute_suiteql(query)
        print(f"  [OK] {len(data)} rows")
        if data:
            print(f"  Keys: {list(data[0].keys())}")
            for row in data[:3]:
                print(f"  Row: {dict(row)}")
    except Exception as e:
        print(f"  [FAIL] {str(e)[:200]}")

# Confirmado: salesrep en invoice cabecera (field visible en NS UI)
test_query("transaction.salesrep en CustInvc",
    "SELECT t.id, t.tranid, t.salesrep FROM transaction t WHERE t.type = 'CustInvc' AND t.salesrep IS NOT NULL OFFSET 0 ROWS FETCH NEXT 5 ROWS ONLY")

test_query("transaction.salesrep en SalesOrd",
    "SELECT t.id, t.tranid, t.salesrep FROM transaction t WHERE t.type = 'SalesOrd' AND t.salesrep IS NOT NULL OFFSET 0 ROWS FETCH NEXT 5 ROWS ONLY")

test_query("transaction.salesrep en Estimate",
    "SELECT t.id, t.tranid, t.salesrep FROM transaction t WHERE t.type = 'Estimate' AND t.salesrep IS NOT NULL OFFSET 0 ROWS FETCH NEXT 5 ROWS ONLY")

# Department en transacciones (visto en factura: Ventas Nacionales)
test_query("transaction.department",
    "SELECT t.id, t.tranid, t.department FROM transaction t WHERE t.type = 'CustInvc' AND t.department IS NOT NULL OFFSET 0 ROWS FETCH NEXT 5 ROWS ONLY")

# Class en transacciones (visto en factura: Productos)
test_query("transaction.class",
    "SELECT t.id, t.tranid, t.class FROM transaction t WHERE t.type = 'CustInvc' AND t.class IS NOT NULL OFFSET 0 ROWS FETCH NEXT 5 ROWS ONLY")

# Opportunity (visto en factura: Created from POV_MEX-9370)
test_query("transaction.opportunity",
    "SELECT t.id, t.tranid, t.opportunity FROM transaction t WHERE t.type = 'CustInvc' AND t.opportunity IS NOT NULL OFFSET 0 ROWS FETCH NEXT 5 ROWS ONLY")

# Employee via issalesrep flag (alternativo a employee record)
test_query("employee con issalesrep - SuiteQL",
    "SELECT e.id, e.entityid, e.firstname, e.lastname, e.email, e.issalesrep FROM employee e WHERE e.issalesrep = 'T' OFFSET 0 ROWS FETCH NEXT 10 ROWS ONLY")

# Department como entidad
test_query("department record",
    "SELECT d.id, d.name, d.parent FROM department d OFFSET 0 ROWS FETCH NEXT 10 ROWS ONLY")

# Class como entidad
test_query("classification record",
    "SELECT c.id, c.name FROM classification c OFFSET 0 ROWS FETCH NEXT 10 ROWS ONLY")

# SalesOrd count (pipeline)
test_query("SalesOrd - count para pipeline",
    "SELECT COUNT(*) as total FROM transaction t WHERE t.type = 'SalesOrd'")

test_query("Estimate - count",
    "SELECT COUNT(*) as total FROM transaction t WHERE t.type = 'Estimate'")

# Campos adicionales en SalesOrd
test_query("SalesOrd campos disponibles",
    "SELECT t.id, t.tranid, t.trandate, t.status, t.entity, t.salesrep, t.department, t.class, t.currency, t.exchangerate, t.lastmodifieddate FROM transaction t WHERE t.type = 'SalesOrd' OFFSET 0 ROWS FETCH NEXT 3 ROWS ONLY")
