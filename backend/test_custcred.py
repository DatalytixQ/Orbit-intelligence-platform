import os
import pandas as pd
from dotenv import load_dotenv

import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from orbitlink.netsuite import NetSuiteConnector

load_dotenv()

def extract_custcred():
    ns = NetSuiteConnector()
    q = "SELECT * FROM (SELECT t.id, t.type, tl.netamount, tl.quantity FROM transaction t JOIN transactionline tl ON t.id = tl.transaction WHERE t.type = 'CustCred' AND tl.mainline = 'F') WHERE ROWNUM <= 5"
    res = ns.execute_suiteql(q)
    print(pd.DataFrame(res))

if __name__ == "__main__":
    extract_custcred()
