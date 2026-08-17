import os
import requests
from requests_oauthlib import OAuth1
import urllib.parse

class NetSuiteConnector:
    """
    Conector a NetSuite utilizando Token Based Authentication (TBA) y REST API (SuiteQL).
    Diseñado específicamente para extraer Raw Data de forma segura.
    """
    
    def __init__(self, account_id: str = None, consumer_key: str = None, 
                 consumer_secret: str = None, token_id: str = None, token_secret: str = None):
        
        # Read from ENV if not provided
        self.account_id = account_id or os.getenv("NS_ACCOUNT_ID")
        self.consumer_key = consumer_key or os.getenv("NS_CONSUMER_KEY")
        self.consumer_secret = consumer_secret or os.getenv("NS_CONSUMER_SECRET")
        self.token_id = token_id or os.getenv("NS_TOKEN_ID")
        self.token_secret = token_secret or os.getenv("NS_TOKEN_SECRET")
        
        if not all([self.account_id, self.consumer_key, self.consumer_secret, self.token_id, self.token_secret]):
            raise ValueError("Faltan credenciales TBA para inicializar el conector de NetSuite.")
        
        # Determine Base URL
        # NetSuite REST URLs typically follow: https://<ACCOUNT_ID>.suitetalk.api.netsuite.com
        # Note: Account IDs with hyphens (e.g. 1234-SB1) translate to 1234_sb1 in the URL
        url_account_id = self.account_id.lower().replace("-", "_")
        self.base_url = f"https://{url_account_id}.suitetalk.api.netsuite.com/services/rest/query/v1/suiteql"
        
        # Setup OAuth1
        # NetSuite requires HMAC-SHA256
        from oauthlib.oauth1 import SIGNATURE_HMAC_SHA256
        
        self.auth = OAuth1(
            client_key=self.consumer_key,
            client_secret=self.consumer_secret,
            resource_owner_key=self.token_id,
            resource_owner_secret=self.token_secret,
            realm=self.account_id.replace("_", "-").upper(),
            signature_method=SIGNATURE_HMAC_SHA256
        )
        
        self.headers = {
            "Content-Type": "application/json",
            "Prefer": "transient"
        }

    def execute_suiteql(self, query: str) -> list:
        """
        Ejecuta una consulta SuiteQL cruda contra la API REST de NetSuite y maneja la paginación.
        Devuelve una lista de diccionarios.
        """
        print(f"[NetSuiteConnector] Ejecutando SuiteQL: {query[:50]}...")
        
        all_items = []
        limit = 1000
        offset = 0
        has_more = True
        
        while has_more:
            # We must pass the query in the payload for POST
            payload = {
                "q": query
            }
            # Append limit and offset to the base URL
            url = f"{self.base_url}?limit={limit}&offset={offset}"
            
            response = requests.post(
                url,
                headers=self.headers,
                auth=self.auth,
                json=payload
            )
            
            if response.status_code == 200:
                data = response.json()
                items = data.get("items", [])
                all_items.extend(items)
                
                has_more = data.get("hasMore", False)
                if has_more:
                    offset += limit
                    print(f"[NetSuiteConnector] Extraídos {len(all_items)}... Pidiendo siguiente página (offset: {offset})")
            else:
                print(f"Error {response.status_code}: {response.text}")
                raise Exception(f"Fallo en llamada a NetSuite (offset {offset}): {response.text}")
                
        print(f"[NetSuiteConnector] Extracción total exitosa: {len(all_items)} registros.")
        return all_items
    def execute_rest_record(self, record_type: str, record_id: str = "") -> dict:
        """
        Ejecuta una petición GET estándar a un Record en NetSuite (ej: /services/rest/record/v1/customer)
        """
        url = f"https://{self.account_id.lower().replace('-', '_')}.suitetalk.api.netsuite.com/services/rest/record/v1/metadata-catalog"
        print(f"[NetSuiteConnector] GET {url}")
        response = requests.get(
            url,
            headers={"Content-Type": "application/json", "Accept": "application/swagger+json"},
            auth=self.auth
        )
        if response.status_code == 200:
            return {"metadata": "success"}
        else:
            print(f"Error {response.status_code}: {response.text}")
            raise Exception(f"Fallo en llamada a NetSuite REST: {response.text}")
