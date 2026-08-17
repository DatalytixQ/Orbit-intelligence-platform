const fs = require('fs');
const { parse } = require('csv-parse');
const { SCHEMA } = require('./schemaRegistry');
const path = require('path');

const { Transform } = require('stream');

/**
 * Detects entity from filename
 */
function detectEntity(filename) {
  const match = filename.match(/^([a-z_]+)_(\d{8})(?:_.*)?\.csv$/);
  if (!match) return null;
  const entityCandidate = match[1];
  
  if (SCHEMA[entityCandidate]) {
    return { entity: entityCandidate, dateStr: match[2] };
  }
  return null;
}

/**
 * Parses the CSV file and maps columns based on the schema registry
 */
async function parseCSV(filepath, entityConfig) {
  return new Promise((resolve, reject) => {
    const results = [];
    let headers = [];

    let isFirstDataRow = true;

    // Transform stream to strip outer quotes and handle BOM
    let buffer = '';
    const stripOuterQuotes = new Transform({
      transform(chunk, encoding, callback) {
        buffer += chunk.toString();
        let lines = buffer.split('\n');
        buffer = lines.pop(); // keep the last partial line in buffer
        
        for (let i = 0; i < lines.length; i++) {
          let line = lines[i];
          // Strip UTF-8 BOM if present on first line
          if (line.charCodeAt(0) === 0xFEFF) {
             line = line.slice(1);
          }
          line = line.trim();
          if (line.startsWith('"') && line.endsWith('"') && line.length >= 2) {
            line = line.slice(1, -1);
          }
          // Fix double quotes to single quotes for csv-parse
          line = line.replace(/""/g, '"');
          this.push(line + '\n');
        }
        callback();
      },
      flush(callback) {
        if (buffer) {
          let line = buffer.trim();
          if (line.startsWith('"') && line.endsWith('"') && line.length >= 2) {
            line = line.slice(1, -1);
          }
          line = line.replace(/""/g, '"');
          this.push(line + '\n');
        }
        callback();
      }
    });

    fs.createReadStream(filepath)
      .pipe(stripOuterQuotes)
      .pipe(parse({
        delimiter: ',',
        columns: true,
        skip_empty_lines: true,
        trim: true,
        quote: '"',
        escape: '"',
        on_record: (record, context) => {
          // Remap columns if necessary
          const mappedRecord = {};
          if (isFirstDataRow) {
            headers = Object.keys(record);
            isFirstDataRow = false;
          }

          // Convert all keys to lowercase for matching
          const normalizedRecord = {};
          for (const key in record) {
            const cleanKey = key.trim().toLowerCase();
            normalizedRecord[cleanKey] = record[key];
          }

          const { required_cols, optional_cols, col_remap } = entityConfig;
          const allCols = [...required_cols, ...optional_cols];

          for (const col of allCols) {
            // Check if column needs remapping from source name to db name
            let sourceCol = col;
            for (const [src, dest] of Object.entries(col_remap)) {
              if (dest === col) {
                sourceCol = src;
                break;
              }
            }

            let val = normalizedRecord[sourceCol.toLowerCase()];
            if (val !== undefined && val !== '') {
               // Strip thousands separators (commas) from numeric strings like "145,124.00" or "-1,234.56"
               if (typeof val === 'string') {
                  if (/^-?\d{1,3}(,\d{3})+(\.\d+)?$/.test(val)) {
                     val = val.replace(/,/g, '');
                  } else if (/^\(\d{1,3}(,\d{3})*(\.\d+)?\)$/.test(val)) {
                     // Handle accounting format (81,511.80) -> -81511.80
                     val = '-' + val.replace(/[(),]/g, '');
                  }
               }
               mappedRecord[col] = val;
            } else {
               mappedRecord[col] = null;
            }
            if (col === 'source_system' && mappedRecord[col] === null) {
              mappedRecord[col] = 'ERP';
            } else if (col === 'client_id' && mappedRecord[col] === null) {
              mappedRecord[col] = 1;
            } else if (col === 'snapshot_ts' && mappedRecord[col] === null) {
              mappedRecord[col] = new Date().toISOString();
            }

          }
          return mappedRecord;
        }
      }))
      .on('data', (data) => results.push(data))
      .on('end', () => {
        // Validate required columns presence in headers (case-insensitive)
        const lowerHeaders = headers.map(h => h.trim().toLowerCase());
        const missingCols = [];
        
        for (const reqCol of entityConfig.required_cols) {
           let sourceCol = reqCol;
           for (const [src, dest] of Object.entries(entityConfig.col_remap)) {
             if (dest === reqCol) {
               sourceCol = src;
               break;
             }
           }
           
           // Ignore default injected columns
           if (['source_system', 'client_id', 'snapshot_ts'].includes(sourceCol)) {
             continue;
           }

           if (!lowerHeaders.includes(sourceCol.toLowerCase())) {
             missingCols.push(sourceCol);
           }
        }
        
        if (missingCols.length > 0) {
          reject(new Error(`Missing required columns in CSV: ${missingCols.join(', ')}`));
        } else {
          resolve(results);
        }
      })
      .on('error', (err) => reject(err));
  });
}

module.exports = { detectEntity, parseCSV };
