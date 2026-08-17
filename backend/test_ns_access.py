"""
Test de extracción GL Impact desde NetSuite
Verifica si la entidad AccountingLine está disponible con las credenciales actuales
"""
import os
import sys
from dotenv import load_dotenv
load_dotenv()

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from orbitlink.netsuite import NetSuiteConnector

def test_gl_impact():
    print("=== TEST: GL Impact (AccountingLine) ===")
    ns = NetSuiteConnector()
    
    # Test 1: Basic query with limit 5 to check access
    test_queries = [
        {
            "name": "AccountingLine (GL Impact - directo)",
            "query": "SELECT al.id, al.account, al.amount, al.credit, al.debit, al.posting, al.transaction FROM AccountingLine al OFFSET 0 ROWS FETCH NEXT 5 ROWS ONLY"
        },
        {
            "name": "TransactionLine con campos GL (alternativa 1)",
            "query": "SELECT tl.id, tl.transaction, tl.account, tl.debit, tl.credit, tl.memo, tl.accountinglinetype FROM TransactionLine tl WHERE tl.mainline = 'F' OFFSET 0 ROWS FETCH NEXT 5 ROWS ONLY"
        },
        {
            "name": "Employee - query directa",
            "query": "SELECT e.id, e.entityid, e.firstname, e.lastname, e.issalesrep FROM employee e WHERE e.issalesrep = 'T' OFFSET 0 ROWS FETCH NEXT 10 ROWS ONLY"
        },
        {
            "name": "Contact como alternativa a Employee",
            "query": "SELECT c.id, c.entityid, c.firstname, c.lastname, c.email FROM contact c OFFSET 0 ROWS FETCH NEXT 5 ROWS ONLY"
        },
        {
            "name": "SalesRep via Customer record",
            "query": "SELECT c.id, c.entityid, c.companyname, c.salesrep FROM customer c WHERE c.salesrep IS NOT NULL OFFSET 0 ROWS FETCH NEXT 5 ROWS ONLY"
        },
        {
            "name": "Subsidiaries",
            "query": "SELECT s.id, s.name, s.country FROM subsidiary s OFFSET 0 ROWS FETCH NEXT 10 ROWS ONLY"
        },
        {
            "name": "Locations",
            "query": "SELECT l.id, l.name, l.subsidiary FROM location l OFFSET 0 ROWS FETCH NEXT 10 ROWS ONLY"
        },
        {
            "name": "Accounts",
            "query": "SELECT a.id, a.acctnumber, a.acctname, a.accttype FROM account a OFFSET 0 ROWS FETCH NEXT 10 ROWS ONLY"
        },
        {
            "name": "Currencies",
            "query": "SELECT c.id, c.name, c.symbol FROM currency c OFFSET 0 ROWS FETCH NEXT 10 ROWS ONLY"
        },
        {
            "name": "Items Master",
            "query": "SELECT i.id, i.itemid, i.displayname, i.itemtype, i.isinactive FROM item i OFFSET 0 ROWS FETCH NEXT 5 ROWS ONLY"
        },
        {
            "name": "Vendor Bills (AP)",
            "query": "SELECT t.id, t.tranid, t.trandate, t.entity, t.type FROM transaction t WHERE t.type = 'VendBill' OFFSET 0 ROWS FETCH NEXT 5 ROWS ONLY"
        },
        {
            "name": "Customer Payments",
            "query": "SELECT t.id, t.tranid, t.trandate, t.entity, t.type FROM transaction t WHERE t.type = 'CustPymt' OFFSET 0 ROWS FETCH NEXT 5 ROWS ONLY"
        },
        {
            "name": "Item Receipts (Inbound)",
            "query": "SELECT t.id, t.tranid, t.trandate, t.entity, t.type FROM transaction t WHERE t.type = 'ItemRcpt' OFFSET 0 ROWS FETCH NEXT 5 ROWS ONLY"
        }
    ]
    
    results = {}
    for test in test_queries:
        print(f"\n--- Testing: {test['name']} ---")
        try:
            data = ns.execute_suiteql(test['query'])
            results[test['name']] = {'status': 'SUCCESS', 'rows': len(data), 'sample': data[:2] if data else []}
            print(f"  [OK] SUCCESS: {len(data)} rows returned")
            if data:
                print(f"  Sample keys: {list(data[0].keys())}")
        except Exception as e:
            error_msg = str(e)
            results[test['name']] = {'status': 'FAILED', 'error': error_msg[:200]}
            print(f"  [FAIL] {error_msg[:200]}")
            continue
    
    print("\n=== SUMMARY ===")
    for name, result in results.items():
        status = '[OK]' if result['status'] == 'SUCCESS' else '[FAIL]'
        info = f"{result['rows']} rows" if result['status'] == 'SUCCESS' else result['error'][:80]
        print(f"  {status} {name}: {info}")
    
    return results

if __name__ == "__main__":
    test_gl_impact()
