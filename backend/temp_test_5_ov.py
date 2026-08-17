import os, json
from dotenv import load_dotenv
from sqlalchemy import create_engine
import pandas as pd
from orbitlink.engine import OrbitLinkEngine
from orbitlink.netsuite import NetSuiteConnector

load_dotenv()
db_url = os.getenv('DATABASE_URL').replace('?pgbouncer=true', '').replace('&pgbouncer=true', '')
db = create_engine(db_url)
engine = OrbitLinkEngine(db_connection=db)
ns = NetSuiteConnector()

print('--- EXTRAYENDO 5 OV CABECERAS ---')
cfg_tx = engine.load_mapping_rule('../config/etl/netsuite_to_raw_ns_transactions.json')
# Override filters dynamically
cfg_tx['extraction']['filters'] = [
  {'field': 'type', 'operator': 'IN', 'value': "('SalesOrd')"},
  {'field': 'ROWNUM', 'operator': '<=', 'value': '5'}
]
# Write temp JSON so engine can read it
with open('temp_tx.json', 'w') as f: json.dump(cfg_tx, f)
df_tx = engine.run_pipeline('temp_tx.json', ns)

if df_tx is None or df_tx.empty:
    print('No OVs extracted.')
    exit(1)

tx_ids = df_tx['transaction_id'].tolist()
print('Extracted OV IDs:', tx_ids)
tx_ids_str = "(" + ",".join([f"'{x}'" for x in tx_ids]) + ")"

print('\n--- EXTRAYENDO TRANSACCIONES RELACIONADAS A LAS 5 OV ---')
cfg_related_tx = engine.load_mapping_rule('../config/etl/netsuite_to_raw_ns_transactions.json')
cfg_related_tx['extraction']['filters'] = [
  {'field': 'createdfrom', 'operator': 'IN', 'value': tx_ids_str}
]
with open('temp_related_tx.json', 'w') as f: json.dump(cfg_related_tx, f)
df_related_tx = engine.run_pipeline('temp_related_tx.json', ns)

all_tx_ids = tx_ids.copy()
if df_related_tx is not None and not df_related_tx.empty:
    related_ids = df_related_tx['transaction_id'].tolist()
    print('Related TX IDs:', related_ids)
    all_tx_ids.extend(related_ids)
    df_tx = pd.concat([df_tx, df_related_tx], ignore_index=True)

all_tx_ids_str = "(" + ",".join([f"'{x}'" for x in all_tx_ids]) + ")"

print('\n--- EXTRAYENDO LINEAS PARA ESTAS TRANSACCIONES ---')
cfg_lines = engine.load_mapping_rule('../config/etl/netsuite_to_raw_ns_transaction_lines.json')
cfg_lines['extraction']['filters'] = [
  {'field': 't.id', 'operator': 'IN', 'value': all_tx_ids_str},
  {'field': 'tl.mainline', 'operator': '=', 'value': 'F'},
  {'field': 'tl.taxline', 'operator': '=', 'value': 'F'}
]
with open('temp_lines.json', 'w') as f: json.dump(cfg_lines, f)
df_lines = engine.run_pipeline('temp_lines.json', ns)

print('\n--- EXTRAYENDO CLIENTES PARA ESTAS 5 OV ---')
cust_ids = df_tx['entity_id'].dropna().unique().tolist()
cust_ids_str = "(" + ",".join([f"'{x}'" for x in cust_ids]) + ")"

cfg_cust = engine.load_mapping_rule('../config/etl/netsuite_to_raw_ns_customers.json')
cfg_cust['extraction']['filters'] = [
  {'field': 'c.id', 'operator': 'IN', 'value': cust_ids_str}
]
with open('temp_cust.json', 'w') as f: json.dump(cfg_cust, f)
df_cust = engine.run_pipeline('temp_cust.json', ns)

print('\n--- LIMPIANDO TEMPS ---')
os.remove('temp_tx.json')
try:
    os.remove('temp_related_tx.json')
except:
    pass
os.remove('temp_lines.json')
os.remove('temp_cust.json')
print('DONE.')
