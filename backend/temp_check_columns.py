import sys
sys.path.append(r'C:\Users\dario\erp-intelligence-foundation\backend')
from orbitlink.netsuite import NetSuiteConnector
from dotenv import load_dotenv
load_dotenv()

ns = NetSuiteConnector()
query = "SELECT * FROM customer WHERE ROWNUM = 1"
try:
    res = ns.execute_suiteql(query)
    if res:
        print("COLUMNS:", res[0].keys())
except Exception as e:
    print("FAILED:", e)
