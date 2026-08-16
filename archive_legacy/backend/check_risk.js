const http = require('http');
http.get('http://localhost:3000/api/supply/risk-by-customer', (res) => {
  let data = '';
  res.on('data', d => data += d);
  res.on('end', () => console.log(JSON.parse(data)[0]));
});
