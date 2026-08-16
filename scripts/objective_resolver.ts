import { EventEmitter } from 'events';
import { RegistryManager, Objective } from './registry_manager';
import * as fs from 'fs';
import * as path from 'path';

export enum ResolutionState {
  SOLVED = 'SOLVED',
  PARTIALLY_SOLVED = 'PARTIALLY_SOLVED',
  REGRESSION = 'REGRESSION',
  FAILED = 'FAILED',
  NO_CHANGE = 'NO_CHANGE'
}

export class ObjectiveResolver {
  private eventBus: EventEmitter;

  constructor(eventBus: EventEmitter) {
    this.eventBus = eventBus;
  }

  public async resolveObjective(objective: Objective, iterationId: string, prevIterationId: string): Promise<ResolutionState> {
    console.log(`[ObjectiveResolver] Resolving Objective ${objective.id}`);

    // Read Evidence from artifacts directory
    const currentEvidence = this.readEvidence(iterationId);
    const prevEvidence = this.readEvidence(prevIterationId);

    // Run Comparisons
    const buildDiff = this.compareBuild(currentEvidence.build, prevEvidence.build);
    const lighthouseDiff = this.compareLighthouse(currentEvidence.lighthouse, prevEvidence.lighthouse);
    const playwrightDiff = this.comparePlaywright(currentEvidence.playwright, prevEvidence.playwright);
    const a11yDiff = this.compareAccessibility(currentEvidence.accessibility, prevEvidence.accessibility);
    const securityDiff = this.compareSecurity(currentEvidence.security, prevEvidence.security);
    
    // In a real scenario, this would use pixel-match to compare screenshots mathematically
    const visualDiff = this.compareScreenshots(currentEvidence.screenshots, prevEvidence.screenshots);

    // Aggregate Determination
    const resolution = this.determineResolution([
      buildDiff, lighthouseDiff, playwrightDiff, a11yDiff, securityDiff, visualDiff
    ], objective);

    this.updateRegistry(objective, resolution, iterationId);

    return resolution;
  }

  private readEvidence(iterationId: string) {
    if (!iterationId) return {
      build: false, lighthouse: 0, playwright: { passed: false },
      accessibility: 0, security: { vulnerabilities: Infinity }, screenshots: []
    };
    const root = path.join(__dirname, '..', 'artifacts', iterationId);
    // Mocking the read logic for the architecture scaffold
    return {
      build: fs.existsSync(path.join(root, 'build', 'build.log')),
      lighthouse: 100, // mock score
      playwright: { passed: true },
      accessibility: 100,
      security: { vulnerabilities: 0 },
      screenshots: []
    };
  }

  private compareBuild(curr: any, prev: any) { return curr === prev ? 'NO_CHANGE' : (curr ? 'SOLVED' : 'FAILED'); }
  private compareLighthouse(curr: number, prev: number) { return curr > prev ? 'SOLVED' : (curr < prev ? 'REGRESSION' : 'NO_CHANGE'); }
  private comparePlaywright(curr: any, prev: any) { return curr.passed ? 'SOLVED' : 'FAILED'; }
  private compareAccessibility(curr: number, prev: number) { return curr > prev ? 'SOLVED' : (curr < prev ? 'REGRESSION' : 'NO_CHANGE'); }
  private compareSecurity(curr: any, prev: any) { return curr.vulnerabilities < prev.vulnerabilities ? 'SOLVED' : (curr.vulnerabilities > prev.vulnerabilities ? 'REGRESSION' : 'NO_CHANGE'); }
  private compareScreenshots(curr: any, prev: any) { return 'NO_CHANGE'; }

  private determineResolution(diffs: string[], objective: Objective): ResolutionState {
    if (diffs.includes('REGRESSION')) return ResolutionState.REGRESSION;
    if (diffs.every(d => d === 'NO_CHANGE')) return ResolutionState.NO_CHANGE;
    if (diffs.every(d => d === 'SOLVED' || d === 'NO_CHANGE')) return ResolutionState.SOLVED;
    if (diffs.includes('SOLVED') && diffs.includes('FAILED')) return ResolutionState.PARTIALLY_SOLVED;
    return ResolutionState.FAILED;
  }

  private updateRegistry(objective: Objective, resolution: ResolutionState, iterationId: string) {
    if (resolution === ResolutionState.SOLVED) {
      objective.status = 'Completed';
    } else if (resolution === ResolutionState.FAILED || resolution === ResolutionState.REGRESSION || resolution === ResolutionState.NO_CHANGE) {
      objective.failure_count += 1;
      objective.status = 'Failed';
    } else if (resolution === ResolutionState.PARTIALLY_SOLVED) {
      // Create child objective or retry
      objective.retry_count += 1;
      objective.status = 'Pending';
    }

    if (!objective.execution_history) {
      objective.execution_history = [];
    }
    objective.execution_history.push(`[${iterationId}] Resolved as ${resolution}`);
    RegistryManager.addOrUpdateObjective(objective);

    // Prevent deduplication rule: clean similar pending objectives
    this.deduplicateRegistry(objective);
  }

  private deduplicateRegistry(sourceObjective: Objective) {
    const registry = RegistryManager.loadRegistry();
    let updated = false;

    for (const obj of registry) {
      if (obj.id !== sourceObjective.id && obj.status === 'Pending') {
        if (obj.title === sourceObjective.title && obj.category === sourceObjective.category) {
          // Merge logic
          obj.status = 'Cancelled';
          obj.execution_history.push(`Merged into parent ${sourceObjective.id}`);
          updated = true;
        }
      }
    }

    if (updated) {
      RegistryManager.saveRegistry(registry);
    }
  }
}
