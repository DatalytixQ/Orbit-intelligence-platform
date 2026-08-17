import os
import sys
import psycopg2
import pandas as pd
from dotenv import load_dotenv

sys.path.append(os.path.dirname(os.path.abspath('.')))
from backend.orbitlink.netsuite import NetSuiteConnector

load_dotenv()

def fetch_lines():
    print("Starting transaction lines extraction by ID chunks...")
    ns = NetSuiteConnector()
    
    db_url = os.environ['DATABASE_URL']
    if '?' in db_url:
        db_url = db_url.split('?')[0]
        
    conn = psycopg2.connect(db_url)
    cur = conn.cursor()
    
    # Get all transaction IDs that we want lines for
    cur.execute("SELECT transaction_id FROM raw_ns_transactions WHERE type IN ('CustInvc', 'CashSale', 'SalesOrd', 'Estimate', 'CustCred', 'CashRfnd')")
    tx_ids = [str(r[0]) for r in cur.fetchall()]
    print(f"Total transactions to process: {len(tx_ids)}")
    
    chunk_size = 500
    total_inserted = 0
    
    for i in range(0, len(tx_ids), chunk_size):
        chunk = tx_ids[i:i+chunk_size]
        ids_str = ",".join(chunk)
        
        query = f"""
            SELECT 
                tl.transaction as transaction_id, 
                tl.linesequencenumber as line_id, 
                tl.item as item_id, 
                tl.account as account_id, 
                tl.department as department_id, 
                tl.class as class_id, 
                tl.location as location_id, 
                tl.quantity, 
                tl.rate, 
                tl.netamount 
            FROM transactionline tl
            WHERE tl.transaction IN ({ids_str})
              AND tl.mainline = 'F'
              AND tl.taxline = 'F'
        """
        
        try:
            results = ns.execute_suiteql(query)
            if not results:
                continue
                
            df = pd.DataFrame(results)
            
            for _, row in df.iterrows():
                cur.execute("""
                    INSERT INTO raw_ns_transaction_lines 
                    (transaction_id, line_id, item_id, account_id, department_id, class_id, location_id, quantity, rate, netamount, snapshot_ts, source_system, client_id)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, CURRENT_TIMESTAMP, 'netsuite', 'vonderk')
                    ON CONFLICT (transaction_id, line_id) DO UPDATE SET
                        item_id = EXCLUDED.item_id,
                        account_id = EXCLUDED.account_id,
                        department_id = EXCLUDED.department_id,
                        class_id = EXCLUDED.class_id,
                        location_id = EXCLUDED.location_id,
                        quantity = EXCLUDED.quantity,
                        rate = EXCLUDED.rate,
                        netamount = EXCLUDED.netamount,
                        snapshot_ts = EXCLUDED.snapshot_ts
                """, (
                    row.get('transaction_id'), row.get('line_id'), row.get('item_id'), 
                    row.get('account_id'), row.get('department_id'), row.get('class_id'), 
                    row.get('location_id'), row.get('quantity'), row.get('rate'), 
                    row.get('netamount')
                ))
            
            conn.commit()
            total_inserted += len(df)
            print(f"Processed chunk {i//chunk_size + 1}/{(len(tx_ids)//chunk_size)+1} - Inserted {len(df)} lines.")
            
        except Exception as e:
            print(f"Error fetching/inserting chunk {i}: {e}")
            conn.rollback()

    cur.close()
    conn.close()
    print(f"Extraction complete. Total rows processed: {total_inserted}")

if __name__ == "__main__":
    fetch_lines()
