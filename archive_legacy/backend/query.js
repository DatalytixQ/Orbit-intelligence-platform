const db = require('./db.js');
async function run() {
  try {
    await db.unsafe(`
      CREATE TABLE IF NOT EXISTS public.pipeline_error_log (
        id          SERIAL PRIMARY KEY,
        run_id      BIGINT REFERENCES data_load_runs(id),
        filename    TEXT NOT NULL,
        entity      TEXT,
        step        TEXT CHECK (step IN ('parse_filename','parse_csv','qa_check','raw_load','stg_load','refresh_views','move_file')),
        error_code  TEXT,
        error_msg   TEXT,
        row_number  INT,
        raw_value   TEXT,
        created_at  TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log("Table pipeline_error_log created or already exists.");
  } catch(e) {
    console.error('ERROR:', e.message);
  }
  process.exit();
}
run();
