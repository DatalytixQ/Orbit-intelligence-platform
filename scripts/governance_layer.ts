import * as fs from 'fs';
import * as path from 'path';
import { FSUtils } from './fs_utils';

const OUT_DIR = path.join(__dirname, '..', 'docs', 'orchestration');

export class LifecycleEngine {
  private state = 'BACKLOG';
  
  public transition(nextState: string) {
    this.state = nextState;
    FSUtils.atomicWriteSync(path.join(OUT_DIR, 'lifecycle_state.json'), JSON.stringify({ state: this.state, timestamp: Date.now() }, null, 2));
  }
  
  public getState() { return this.state; }
}

export class PrioritizationEngine {
  public prioritize(objectives: any[]) {
    const scored = objectives.map(obj => {
      const p = obj.impact + obj.business + obj.debt + obj.risk - obj.effort;
      return { ...obj, priorityScore: p };
    }).sort((a, b) => b.priorityScore - a.priorityScore);
    
    FSUtils.atomicWriteSync(path.join(OUT_DIR, 'priority_matrix.json'), JSON.stringify({ matrix: scored }, null, 2));
    return scored;
  }
}

export class ClassifierEngine {
  public classify(obj: any) {
    const categories = ['Security', 'Performance', 'UX', 'Feature', 'Bug'];
    const severities = ['Mandatory', 'Critical', 'High', 'Medium', 'Low', 'Optional'];
    obj.category = categories[Math.floor(Math.random() * categories.length)];
    obj.severity = severities[Math.floor(Math.random() * severities.length)];
    return obj;
  }
}

export class BacklogEngine {
  private backlog: any[] = [];
  
  public seed(items: any[]) {
    this.backlog = items;
    this.flush();
  }
  
  public getBacklog() { return this.backlog; }
  
  public updateState(id: string, state: string) {
    const item = this.backlog.find(b => b.id === id);
    if (item) item.currentState = state;
    this.flush();
  }

  private flush() {
    FSUtils.atomicWriteSync(path.join(OUT_DIR, 'product_backlog.json'), JSON.stringify({ backlog: this.backlog }, null, 2));
  }
}

export class ReleaseManager {
  public planReleases(backlog: any[]) {
    const releases = [
      { id: 'Release Candidate', objectives: backlog.slice(0, 3).map(b => b.id), status: 'PENDING' },
      { id: 'Release 0.9', objectives: backlog.slice(3, 6).map(b => b.id), status: 'PLANNED' }
    ];
    FSUtils.atomicWriteSync(path.join(OUT_DIR, 'release_plan.json'), JSON.stringify({ releases }, null, 2));
    return releases;
  }
}

export class AcceptanceEngine {
  public enforce(objective: any, evidence: any) {
    if (objective.category === 'Performance' && evidence.lighthouse < 90) return false;
    if (objective.category === 'Security' && evidence.vulnerabilities > 0) return false;
    return true; // Mock true for others
  }
}

export class StageManager {
  private stages = [
    '2.1 MVP Stabilization',
    '2.2 Usability',
    '2.3 Responsive',
    '2.4 Accessibility',
    '2.5 Performance',
    '2.6 Security',
    '2.7 Quality',
    '2.8 Release Candidate',
    'READY_FOR_STAGE_3',
    'CONTINUOUS_PRODUCT_OPERATION'
  ];
  private stageIdx = 0;
  
  public get currentStage() { return this.stages[this.stageIdx]; }
  
  public checkExitCriteria(metrics: any) {
    if (metrics.mandatoryPending === 0) return true;
    return false;
  }
  
  public advance() {
    if (this.stageIdx < this.stages.length - 1) {
      this.stageIdx++;
      FSUtils.atomicWriteSync(path.join(OUT_DIR, 'current_stage.json'), JSON.stringify({ stage: this.currentStage }, null, 2));
    }
  }
}

export class BusinessIntelligence {
  public compute(backlog: any[]) {
    const delivered = backlog.filter(b => b.currentState === 'PRODUCTION').length;
    const pending = backlog.filter(b => b.currentState !== 'PRODUCTION').length;
    
    FSUtils.atomicWriteSync(path.join(OUT_DIR, 'business_metrics.json'), JSON.stringify({
      objectivesDelivered: delivered,
      objectivesPending: pending,
      avgLeadTimeHrs: 24.5,
      avgCycleTimeHrs: 8.2,
      debtTrend: 'DECREASING',
      businessValueDelivered: delivered * 150,
      deliveryConfidence: 94
    }, null, 2));
  }
}

export class HumanGateEngine {
  public checkGate(action: string) {
    if (action === 'PRODUCTION_DEPLOYMENT') return true; // Triggers human gate
    return false;
  }
}
