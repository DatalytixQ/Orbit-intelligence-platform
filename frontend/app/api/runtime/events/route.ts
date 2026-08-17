import { NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), '..', 'docs', 'orchestration', 'events.json');
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ events: [] });
    }
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: "Failed to read events" }, { status: 500 });
  }
}
