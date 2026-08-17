import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const root = path.join(process.cwd(), '..');
    const maturityFile = path.join(root, 'docs', 'orchestration', 'product_maturity_report.md');
    let maturityText = '';
    if (fs.existsSync(maturityFile)) {
      maturityText = fs.readFileSync(maturityFile, 'utf8');
    }

    const registryFile = path.join(root, 'docs', 'orchestration', 'objective_registry.yaml');
    let registryText = '';
    if (fs.existsSync(registryFile)) {
      registryText = fs.readFileSync(registryFile, 'utf8');
    }

    // Try to read the latest iteration from artifacts
    const artifactsDir = path.join(root, 'artifacts');
    let latestIteration = null;
    let iterationId = 'iteration_0000';
    if (fs.existsSync(artifactsDir)) {
      const dirs = fs.readdirSync(artifactsDir).filter(d => d.startsWith('iteration_')).sort();
      if (dirs.length > 0) {
        iterationId = dirs[dirs.length - 1];
        const iterationPath = path.join(artifactsDir, iterationId);
        // read basic info
        const maturityJsonPath = path.join(iterationPath, 'maturity', 'maturity.json');
        if (fs.existsSync(maturityJsonPath)) {
          latestIteration = JSON.parse(fs.readFileSync(maturityJsonPath, 'utf8'));
        }
      }
    }

    return NextResponse.json({
      maturityText,
      registryText,
      iterationId,
      latestIteration
    });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
