const fs = require('fs');
const { parse } = require('csv-parse');

const filepath = 'C:\\Users\\dario\\erp-intelligence-foundation\\errors\\20260720\\ar_open_items_20260720.csv';

let isFirst = true;
fs.createReadStream(filepath)
  .pipe(parse({
    delimiter: ';',
    columns: true,
    skip_empty_lines: true,
    trim: true,
    bom: true,
    quote: false
  }))
  .on('data', (record) => {
    if (isFirst) {
      const headers = Object.keys(record);
      for (const h of headers) {
         console.log(h, '->', h.split('').map(c => c.charCodeAt(0)).join(','));
      }
      isFirst = false;
      process.exit(0);
    }
  });
