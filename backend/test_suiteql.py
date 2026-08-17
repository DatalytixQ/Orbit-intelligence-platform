import os
import sys
import psycopg2
from dotenv import load_dotenv

sys.path.append(os.path.dirname(os.path.abspath('.')))
from backend.orbitlink.netsuite import NetSuiteConnector

load_dotenv()
ns = NetSuiteConnector()

try:
    query = """
        SELECT tl.transaction, tl.linesequencenumber, tl.item, tl.netamount
        FROM transactionline tl
        WHERE tl.mainline = 'F'
    """
    print(ns.execute_suiteql(query + " FETCH FIRST 5 ROWS ONLY"))
except Exception as e:
    print(e)
