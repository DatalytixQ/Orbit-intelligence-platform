import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()
try:
    print("Ejecutando script de políticas RLS...")
    conn = psycopg2.connect(os.environ['DATABASE_URL'].split('?')[0])
    cur = conn.cursor()
    with open('sql/n070_rls_policies.sql', 'r', encoding='utf-8') as f:
        sql = f.read()
    cur.execute(sql)
    conn.commit()
    print("Políticas RLS aplicadas con éxito.")
except Exception as e:
    print("Error:", e)
