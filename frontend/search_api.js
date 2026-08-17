const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('C:\\Users\\dario\\erp-intelligence-foundation\\frontend\\src', function(filePath) {
  if (filePath.endsWith('.ts') || filePath.endsWith('.tsx') || filePath.endsWith('.js')) {
    const content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('/api/')) {
        const lines = content.split('\n');
        lines.forEach((line, i) => {
            if (line.includes('/api/')) {
                console.log(filePath + ":" + (i+1) + ": " + line.trim());
            }
        });
    }
  }
});
