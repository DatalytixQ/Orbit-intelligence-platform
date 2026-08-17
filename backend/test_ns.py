import os
from dotenv import load_dotenv
from orbitlink.netsuite import NetSuiteConnector

load_dotenv()

def test_connection():
    try:
        print("Inicializando Conector de NetSuite...")
        connector = NetSuiteConnector()
        print(f"Conectando a Account ID: {connector.account_id}")
        
        # Test Query: Get raw sample of transactions
        query = "SELECT id, tranid, type, trandate FROM transaction WHERE ROWNUM <= 5"
        items = connector.execute_suiteql(query)
        
        print("\n--- RESULTADO DE LA CONEXIÓN ---")
        if items:
            print("[SUCCESS] ¡Conexión Exitosa!")
            print(items)
        else:
            print("⚠️ Conexión exitosa, pero la consulta no devolvió resultados.")
            
    except Exception as e:
        print("[ERROR] Error de Conexión:", str(e))

if __name__ == "__main__":
    test_connection()
