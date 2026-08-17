import { NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

export async function GET() {
  const outDir = path.join(process.cwd(), '..', 'docs', 'orchestration');
  
  const readJSON = (filename: string) => {
    try {
      return JSON.parse(fs.readFileSync(path.join(outDir, filename), 'utf8'));
    } catch {
      return null;
    }
  };

  const payload = {
    lifecycle: readJSON('lifecycle_state.json'),
    backlog: readJSON('product_backlog.json'),
    priority: readJSON('priority_matrix.json'),
    release: readJSON('release_plan.json'),
    business: readJSON('business_metrics.json')
  };

  return NextResponse.json(payload);
}
