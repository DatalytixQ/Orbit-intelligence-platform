"""
Test dirigido: Exchange Rates y Sales Reps en NetSuite SuiteQL
Objetivo: encontrar qué queries funcionan para poblar raw_ns_exchange_rates y raw_ns_sales_reps
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
        print(f"  [FAIL] {str(e)[:250]}")

print("=" * 60)
print("EXCHANGE RATES")
print("=" * 60)

# 1. CurrencyRate - standard SuiteQL entity
test_query("currencyrate - standard",
    "SELECT cr.basecurrency, cr.currency, cr.exchangerate, cr.effectivedate FROM currencyrate cr OFFSET 0 ROWS FETCH NEXT 5 ROWS ONLY")

# 2. CurrencyRate alternative field names
test_query("currencyrate - list all fields",
    "SELECT cr.id, cr.basecurrency, cr.currency, cr.exchangerate, cr.effectivedate, cr.type FROM currencyrate cr OFFSET 0 ROWS FETCH NEXT 5 ROWS ONLY")

# 3. Via currency with rate embedded
test_query("currency con exchangerate",
    "SELECT c.id, c.name, c.symbol, c.exchangerate, c.currencyPrecision FROM currency c OFFSET 0 ROWS FETCH NEXT 10 ROWS ONLY")

# 4. ExchangeRate (different casing)
test_query("ExchangeRate entity",
    "SELECT er.id, er.basecurrency, er.currency, er.exchangerate FROM ExchangeRate er OFFSET 0 ROWS FETCH NEXT 5 ROWS ONLY")

# 5. ConsolidatedExchangeRate
test_query("ConsolidatedExchangeRate",
    "SELECT cer.id, cer.fromcurrency, cer.tocurrency, cer.currentrate, cer.averagerate, cer.historicalrate, cer.period FROM ConsolidatedExchangeRate cer OFFSET 0 ROWS FETCH NEXT 5 ROWS ONLY")

print("\n" + "=" * 60)
print("SALES REPS")
print("=" * 60)

# 6. SalesRep as direct record
test_query("salesrep entity",
    "SELECT s.id, s.entityid, s.firstname, s.lastname FROM salesrep s OFFSET 0 ROWS FETCH NEXT 5 ROWS ONLY")

# 7. Resource entity
test_query("resource entity",
    "SELECT r.id, r.entityid, r.firstname, r.lastname FROM resource r OFFSET 0 ROWS FETCH NEXT 5 ROWS ONLY")

# 8. Sales rep ID from transactions (we know transactions have salesrep field)
test_query("salesrep field on transaction",
    "SELECT DISTINCT t.salesrep, t.entity FROM transaction t WHERE t.salesrep IS NOT NULL OFFSET 0 ROWS FETCH NEXT 5 ROWS ONLY")

# 9. Employee via department/role filter
test_query("employee via entity table",
    "SELECT e.id, e.type, e.entityid FROM entity e WHERE e.type IN ('Employee') OFFSET 0 ROWS FETCH NEXT 5 ROWS ONLY")

# 10. Get sales rep IDs from raw_ns_customers and try to cross with available data
test_query("contact - all fields available",
    "SELECT c.id, c.entityid, c.firstname, c.lastname, c.email, c.company FROM contact c OFFSET 0 ROWS FETCH NEXT 5 ROWS ONLY")

# 11. Check if salesrep field on customer gives an internal ID we can use
test_query("customer.salesrep - obtener IDs unicos",
    "SELECT DISTINCT c.salesrep FROM customer c WHERE c.salesrep IS NOT NULL OFFSET 0 ROWS FETCH NEXT 15 ROWS ONLY")

# 12. Try to get employee via REST record API (diferente a SuiteQL)
# Intentar employee con entity join
test_query("entity where type employee OR salesrep",
    "SELECT e.id, e.entityid, e.type FROM entity e WHERE e.type LIKE '%emp%' OR e.type LIKE '%rep%' OFFSET 0 ROWS FETCH NEXT 10 ROWS ONLY")
