"""
Test rápido de campos disponibles en item y subsidiary
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
            print(f"  Row0: {dict(list(data[0].items()))}")
    except Exception as e:
        print(f"  [FAIL] {str(e)[:200]}")

# Test minimal item fields
test_query("item - campos minimos", 
    "SELECT i.id, i.itemid, i.itemtype, i.isinactive, i.lastmodifieddate FROM item i OFFSET 0 ROWS FETCH NEXT 3 ROWS ONLY")

test_query("item - con displayname",
    "SELECT i.id, i.itemid, i.displayname, i.itemtype, i.isinactive, i.lastmodifieddate FROM item i OFFSET 0 ROWS FETCH NEXT 3 ROWS ONLY")

test_query("item - con description",
    "SELECT i.id, i.itemid, i.description, i.itemtype, i.isinactive, i.lastmodifieddate FROM item i OFFSET 0 ROWS FETCH NEXT 3 ROWS ONLY")

test_query("item - con subsidiary",
    "SELECT i.id, i.itemid, i.subsidiary, i.itemtype, i.isinactive, i.lastmodifieddate FROM item i OFFSET 0 ROWS FETCH NEXT 3 ROWS ONLY")

test_query("subsidiary - campos minimos",
    "SELECT s.id, s.name, s.country, s.lastmodifieddate FROM subsidiary s OFFSET 0 ROWS FETCH NEXT 5 ROWS ONLY")

test_query("subsidiary - con currency e isinactive",
    "SELECT s.id, s.name, s.country, s.currency, s.isinactive, s.lastmodifieddate FROM subsidiary s OFFSET 0 ROWS FETCH NEXT 5 ROWS ONLY")

test_query("journal - campos completos",
    "SELECT t.id, t.tranid, t.trandate, t.subsidiary, t.memo, t.currency, t.exchangerate, t.lastmodifieddate FROM transaction t WHERE t.type = 'Journal' OFFSET 0 ROWS FETCH NEXT 3 ROWS ONLY")

test_query("VendBill - campos completos",
    "SELECT t.id, t.tranid, t.trandate, t.entity, t.subsidiary, t.currency, t.exchangerate, t.status, t.duedate, t.lastmodifieddate FROM transaction t WHERE t.type = 'VendBill' OFFSET 0 ROWS FETCH NEXT 3 ROWS ONLY")
