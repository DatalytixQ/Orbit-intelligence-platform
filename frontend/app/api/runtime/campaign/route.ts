import { NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), '..', 'docs', 'orchestration', 'campaign_dashboard.json');
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({
        campaignId: "N/A",
        mode: "IDLE",
        targetIterations: 0,
        completed: 0,
        remaining: 0,
        avgIterationTime: 0,
        eta: "N/A",
        objectivesCompleted: 0,
        objectivesFailed: 0,
        technicalDebtTrend: "FLAT",
        productMaturityTrend: "FLAT"
      });
    }
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: "Failed to read campaign dashboard" }, { status: 500 });
  }
}
