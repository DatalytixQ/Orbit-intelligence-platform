const fs = require('fs');
const path = require('path');
function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory() && !file.includes('node_modules') && !file.includes('.next')) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}
const files = walk(path.join(process.cwd(), 'frontend', 'app')).concat(walk(path.join(process.cwd(), 'frontend', 'components')));

let numConflicts = 0;

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf-8');
  let originalContent = content;
  // Match className="..."
  const regex = /className=["']([^"']+)["']/g;
  let match;
  
  while ((match = regex.exec(content)) !== null) {
    const clsStr = match[1];
    const cls = clsStr.split(' ');
    
    const hasM = cls.some(c => /^m-\d+/.test(c));
    const hasMX = cls.some(c => /^mx-\d+/.test(c));
    const hasMY = cls.some(c => /^my-\d+/.test(c));
    const hasML = cls.some(c => /^ml-\d+/.test(c));
    const hasMR = cls.some(c => /^mr-\d+/.test(c));
    const hasMT = cls.some(c => /^mt-\d+/.test(c));
    const hasMB = cls.some(c => /^mb-\d+/.test(c));
    
    const hasP = cls.some(c => /^p-\d+/.test(c));
    const hasPX = cls.some(c => /^px-\d+/.test(c));
    const hasPY = cls.some(c => /^py-\d+/.test(c));
    const hasPL = cls.some(c => /^pl-\d+/.test(c));
    const hasPR = cls.some(c => /^pr-\d+/.test(c));
    const hasPT = cls.some(c => /^pt-\d+/.test(c));
    const hasPB = cls.some(c => /^pb-\d+/.test(c));

    let conflicts = [];
    if (hasM && (hasMX || hasMY || hasML || hasMR || hasMT || hasMB)) conflicts.push('margin');
    if (hasP && (hasPX || hasPY || hasPL || hasPR || hasPT || hasPB)) conflicts.push('padding');
    if (hasPY && (hasPT || hasPB)) conflicts.push('padding-y');
    if (hasPX && (hasPL || hasPR)) conflicts.push('padding-x');
    if (hasMY && (hasMT || hasMB)) conflicts.push('margin-y');
    if (hasMX && (hasML || hasMR)) conflicts.push('margin-x');
    
    if (conflicts.length > 0) {
      console.log(f.split(path.sep).pop() + ' -> CONFLICT: ' + conflicts.join(', ') + ' IN: ' + clsStr);
      numConflicts++;
    }
  }
});
console.log('Total Conflicts:', numConflicts);
