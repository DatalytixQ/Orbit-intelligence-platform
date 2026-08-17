"""
Test final para GL Impact y Sales Reps - variantes adicionales
"""
import os, sys
from dotenv import load_dotenv
load_dotenv()
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from orbitlink.netsuite import NetSuiteConnector

def test():
    ns = NetSuiteConnector()
    tests = [
        # GL alternatives
        ("TransactionLine simple (sin accountinglinetype)",
         "SELECT tl.id, tl.transaction, tl.account, tl.debit, tl.credit, tl.memo FROM TransactionLine tl WHERE tl.mainline = 'F' OFFSET 0 ROWS FETCH NEXT 5 ROWS ONLY"),
        ("transactionLine lowercase",
         "SELECT tl.id, tl.transaction, tl.account, tl.debit, tl.credit FROM transactionline tl OFFSET 0 ROWS FETCH NEXT 5 ROWS ONLY"),
        # Sales reps via entity
        ("Entity record (employees as entity)",
         "SELECT e.id, e.entityid, e.type FROM entity e WHERE e.type = 'Employee' OFFSET 0 ROWS FETCH NEXT 5 ROWS ONLY"),
        # Get sales rep name via contact join 
        ("SalesRep IDs with names via contact",
         "SELECT DISTINCT c.salesrep, co.firstname, co.lastname, co.entityid FROM customer c JOIN contact co ON c.salesrep = co.id WHERE c.salesrep IS NOT NULL OFFSET 0 ROWS FETCH NEXT 10 ROWS ONLY"),
        # Verify transaction types available
        ("All transaction types in DB",
         "SELECT DISTINCT t.type, count(*) as qty FROM transaction t GROUP BY t.type ORDER BY qty DESC OFFSET 0 ROWS FETCH NEXT 20 ROWS ONLY"),
        # Purchase orders
        ("Purchase Orders",
         "SELECT t.id, t.tranid, t.trandate, t.entity, t.type FROM transaction t WHERE t.type = 'PurchOrd' OFFSET 0 ROWS FETCH NEXT 5 ROWS ONLY"),
        # Journal entries (for GL)
        ("Journal Entries with lines",
         "SELECT t.id, t.tranid, t.trandate, t.type, t.subsidiary FROM transaction t WHERE t.type = 'Journal' OFFSET 0 ROWS FETCH NEXT 5 ROWS ONLY"),
    ]
    
    for name, query in tests:
        print(f"\n--- {name} ---")
        try:
            data = ns.execute_suiteql(query)
            print(f"  [OK] {len(data)} rows | keys: {list(data[0].keys()) if data else 'empty'}")
            if data and len(data) > 0:
                print(f"  Sample: {dict(list(data[0].items())[:4])}")
        except Exception as e:
            print(f"  [FAIL] {str(e)[:150]}")

if __name__ == "__main__":
    test()
