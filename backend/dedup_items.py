import os
from sqlalchemy import create_engine
from sqlalchemy import text
from dotenv import load_dotenv

load_dotenv()
engine = create_engine(os.getenv('DATABASE_URL').replace('?pgbouncer=true',''))

sql = """
-- 1. Delete duplicates from raw_items_master
DELETE FROM public.raw_items_master
WHERE ctid NOT IN (
    SELECT ctid
    FROM (
        SELECT ctid,
               ROW_NUMBER() OVER(PARTITION BY LOWER(TRIM(item_sku)) ORDER BY snapshot_ts DESC) as rn
        FROM public.raw_items_master
    ) t
    WHERE t.rn = 1
);

-- 2. Delete duplicates from raw_ns_items (just in case)
DELETE FROM public.raw_ns_items
WHERE ctid NOT IN (
    SELECT ctid
    FROM (
        SELECT ctid,
               ROW_NUMBER() OVER(PARTITION BY itemid ORDER BY lastmodifieddate DESC) as rn
        FROM public.raw_ns_items
    ) t
    WHERE t.rn = 1
);

-- 3. Add UNIQUE constraints
ALTER TABLE public.raw_items_master ADD CONSTRAINT raw_items_master_sku_unique UNIQUE (item_sku);
ALTER TABLE public.raw_ns_items ADD CONSTRAINT raw_ns_items_itemid_unique UNIQUE (itemid);
"""

with engine.begin() as conn:
    for statement in sql.split(';'):
        if statement.strip():
            conn.execute(text(statement))
            print("Executed:", statement[:50])
