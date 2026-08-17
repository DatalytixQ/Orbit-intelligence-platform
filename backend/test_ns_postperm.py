"""
Re-test post permisos: employee, transaction.salesrep/department/class, department, classification
"""
import os, sys, requests
from dotenv import load_dotenv
from requests_oauthlib import OAuth1
from oauthlib.oauth1 import SIGNATURE_HMAC_SHA256
load_dotenv()
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from orbitlink.netsuite import NetSuiteConnector

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

def test_q(name, query):
    print(f"\n--- {name} ---")
    try:
        data = ns.execute_suiteql(query)
        print(f"  [OK] {len(data)} rows")
        if data:
            print(f"  Keys: {list(data[0].keys())}")
            for row in data[:3]:
                print(f"  Row: {dict(row)}")
    except Exception as e:
        print(f"  [FAIL] {str(e)[:180]}")

def test_rest(name, url):
    print(f"\n--- {name} ---")
    try:
        resp = requests.get(url, headers=headers, auth=auth, timeout=10)
        print(f"  Status: {resp.status_code}")
        if resp.status_code == 200:
            data = resp.json()
            for f in ['id','entityid','firstname','lastname','email','issalesrep','title']:
                print(f"  {f}: {data.get(f, 'N/A')}")
        else:
            print(f"  [FAIL] {resp.text[:200]}")
    except Exception as e:
        print(f"  [ERROR] {str(e)[:150]}")

print("=" * 60)
print("POST-PERMISOS: Employee, SalesRep, Class, Department")
print("=" * 60)

# 1. Employee via SuiteQL
test_q("employee SuiteQL (issalesrep=T)",
    "SELECT e.id, e.entityid, e.firstname, e.lastname, e.email, e.issalesrep FROM employee e WHERE e.issalesrep = 'T' OFFSET 0 ROWS FETCH NEXT 10 ROWS ONLY")

# 2. Employee via SuiteQL (all)
test_q("employee SuiteQL (all, limit 5)",
    "SELECT e.id, e.entityid, e.firstname, e.lastname FROM employee e OFFSET 0 ROWS FETCH NEXT 5 ROWS ONLY")

# 3. REST API for employee 14037 (Nestor Cejas from screenshots)
test_rest("REST API /employee/14037",
    f"https://{url_account_id}.suitetalk.api.netsuite.com/services/rest/record/v1/employee/14037")

# 4. transaction.salesrep
test_q("transaction.salesrep (CustInvc)",
    "SELECT t.id, t.tranid, t.salesrep FROM transaction t WHERE t.type = 'CustInvc' AND t.salesrep IS NOT NULL OFFSET 0 ROWS FETCH NEXT 5 ROWS ONLY")

# 5. transaction.department
test_q("transaction.department (CustInvc)",
    "SELECT t.id, t.tranid, t.department FROM transaction t WHERE t.type = 'CustInvc' AND t.department IS NOT NULL OFFSET 0 ROWS FETCH NEXT 5 ROWS ONLY")

# 6. transaction.class
test_q("transaction.class (CustInvc)",
    "SELECT t.id, t.tranid, t.class FROM transaction t WHERE t.type = 'CustInvc' AND t.class IS NOT NULL OFFSET 0 ROWS FETCH NEXT 5 ROWS ONLY")

# 7. classification record (Clases)
test_q("classification/clases record",
    "SELECT c.id, c.name FROM classification c OFFSET 0 ROWS FETCH NEXT 10 ROWS ONLY")

# 8. department record
test_q("department record",
    "SELECT d.id, d.name, d.parent FROM department d OFFSET 0 ROWS FETCH NEXT 10 ROWS ONLY")

# 9. Full transaction with all new fields
test_q("transaction con TODOS los campos nuevos (CustInvc)",
    "SELECT t.id, t.tranid, t.salesrep, t.department, t.class, t.subsidiary, t.entity FROM transaction t WHERE t.type = 'CustInvc' OFFSET 0 ROWS FETCH NEXT 3 ROWS ONLY")

# 10. SalesOrd con salesrep (Pipeline)
test_q("SalesOrd con salesrep (Pipeline)",
    "SELECT t.id, t.tranid, t.trandate, t.status, t.entity, t.salesrep, t.department, t.class FROM transaction t WHERE t.type = 'SalesOrd' OFFSET 0 ROWS FETCH NEXT 3 ROWS ONLY")
