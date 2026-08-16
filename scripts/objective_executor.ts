import { EventEmitter } from 'events';
import { RegistryManager, Objective } from './registry_manager';
import { ArtifactManager } from './artifact_manager';

export enum ExecutionState {
  QUEUED = 'QUEUED',
  RESERVED = 'RESERVED',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  BLOCKED = 'BLOCKED'
}

export class ObjectiveExecutor {
  private eventBus: EventEmitter;
  private currentObjective: Objective | null = null;
  private state: ExecutionState = ExecutionState.QUEUED;

  constructor(eventBus: EventEmitter) {
    this.eventBus = eventBus;
  }

  public async executeNext(iterationId: string) {
    console.log('[ObjectiveExecutor] Reading Objective Registry...');
    const registry = RegistryManager.loadRegistry();

    // Select highest priority objective
    const pendingObjectives = registry
      .filter(o => o.status === 'Pending' && this.checkDependencies(o, registry))
      .sort((a, b) => b.priority_score - a.priority_score);

    if (pendingObjectives.length === 0) {
      console.log('[ObjectiveExecutor] No executable objectives found.');
      await this.eventBus.publish('EXECUTOR_STATE_CHANGE', { state: 'COMPLETED', detail: 'No pending objectives' });
      return;
    }

    this.currentObjective = pendingObjectives[0];
    console.log(`[ObjectiveExecutor] Selected Objective: ${this.currentObjective.id}`);

    // Reserve objective
    this.transitionState(ExecutionState.RESERVED);
    this.updateRegistryStatus('In Progress');

    // Execute implementation
    this.transitionState(ExecutionState.RUNNING);
    const executionLogs = await this.performExecution(this.currentObjective);

    // Track progress & collect execution logs
    ArtifactManager.writeArtifact(
      iterationId, 
      'logs', 
      `${this.currentObjective.id}_execution.log`, 
      executionLogs
    );

    // Trigger Validation (simulated)
    const success = await this.triggerValidation(this.currentObjective);

    if (success) {
      this.transitionState(ExecutionState.COMPLETED);
      this.updateRegistryStatus('Completed');
      console.log(`[ObjectiveExecutor] Objective ${this.currentObjective.id} executed successfully.`);
    } else {
      this.transitionState(ExecutionState.FAILED);
      this.updateRegistryStatus('Failed');
      console.log(`[ObjectiveExecutor] Objective ${this.currentObjective.id} execution failed.`);
    }

    // Release lock (reset state)
    this.currentObjective = null;
    this.transitionState(ExecutionState.QUEUED);
  }

  private checkDependencies(objective: Objective, registry: Objective[]): boolean {
    if (!objective.dependencies || objective.dependencies.length === 0) {
      return true;
    }
    // Check if all dependencies are marked as Completed
    for (const depId of objective.dependencies) {
      const dep = registry.find(o => o.id === depId);
      if (!dep || dep.status !== 'Completed') {
        return false;
      }
    }
    return true;
  }

  private async performExecution(objective: Objective): Promise<string> {
    console.log(`[ObjectiveExecutor] Executing implementation for ${objective.title}...`);
    // Mock implementation logic. In a real scenario, this delegates to specialized sub-agents
    // or applies automated AST refactoring tools.
    return `Execution started for ${objective.id}\nApplied automated fix.\nExecution finished.`;
  }

  private async triggerValidation(objective: Objective): Promise<boolean> {
    console.log(`[ObjectiveExecutor] Triggering validation for ${objective.id}...`);
    // Mock validation trigger
    return true;
  }

  private updateRegistryStatus(status: 'Pending' | 'In Progress' | 'Completed' | 'Failed') {
    if (this.currentObjective) {
      this.currentObjective.status = status;
      RegistryManager.addOrUpdateObjective(this.currentObjective);
    }
  }

  private transitionState(newState: ExecutionState) {
    this.state = newState;
    this.eventBus.emit('EXECUTOR_STATE_CHANGE', this.state, this.currentObjective?.id);
  }

  public getState(): ExecutionState {
    return this.state;
  }
}
