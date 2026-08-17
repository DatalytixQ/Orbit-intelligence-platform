import json
import pandas as pd
from typing import Dict, Any
from orbitlink.audit import ETLAuditor
import traceback

class OrbitLinkEngine:
    """
    Motor ETL Principal de DQOrbit.
    Toma un archivo de configuración JSON (como config/etl/netsuite_to_dm_sales.json),
    ejecuta la extracción utilizando el conector apropiado, transforma la data
    al Universal Data Model, y prepara la carga a la Base de Datos.
    """
    
    def __init__(self, db_connection=None):
        self.db = db_connection
    
    def load_mapping_rule(self, filepath: str) -> Dict[str, Any]:
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
            
    def run_pipeline(self, mapping_filepath: str, extractor_instance, module_name: str = "General", entity_name: str = None):
        """
        Ejecuta el flujo ETL completo basado en el JSON, con auditoría.
        """
        # 1. Leer Configuración
        config = self.load_mapping_rule(mapping_filepath)
        target_table = config["target_table"]
        extraction_cfg = config["extraction"]
        mapping_rules = config["mapping"]
        
        if not entity_name:
            entity_name = target_table.replace("raw_ns_", "")
            
        auditor = ETLAuditor(self.db)
        audit_id = auditor.start_audit(module_name, entity_name)
        
        print(f"--- Iniciando Pipeline OrbitLink para: {target_table} (Audit ID: {audit_id}) ---")
        
        try:
            # 2. EXTRAER (Extract - Bronce)
            if extraction_cfg["type"] == "REST_SUITEQL":
                # Fetch LAST_SYNC_DATE from audit table
                last_sync_date = auditor.get_watermark(module_name, entity_name)
                print(f"[Incremental] Filtro de fecha desde auditoría para {target_table}: {last_sync_date}")
                
                query = extraction_cfg["base_query"]
                # Apply filters
                filters = []
                for f in extraction_cfg.get("filters", []):
                    val = f['value']
                    if "{{LAST_SYNC_DATE}}" in str(val):
                        val = val.replace("{{LAST_SYNC_DATE}}", last_sync_date)
                        
                    if f['operator'].upper() == 'IN' or val.startswith("BUILTIN.") or val.startswith("TO_DATE"):
                        filters.append(f"{f['field']} {f['operator']} {val}")
                    else:
                        # Only wrap in quotes if the value is not already wrapped or if it's a known boolean
                        if val in ['T', 'F'] or (val.startswith("'") and val.endswith("'")):
                            filters.append(f"{f['field']} {f['operator']} '{val.strip(chr(39))}'")
                        else:
                            filters.append(f"{f['field']} {f['operator']} '{val}'")
                
                if filters:
                    query += " WHERE " + " AND ".join(filters)
                
                print(f"[Engine Debug] Generated Query: {query}")
                
                # Executing query via NetSuiteConnector
                raw_df = extractor_instance.execute_suiteql(query)
            else:
                raise NotImplementedError("Source type not supported yet.")
                
            
            # 3. Validar resultados y convertir a DataFrame
            if not raw_df or len(raw_df) == 0:
                print("No hay datos nuevos para procesar.")
                return None
            
            if isinstance(raw_df, list):
                raw_df = pd.DataFrame(raw_df)
            
            # TRANSFORMAR (Transform - Plata)
            # Rename and map columns based on JSON
            print("Transformando datos al Universal Data Model...")
            mapped_df = pd.DataFrame()
        
            for dm_col, rules in mapping_rules.items():
                source_col = rules["source_field"]
                if source_col in raw_df.columns:
                    mapped_df[dm_col] = raw_df[source_col]
                    # Cast types
                    if rules["type"] == "number":
                        mapped_df[dm_col] = pd.to_numeric(mapped_df[dm_col], errors='coerce')
                    elif rules["type"] == "date":
                        fmt = rules.get("format")
                        mapped_df[dm_col] = pd.to_datetime(mapped_df[dm_col], format=fmt, dayfirst=True, errors='coerce')
                    elif rules["type"] == "string":
                        mapped_df[dm_col] = mapped_df[dm_col].astype(str)
        
            # Add default values
            defaults = config.get("defaults", {})
            for col, val in defaults.items():
                if val == "{{CURRENT_TIMESTAMP}}":
                    mapped_df[col] = pd.Timestamp.now().strftime("%Y-%m-%d %H:%M:%S")
                else:
                    mapped_df[col] = val

            # Apply validation rules
            validations = config.get("validation_rules", [])
            for rule in validations:
                col = rule["field"]
                if col in mapped_df.columns:
                    if rule["rule"] == "is_not_null":
                        mapped_df = mapped_df.dropna(subset=[col])
                    elif rule["rule"] == "greater_than":
                        mapped_df = mapped_df[mapped_df[col] > rule["value"]]
                    
            print(f"Transformación completada. Registros válidos: {len(mapped_df)}")
        
            # 4. CARGAR (Load - Oro)
            if self.db is not None:
                print(f"Cargando data limpia en la tabla: {target_table}")
                try:
                    pks = config.get("primary_keys", [])
                    if pks and len(mapped_df) > 0:
                        # Drop duplicates within the current extraction batch
                        mapped_df = mapped_df.drop_duplicates(subset=pks, keep='last')
                    
                        # Delete existing records in DB to act as an UPSERT
                        from sqlalchemy import text
                        with self.db.begin() as conn:
                            if len(pks) == 1:
                                pk = pks[0]
                                ids = tuple(mapped_df[pk].tolist())
                                if len(ids) == 1:
                                    conn.execute(text(f"DELETE FROM {target_table} WHERE {pk} = :id"), {"id": ids[0]})
                                elif len(ids) > 1:
                                    chunk_size = 1000
                                    for i in range(0, len(ids), chunk_size):
                                        chunk_ids = ids[i:i+chunk_size]
                                        id_list_str = "('" + "', '".join([str(x) for x in chunk_ids]) + "')"
                                        conn.execute(text(f"DELETE FROM {target_table} WHERE {pk} IN {id_list_str}"))
                            elif len(pks) == 2:
                                pk1, pk2 = pks[0], pks[1]
                                pairs = list(zip(mapped_df[pk1], mapped_df[pk2]))
                                chunk_size = 1000
                                for i in range(0, len(pairs), chunk_size):
                                    chunk_pairs = pairs[i:i+chunk_size]
                                    pair_strs = [f"('{p[0]}', '{p[1]}')" for p in chunk_pairs]
                                    pair_list_str = ", ".join(pair_strs)
                                    conn.execute(text(f"DELETE FROM {target_table} WHERE ({pk1}, {pk2}) IN ({pair_list_str})"))

                    mapped_df.to_sql(target_table, self.db, if_exists='append', index=False, chunksize=1000, method='multi')
                    print("Carga exitosa en Base de Datos.")
                except Exception as e:
                    print(f"Error al cargar en la base de datos: {str(e)}")
                    raise e # re-raise for the outer except to catch
            else:
                print(f"[Simulación] Cargando data limpia en la tabla: {target_table}")
                print(mapped_df.head())
            
            # Determine new watermark
            new_watermark = None
            # Often NetSuite uses 'lastModifiedDate' or similar in raw_df
            date_candidates = ['lastmodifieddate', 'last_modified_date', 'dateLastModified', 'last_modified_ts']
            for dc in date_candidates:
                if dc in [str(c).lower() for c in raw_df.columns]:
                    # Find exact case
                    actual_col = [c for c in raw_df.columns if str(c).lower() == dc][0]
                    max_val = raw_df[actual_col].max()
                    if pd.notna(max_val):
                        try:
                            new_watermark = pd.to_datetime(max_val).strftime("%Y-%m-%d %H:%M:%S")
                        except:
                            new_watermark = str(max_val)
                    break
                
            # Finish audit successfully
            auditor.finish_audit(audit_id, "SUCCESS", len(raw_df), len(mapped_df), new_watermark, None)
            
            return mapped_df
            
        except Exception as e:
            error_trace = traceback.format_exc()
            print(f"[Engine] Pipeline falló: {e}")
            auditor.finish_audit(audit_id, "ERROR", 0, 0, None, str(error_trace))
            raise e
