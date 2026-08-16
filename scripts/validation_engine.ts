import { execSync } from 'child_process';
import { EventEmitter } from 'events';
import { EvidencePayload } from './evidence_engine';

export class ValidationEngine {
  private eventBus: EventEmitter;

  constructor(eventBus: EventEmitter) {
    this.eventBus = eventBus;
    this.setupListeners();
  }

  private setupListeners() {
    this.eventBus.on('VALIDATION_STARTED', async (event: any) => {
      const iterationId = event.payload?.iterationId;
      if (!iterationId) return;

      console.log(`[ValidationEngine] Starting real toolchain execution for ${iterationId}`);
      const evidence = await this.executeToolchain();
      
      this.eventBus.emit('EVIDENCE_GENERATED', {
        iterationId,
        evidence
      });
    });
  }

  private async executeToolchain(): Promise<EvidencePayload> {
    const payload: EvidencePayload = {};

    // 1. Build
    payload.build = this.safeExec('npm run build', 'Build');

    // 2. Lint
    payload.lint = this.safeExec('npm run lint', 'Lint');

    // 3. Security (Audit)
    const auditRes = this.safeExec('npm audit --json', 'Security');
    if (auditRes) {
      try { payload.security = JSON.parse(auditRes); } catch(e) { payload.security = { raw: auditRes }; }
    }

    // 4. Playwright (E2E & UI)
    const pwRes = this.safeExec('npx playwright test --reporter=json', 'Playwright');
    if (pwRes) {
      try { payload.playwright = JSON.parse(pwRes); } catch(e) { payload.playwright = { raw: pwRes }; }
    }

    // 5. Lighthouse (Performance, SEO, Best Practices)
    // Assumes lighthouse CLI is available globally or locally
    const lhRes = this.safeExec('npx lighthouse http://localhost:3000 --output=json --quiet', 'Lighthouse');
    if (lhRes) {
      try { payload.lighthouse = JSON.parse(lhRes); } catch(e) { payload.lighthouse = { raw: lhRes }; }
    }

    // 6. Accessibility (Axe)
    // Assumes some axe-cli or playwright axe integration
    const axeRes = this.safeExec('npx @axe-core/cli http://localhost:3000', 'Accessibility');
    payload.accessibility = axeRes ? { raw: axeRes } : undefined;

    // 7. Coverage
    // Assumes vitest or jest with coverage
    const covRes = this.safeExec('npm run test:coverage', 'Coverage');
    payload.coverage = covRes ? { raw: covRes } : undefined;

    // 8. Database (Migrations / Types)
    const dbRes = this.safeExec('npx supabase db dump', 'Database');
    payload.database = dbRes ? { raw: dbRes } : undefined;

    // 9. API Contract
    payload.api = { status: 'mocked_api_check' };
    
    // 10. Visual Diff
    payload.visualDiff = { status: 'mocked_visual_diff' };

    return payload;
  }

  private safeExec(command: string, name: string): string | undefined {
    console.log(`[ValidationEngine] Executing: ${command}`);
    try {
      const output = execSync(command, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
      console.log(`[ValidationEngine] ${name} completed successfully.`);
      return output;
    } catch (error: any) {
      console.warn(`[ValidationEngine] ${name} execution failed. Capturing logs and continuing.`);
      return error.stdout || error.stderr || error.message;
    }
  }
}
