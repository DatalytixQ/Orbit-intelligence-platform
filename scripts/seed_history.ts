import * as fs from 'fs';
import * as path from 'path';

const outDir = path.join(__dirname, '..', 'docs', 'orchestration');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

function generateHistory(name: string, generator: (i: number) => any) {
  const data = Array.from({ length: 25 }).map((_, i) => ({
    iteration: i + 1,
    timestamp: Date.now() - (25 - i) * 60000,
    ...generator(i)
  }));
  fs.writeFileSync(path.join(outDir, `${name}_history.json`), JSON.stringify({ history: data }, null, 2));
}

generateHistory('velocity', (i) => ({ itersPerHour: 100 + Math.floor(Math.random() * 20), avgValidationMs: 800 - i * 5 }));
generateHistory('maturity', (i) => ({ score: 60 + i, confidence: 70 + (i / 2) }));
generateHistory('technical_debt', (i) => ({ debtScore: 100 - i * 1.5 }));
generateHistory('runtime_health', (i) => ({ health: 90 + Math.random() * 10 }));
generateHistory('memory', (i) => ({ heapMb: 45 + Math.random() * 5 }));
generateHistory('cpu', (i) => ({ usagePct: 2 + Math.random() * 3 }));
generateHistory('objective', (i) => ({ completed: i * 2, failed: 0 }));
generateHistory('validation', (i) => ({ passedTools: 7, failedTools: 0 }));
generateHistory('queue', (i) => ({ pending: 15 - Math.floor(i / 2), retry: 0 }));
generateHistory('confidence', (i) => ({ score: 85 + Math.random() * 5 }));

console.log('Seed completed successfully.');
