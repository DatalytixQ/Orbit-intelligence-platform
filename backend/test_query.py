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
    test_query("SELECT TOP 1 id FROM transaction")
    test_query("SELECT TOP 1 id FROM transactionline")
    test_query("SELECT TOP 1 id, tranid FROM transaction WHERE type IN ('CustInvc', 'CashSale', 'SalesOrd')")
    test_query("SELECT TOP 1 t.id, tl.item FROM transaction t JOIN transactionline tl ON t.id = tl.transaction")
    test_query("SELECT t.id, t.tranid, t.trandate, t.entity, t.status, tl.item, tl.quantity, tl.rate, tl.foreignamount, tl.netamount FROM transaction t JOIN transactionline tl ON t.id = tl.transaction WHERE t.type IN ('CustInvc', 'CashSale', 'SalesOrd') AND tl.mainline = 'F' AND t.trandate >= BUILTIN.TO_DATE('2026-01-01', 'YYYY-MM-DD')")
