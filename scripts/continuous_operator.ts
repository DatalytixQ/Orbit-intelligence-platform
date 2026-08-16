import { RuntimeKernel } from './runtime_kernel';
import { FSUtils } from './fs_utils';
import * as path from 'path';
import * as fs from 'fs';

export class ContinuousOperator {
  private kernel: RuntimeKernel;
  private iterations = 0;
  private startTime = 0;
  
  // Telemetry
  private phaseTimestamps: Record<string, number> = {};
  private durations = {
    discovery: [] as number[],
    execution: [] as number[],
    validation: [] as number[]
  };

  private artifactsDir = path.join(__dirname, '..', 'artifacts', 'continuous_campaign');

  constructor() {
    this.kernel = new RuntimeKernel();
    if (!fs.existsSync(this.artifactsDir)) {
      fs.mkdirSync(this.artifactsDir, { recursive: true });
    }
  }

  public async start() {
    console.log('=========================================================');
    console.log('            CONTINUOUS OPERATION MODE ENGAGED            ');
    console.log('=========================================================');
    console.log('Operator: Antigravity Runtime Operator');
    console.log('Runtime Version: v2.4 (Physical Validation ONLY)');
    console.log('Human Gates: Enabled');
    this.startTime = Date.now();

    await this.kernel.initialize();
    this.setupTelemetry();
    this.setupHumanGates();

    // Infinite autonomous loop
    while (true) {
      this.iterations++;
      console.log(`\n[Continuous Operator] Initiating Iteration ${this.iterations}...`);

      const iterId = `iter_${String(this.iterations).padStart(5, '0')}`;
      await (this.kernel as any).eventBus.publish('TRIGGER_ITERATION', { iterationId: iterId });

      // Wait for pipeline to finish. We listen for IDLE transition or simply wait until lock clears.
      await this.waitForKernelIdle();
      this.writeCheckpoints();
      this.updateDashboard();
      
      console.log(`[Continuous Operator] Iteration ${this.iterations} completed. Proceeding to next objective.`);
      // Short breath between physical executions
      await new Promise(r => setTimeout(r, 2000));
    }
  }

  private async waitForKernelIdle() {
    // In v2.4, the global iteration.lock is cleared when it reaches IDLE.
    const lockPath = path.join(__dirname, '..', 'artifacts', 'iteration.lock');
    return new Promise<void>((resolve) => {
      const check = setInterval(() => {
        if (!fs.existsSync(lockPath)) {
          clearInterval(check);
          resolve();
        }
      }, 500);
    });
  }

  private setupTelemetry() {
    (this.kernel as any).eventBus.subscribe('RUNTIME_STATE_CHANGED', async (event: any) => {
      const state = event.payload.state;
      const now = Date.now();
      
      if (state === 'DISCOVERING') this.phaseTimestamps['DISCOVERING'] = now;
      if (state === 'PRIORITIZING') {
        if (this.phaseTimestamps['DISCOVERING']) this.durations.discovery.push(now - this.phaseTimestamps['DISCOVERING']);
      }
      if (state === 'EXECUTING') this.phaseTimestamps['EXECUTING'] = now;
      if (state === 'VALIDATING') {
        if (this.phaseTimestamps['EXECUTING']) this.durations.execution.push(now - this.phaseTimestamps['EXECUTING']);
        this.phaseTimestamps['VALIDATING'] = now;
      }
      if (state === 'RESOLVING') {
        if (this.phaseTimestamps['VALIDATING']) this.durations.validation.push(now - this.phaseTimestamps['VALIDATING']);
      }
    });
  }

  private setupHumanGates() {
    (this.kernel as any).eventBus.subscribe('HUMAN_GATE_REQUIRED', async (event: any) => {
      console.error(`\n[HUMAN GATE TRIGGERED] ${event.payload.reason}`);
      console.error('Halting Continuous Operations pending manual intervention.');
      process.exit(1);
    });
  }

  private updateDashboard() {
    const elapsedHrs = (Date.now() - this.startTime) / 3600000;
    const itersPerHour = elapsedHrs > 0 ? (this.iterations / elapsedHrs).toFixed(2) : 0;
    
    const dashboardPath = path.join(__dirname, '..', 'docs', 'orchestration', 'campaign_dashboard.json');
    FSUtils.atomicWriteSync(dashboardPath, JSON.stringify({
      campaignId: 'CONTINUOUS-V2.4',
      progress: `${this.iterations} / ∞`,
      itersPerHour,
      avgValidationTimeMs: this.avg(this.durations.validation),
      avgExecutionTimeMs: this.avg(this.durations.execution),
      avgDiscoveryTimeMs: this.avg(this.durations.discovery),
      memoryUsageMB: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      uptimeHrs: elapsedHrs.toFixed(4)
    }, null, 2));
  }

  private writeCheckpoints() {
    if (this.iterations % 10 === 0) this.writeReport(`checkpoint_10_iter_${this.iterations}.md`, 'Mini Report');
    if (this.iterations % 25 === 0) this.writeReport(`operational_report_25_iter_${this.iterations}.md`, 'Operational Report');
    if (this.iterations % 50 === 0) this.writeReport(`health_report_50_iter_${this.iterations}.md`, 'Health Report');
    if (this.iterations % 100 === 0) this.writeReport(`campaign_report_100_iter_${this.iterations}.md`, 'Campaign Report');
  }

  private writeReport(filename: string, title: string) {
    const p = path.join(this.artifactsDir, filename);
    const md = `# ${title}\n\n**Iterations Completed**: ${this.iterations}\n**Status**: ACTIVE\n**Memory Usage**: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB\n\nEvidence securely generated.`;
    FSUtils.atomicWriteSync(p, md);
    console.log(`[Continuous Operator] Generated checkpoint: ${filename}`);
  }

  private avg(arr: number[]) {
    if (arr.length === 0) return 0;
    return Math.round(arr.reduce((a,b) => a+b, 0) / arr.length);
  }
}

new ContinuousOperator().start();
