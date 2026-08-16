import * as fs from 'fs';
import * as path from 'path';
import { FSUtils } from './fs_utils';

export interface EvidencePayload {
  playwright?: any;
  lighthouse?: any;
  accessibility?: any;
  security?: any;
  build?: any;
  lint?: any;
  database?: any;
  supabase?: any;
  visualDiff?: any;
  performance?: any;
  coverage?: any;
  logs?: any;
  api?: any;
  telemetry?: any;
}

export class EvidenceEngine {
  private getArtifactsRootDir() {
    return path.join(__dirname, '..', 'artifacts');
  }

  public generateEvidencePackage(iterationId: string, payload: EvidencePayload) {
    console.log(`[EvidenceEngine] Generating Evidence Package for ${iterationId}...`);
    const iterationPath = path.join(this.getArtifactsRootDir(), iterationId);
    
    // Write Evidence data to respective folders using atomic writes
    if (payload.playwright) this.writeJSON(iterationPath, 'playwright/report.json', payload.playwright);
    if (payload.lighthouse) this.writeJSON(iterationPath, 'lighthouse/report.json', payload.lighthouse);
    if (payload.accessibility) this.writeJSON(iterationPath, 'accessibility/axe_report.json', payload.accessibility);
    if (payload.security) this.writeJSON(iterationPath, 'security/security_report.json', payload.security);
    if (payload.build) this.writeText(iterationPath, 'build/build.log', payload.build);
    if (payload.lint) this.writeText(iterationPath, 'build/lint.log', payload.lint);
    if (payload.database) this.writeJSON(iterationPath, 'database/validation.json', payload.database);
    if (payload.supabase) this.writeJSON(iterationPath, 'database/supabase_audit.json', payload.supabase);
    if (payload.visualDiff) this.writeJSON(iterationPath, 'screenshots/visual_diff.json', payload.visualDiff);
    if (payload.performance) this.writeJSON(iterationPath, 'performance/web_vitals.json', payload.performance);
    if (payload.coverage) this.writeJSON(iterationPath, 'reports/coverage.json', payload.coverage);
    if (payload.logs) this.writeText(iterationPath, 'logs/execution.log', payload.logs);
    if (payload.api) this.writeJSON(iterationPath, 'reports/api_validation.json', payload.api);
    if (payload.telemetry) this.writeJSON(iterationPath, 'reports/telemetry.json', payload.telemetry);

    this.generateEvidenceManifest(iterationPath, payload);
    this.generateEvidenceIndex(iterationId, iterationPath);
    this.generateIterationSummary(iterationId, iterationPath, payload);

    console.log(`[EvidenceEngine] Evidence Package finalized in ${iterationPath}`);
  }

  private writeJSON(base: string, subPath: string, data: any) {
    FSUtils.atomicWriteSync(path.join(base, subPath), JSON.stringify(data, null, 2));
  }

  private writeText(base: string, subPath: string, data: string) {
    FSUtils.atomicWriteSync(path.join(base, subPath), data);
  }

  private generateEvidenceManifest(iterationPath: string, payload: EvidencePayload) {
    const manifest = {
      timestamp: new Date().toISOString(),
      sourcesCollected: Object.keys(payload).filter(k => (payload as any)[k] !== undefined),
      integrityHash: 'MOCK_SHA256_HASH'
    };
    this.writeJSON(iterationPath, 'manifest/evidence_manifest.json', manifest);
  }

  private generateEvidenceIndex(iterationId: string, iterationPath: string) {
    let md = `# Evidence Index: ${iterationId}\n\n`;
    md += `This document serves as the absolute source of truth for Iteration ${iterationId}.\n\n`;
    md += `- [Evidence Manifest](./manifest/evidence_manifest.json)\n`;
    md += `- [Iteration Summary](./reports/iteration_summary.md)\n`;
    this.writeText(iterationPath, 'reports/evidence_index.md', md);
  }

  private generateIterationSummary(iterationId: string, iterationPath: string, payload: EvidencePayload) {
    let md = `# Iteration Summary: ${iterationId}\n\n`;
    md += `**Date Executed**: ${new Date().toISOString()}\n\n`;
    md += `## Validation Results\n`;
    md += `- **Build**: ${payload.build ? 'Captured' : 'Missing'}\n`;
    md += `- **E2E Tests**: ${payload.playwright ? 'Captured' : 'Missing'}\n`;
    md += `- **Lighthouse**: ${payload.lighthouse ? 'Captured' : 'Missing'}\n`;
    md += `- **Accessibility**: ${payload.accessibility ? 'Captured' : 'Missing'}\n`;
    this.writeText(iterationPath, 'reports/iteration_summary.md', md);
  }
}
