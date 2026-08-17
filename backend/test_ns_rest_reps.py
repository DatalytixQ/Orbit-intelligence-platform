"""
Intenta resolver Sales Reps via REST Record API (endpoint diferente a SuiteQL)
y Exchange Rates via currency.exchangerate
"""
import os, sys, requests
from dotenv import load_dotenv
from requests_oauthlib import OAuth1
load_dotenv()
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from orbitlink.netsuite import NetSuiteConnector

ns = NetSuiteConnector()

# Known salesrep IDs from customer records (excluding -5 which is "none")
known_rep_ids = ['518', '527', '536', '537', '561', '562', '620', '641', '11014']

# Setup REST auth (same as connector)
account_id = os.getenv("NS_ACCOUNT_ID")
url_account_id = account_id.lower().replace("-", "_")
from oauthlib.oauth1 import SIGNATURE_HMAC_SHA256
auth = OAuth1(
    client_key=os.getenv("NS_CONSUMER_KEY"),
    client_secret=os.getenv("NS_CONSUMER_SECRET"),
    resource_owner_key=os.getenv("NS_TOKEN_ID"),
    resource_owner_secret=os.getenv("NS_TOKEN_SECRET"),
    realm=account_id.replace("_", "-").upper(),
    signature_method=SIGNATURE_HMAC_SHA256
)
headers = {"Content-Type": "application/json", "Accept": "application/json"}

print("=" * 60)
print("SALES REPS - REST Record API")
print("=" * 60)

# Test 1: Try to GET employee by ID via REST Record endpoint
print("\n--- Testing REST Record API for Employee ---")
test_id = '518'
rest_url = f"https://{url_account_id}.suitetalk.api.netsuite.com/services/rest/record/v1/employee/{test_id}"
print(f"URL: {rest_url}")
try:
    response = requests.get(rest_url, headers=headers, auth=auth)
    print(f"  Status: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"  [OK] Employee found!")
        # Print relevant fields
        for field in ['id', 'entityid', 'firstname', 'lastname', 'email', 'title', 'issalesrep']:
            print(f"    {field}: {data.get(field, 'N/A')}")
    else:
        print(f"  [FAIL] {response.text[:300]}")
except Exception as e:
    print(f"  [ERROR] {str(e)[:200]}")

# Test 2: Try GET all employees via REST (collection endpoint)
print("\n--- Testing REST Record API Employee Collection ---")
rest_url_coll = f"https://{url_account_id}.suitetalk.api.netsuite.com/services/rest/record/v1/employee?limit=5&offset=0"
try:
    response = requests.get(rest_url_coll, headers=headers, auth=auth)
    print(f"  Status: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        items = data.get('items', [])
        print(f"  [OK] {len(items)} employees found in collection")
        for item in items[:3]:
            print(f"    ID: {item.get('id')}, Links: {item.get('links', [])}")
    else:
        print(f"  [FAIL] {response.text[:300]}")
except Exception as e:
    print(f"  [ERROR] {str(e)[:200]}")

# Test 3: Get all unique salesrep IDs from NS (full list)
print("\n--- Getting ALL unique salesrep IDs from NS ---")
try:
    data = ns.execute_suiteql(
        "SELECT DISTINCT c.salesrep FROM customer c WHERE c.salesrep IS NOT NULL AND c.salesrep != '-5' OFFSET 0 ROWS FETCH NEXT 50 ROWS ONLY"
    )
    rep_ids = [str(r['salesrep']) for r in data]
    print(f"  [OK] {len(rep_ids)} distinct sales rep IDs: {rep_ids}")
    
    # Now try to fetch each one via REST Record API
    print("\n--- Fetching each rep via REST Record API ---")
    resolved = []
    failed = []
    for rep_id in rep_ids[:5]:  # Test first 5 to validate
        rest_url = f"https://{url_account_id}.suitetalk.api.netsuite.com/services/rest/record/v1/employee/{rep_id}"
        try:
            resp = requests.get(rest_url, headers=headers, auth=auth, timeout=10)
            if resp.status_code == 200:
                emp = resp.json()
                resolved.append({
                    'salesrep_id': rep_id,
                    'entityid': emp.get('entityid'),
                    'firstname': emp.get('firstname'),
                    'lastname': emp.get('lastname'),
                    'email': emp.get('email')
                })
                print(f"  [OK] ID {rep_id}: {emp.get('firstname', '')} {emp.get('lastname', '')} ({emp.get('entityid', '')})")
            else:
                failed.append(rep_id)
                print(f"  [FAIL] ID {rep_id}: {resp.status_code} - {resp.text[:100]}")
        except Exception as ex:
            failed.append(rep_id)
            print(f"  [ERROR] ID {rep_id}: {str(ex)[:100]}")
    
    print(f"\n  Resolved: {len(resolved)}/{len(rep_ids[:5])} | Failed: {len(failed)}/{len(rep_ids[:5])}")
    
except Exception as e:
    print(f"  [ERROR] {str(e)[:300]}")

print("\n" + "=" * 60)
print("EXCHANGE RATES - currency.exchangerate vs transactions")
print("=" * 60)

# Test 4: currency with exchangerate (confirmed working)
print("\n--- Currency with current exchange rate ---")
try:
    data = ns.execute_suiteql(
        "SELECT c.id, c.name, c.symbol, c.exchangerate FROM currency c OFFSET 0 ROWS FETCH NEXT 10 ROWS ONLY"
    )
    print(f"  [OK] {len(data)} currencies with exchange rates:")
    for row in data:
        print(f"    {row.get('symbol')} ({row.get('name')}): rate = {row.get('exchangerate')}")
except Exception as e:
    print(f"  [FAIL] {str(e)[:200]}")

# Test 5: Confirm transaction.exchangerate works for historical rates
print("\n--- Historical rate from transactions (sampling) ---")
try:
    data = ns.execute_suiteql(
        "SELECT t.tranid, t.trandate, t.currency, t.exchangerate FROM transaction t WHERE t.currency != '1' AND t.exchangerate IS NOT NULL OFFSET 0 ROWS FETCH NEXT 5 ROWS ONLY"
    )
    print(f"  [OK] {len(data)} transactions with exchange rates:")
    for row in data:
        print(f"    {row.get('tranid')} ({row.get('trandate')}): {row.get('currency')} @ {row.get('exchangerate')}")
except Exception as e:
    print(f"  [FAIL] {str(e)[:200]}")
