import os
import pandas as pd
from dotenv import load_dotenv

import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from orbitlink.netsuite import NetSuiteConnector

load_dotenv()

def extract_invoices():
    ns = NetSuiteConnector()
    tranids = "'FC A-00007-00049651', 'FC A-00007-00049652', 'MEX-9900022420', 'MEX-9900022423'"
    
    q_tx = f"""
    SELECT id, tranid, trandate, type, entity, employee, exchangerate, taxtotal, total, totalaftertaxes, custbody_arg_importe_neto_gravado, custbody_arg_importe_total
    FROM transaction
    WHERE tranid IN ({tranids})
    """
    print(f"Executing: {q_tx}")
    res = ns.execute_suiteql(q_tx)
    if not res:
        print("No transactions found.")
        return
        
    tx_df = pd.DataFrame(res)
    print("--- Transactions ---")
    print(tx_df.to_string())

if __name__ == "__main__":
    extract_invoices()
