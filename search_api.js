const fs = require('fs');
const path = require('path');

function walk(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const stat = fs.statSync(path.join(dir, file));
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.next') {
        walk(path.join(dir, file), fileList);
      }
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      fileList.push(path.join(dir, file));
    }
  }
  return fileList;
}

const frontendDir = path.join(__dirname, 'frontend');
const files = walk(frontendDir);
const results = [];

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, index) => {
    if (line.includes('fetch(') || line.includes('/api/')) {
      results.push({
        file: file.replace(__dirname, ''),
        line: index + 1,
        content: line.trim()
      });
    }
  });
}

fs.writeFileSync('api_search_results.json', JSON.stringify(results, null, 2));
console.log('Search complete: ' + results.length + ' matches found.');
