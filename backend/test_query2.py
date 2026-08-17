import os
from dotenv import load_dotenv
from orbitlink.netsuite import NetSuiteConnector

load_dotenv()

def test_query(query):
    ns = NetSuiteConnector()
    print(f"Testing query: {query}")
    try:
        df = ns.execute_suiteql(query)
        print("SUCCESS")
    except Exception as e:
        print(f"FAILED: {e}")

if __name__ == '__main__':
    # Test 1: Just the fields without the date filter
    test_query("SELECT TOP 1 t.id, t.tranid, t.trandate, t.entity, t.status, tl.item, tl.quantity, tl.rate, tl.foreignamount, tl.netamount FROM transaction t JOIN transactionline tl ON t.id = tl.transaction WHERE t.type IN ('CustInvc', 'CashSale', 'SalesOrd') AND tl.mainline = 'F'")
    
    # Test 2: The date filter with TO_DATE
    test_query("SELECT TOP 1 id FROM transaction WHERE trandate >= TO_DATE('2026-01-01', 'YYYY-MM-DD')")

    # Test 3: Date filter with BUILTIN
    test_query("SELECT TOP 1 id FROM transaction WHERE trandate >= BUILTIN.TO_DATE('2026-01-01', 'YYYY-MM-DD')")

    # Test 4: Is there a field that doesn't exist? (Maybe tl.foreignamount -> foreignamount is line or main? NetSuite schema has foreignamount on transactionline)
    test_query("SELECT TOP 1 tl.foreignamount, tl.netamount FROM transactionline tl")
