import { NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

export async function GET() {
  const outDir = path.join(process.cwd(), '..', 'docs', 'orchestration');
  const files = [
    'velocity_history.json',
    'maturity_history.json',
    'technical_debt_history.json',
    'runtime_health_history.json',
    'memory_history.json',
    'cpu_history.json',
    'objective_history.json',
    'validation_history.json',
    'queue_history.json',
    'confidence_history.json'
  ];

  const payload: Record<string, unknown> = {};
  for (const file of files) {
    const key = file.replace('_history.json', '');
    try {
      const data = JSON.parse(fs.readFileSync(path.join(outDir, file), 'utf8'));
      payload[key] = data.history || [];
    } catch {
      payload[key] = [];
    }
  }

  return NextResponse.json(payload);
}
