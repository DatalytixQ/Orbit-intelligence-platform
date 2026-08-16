const http = require('http');

const endpoints = [
  { path: "/api/kpi/finance/dso-analytics", method: "GET" },
  { path: "/api/kpi/finance/dso-customers", method: "GET" },
  { path: "/api/kpi/finance/current", method: "GET" },
  { path: "/api/kpi/finance/ar-aging-summary", method: "GET" },
  { path: "/api/kpi/finance/risk-bundle", method: "GET" },
  { path: "/api/kpi/finance/special-receivables", method: "GET" },
  { path: "/api/kpi/finance/risk-trend", method: "GET" },
  { path: "/api/kpi/sales/monthly", method: "GET" },
  { path: "/api/kpi/sales/forecast-monthly", method: "GET" },
  { path: "/api/kpi/sales/forecast-quarterly", method: "GET" },
  { path: "/api/kpi/sales/top-participation-2026", method: "GET" },
  { path: "/api/kpi/sales/by-category", method: "GET" },
  { path: "/api/kpi/inventory/coverage", method: "GET" },
  { path: "/api/kpi/inventory/critical-items-count", method: "GET" },
  { path: "/api/kpi/inventory/critical-value", method: "GET" },
  { path: "/api/kpi/inventory/slow-moving-summary", method: "GET" },
  { path: "/api/kpi/inventory/critical-demand-mix", method: "GET" },
  { path: "/api/kpi/inventory/top-critical", method: "GET" },
  { path: "/api/kpi/inventory/slow-moving", method: "GET" },
  { path: "/api/home-executive-summary", method: "GET" },
  { path: "/api/kpi/home/commercial-summary", method: "GET" },
  { path: "/api/kpi/home/sales-vs-last-year", method: "GET" },
  { path: "/api/executive/health-score", method: "GET" },
  { path: "/api/analytics/executive", method: "GET" },
  { path: "/api/insights/current", method: "GET" },
  // skipping parameterized routes for this automated pass: /api/insights/:id, /api/insights/actions/:id/status
  { path: "/api/ai/chat-v2", method: "POST", body: { message: "Test" } }
];

async function testEndpoint({ path, method, body }) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
        // token is omitted, assuming some routes might not strictly require it for 200 OR we see 401
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ path, status: res.statusCode, data: data.substring(0, 100) });
      });
    });

    req.on('error', (e) => {
      resolve({ path, status: 'ERROR', error: e.message });
    });

    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function run() {
  const results = [];
  for (const ep of endpoints) {
    results.push(await testEndpoint(ep));
  }
  const fs = require('fs');
  fs.writeFileSync('integration_test_results.json', JSON.stringify(results, null, 2));
  console.log("Integration test complete.");
}

run();
