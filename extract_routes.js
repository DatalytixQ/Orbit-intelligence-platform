const fs = require('fs');
const path = require('path');
const routesDir = path.join(__dirname, 'backend', 'routes');
const files = fs.readdirSync(routesDir);
const routes = [];
files.forEach(f => {
  const code = fs.readFileSync(path.join(routesDir, f), 'utf-8');
  const matches = [...code.matchAll(/router\.(get|post|put|delete)\(\s*['"]([^'"]+)['"]/g)];
  matches.forEach(m => {
    routes.push({ file: f, method: m[1], path: m[2] });
  });
});
fs.writeFileSync('backend_routes.json', JSON.stringify(routes, null, 2));
console.log('Found ' + routes.length + ' routes');
