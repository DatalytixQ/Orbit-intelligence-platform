import { NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

export async function GET() {
  try {
    const statusPath = path.join(process.cwd(), '..', 'docs', 'orchestration', 'runtime_status.json');
    const healthPath = path.join(process.cwd(), '..', 'docs', 'orchestration', 'runtime_health.json');
    const queuePath = path.join(process.cwd(), '..', 'docs', 'orchestration', 'queue_state.json');

    let payload: Record<string, unknown> = {
      state: "OFFLINE",
      phase: "N/A",
      currentObjective: "N/A",
      iteration: 0,
      iterationsToday: 0,
      iterationsTotal: 0,
      queueSize: 0,
      retryQueue: 0,
      humanGates: 0,
      currentCampaign: "NONE",
      runtimeUptime: "0:00",
      cpu: 0,
      memory: 0,
      currentTool: "N/A",
      currentEvidence: "N/A",
      lastSuccess: "N/A",
      confidence: 0,
      lastError: null,
      timestamp: Date.now(),
      radarData: [],
      queueState: []
    };

    if (fs.existsSync(statusPath)) {
      payload = { ...payload, ...JSON.parse(fs.readFileSync(statusPath, 'utf8')) };
    }
    if (fs.existsSync(healthPath)) {
      payload.radarData = JSON.parse(fs.readFileSync(healthPath, 'utf8'));
    }
    if (fs.existsSync(queuePath)) {
      payload.queueState = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
    }
    
    return NextResponse.json(payload);
  } catch {
    return NextResponse.json({ error: "Failed to read runtime status" }, { status: 500 });
  }
}
