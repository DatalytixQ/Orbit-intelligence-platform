import os
from dotenv import load_dotenv
from orbitlink.netsuite import NetSuiteConnector

load_dotenv()
try:
    ns = NetSuiteConnector()
    # Query one invoice directly
    query = "SELECT id, tranid, employee FROM transaction WHERE tranid = 'FC A-00007-00049651'"
    result = ns.execute_suiteql(query)
    print("Query result:")
    print(result)
except Exception as e:
    print(e)
