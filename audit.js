const fs = require('fs');
const path = require('path');

function getDirectories(srcpath) {
  try {
    return fs.readdirSync(srcpath).filter(file => fs.statSync(path.join(srcpath, file)).isDirectory());
  } catch(e) {
    return [];
  }
}

function hasTests(dir) {
  return fs.existsSync(path.join(dir, 'tests')) || fs.existsSync(path.join(dir, '__tests__')) || fs.existsSync(path.join(dir, 'jest.config.js'));
}

console.log('Backend has tests?', hasTests(path.join(__dirname, 'backend')));
console.log('Frontend has tests?', hasTests(path.join(__dirname, 'frontend')));
