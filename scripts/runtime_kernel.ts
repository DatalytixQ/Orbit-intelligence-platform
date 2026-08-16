import { EventBus, EventPriority, RuntimeEvent } from './event_bus';
import { SmartScheduler } from './scheduler';
import { ObjectiveExecutor } from './objective_executor';
import { ObjectiveResolver } from './objective_resolver';
import { EvidenceEngine } from './evidence_engine';
import { MaturityEngine } from './maturity_engine';
import { RegistryManager } from './registry_manager';
import { ArtifactManager } from './artifact_manager';
import { ValidationEngine } from './validation_engine';
import { FSUtils } from './fs_utils';
import * as path from 'path';

export enum RuntimeState {
  BOOTING = 'BOOTING',
  IDLE = 'IDLE',
  DISCOVERING = 'DISCOVERING',
  PRIORITIZING = 'PRIORITIZING',
  EXECUTING = 'EXECUTING',
  VALIDATING = 'VALIDATING',
  RESOLVING = 'RESOLVING',
  ARCHIVING = 'ARCHIVING',
  WAITING_HUMAN_GATE = 'WAITING_HUMAN_GATE',
  SHUTDOWN = 'SHUTDOWN'
}

export class RuntimeKernel {
  private state: RuntimeState = RuntimeState.BOOTING;
  private eventBus: EventBus;
  private scheduler: SmartScheduler;
  private executor: ObjectiveExecutor;
  private resolver: ObjectiveResolver;
  private evidenceEngine: EvidenceEngine;
  private maturityEngine: MaturityEngine;
  private validationEngine: ValidationEngine;

  private currentIterationId: string = '';

  constructor() {
    this.eventBus = new EventBus();
    this.scheduler = new SmartScheduler(this.eventBus as any);
    this.executor = new ObjectiveExecutor(this.eventBus as any);
    this.resolver = new ObjectiveResolver(this.eventBus as any);
    this.validationEngine = new ValidationEngine(this.eventBus as any);
    this.evidenceEngine = new EvidenceEngine();
    this.maturityEngine = new MaturityEngine();
    
    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    // Pipeline Orchestration
    this.eventBus.subscribe('TRIGGER_ITERATION', async () => {
      this.currentIterationId = `iteration_${Date.now()}`;
      
      const lockPath = path.join(__dirname, '..', 'iteration.lock');
      if (!FSUtils.acquireLock(lockPath)) {
        console.warn('[RuntimeKernel] Cannot start iteration. Lock exists.');
        return;
      }

      this.transitionTo(RuntimeState.DISCOVERING);
      
      // Initialize the iteration tree upfront to prevent race conditions
      ArtifactManager.initializeIteration(this.currentIterationId);

      // Simulate discovery
      await this.eventBus.publish('GAP_DISCOVERED', { source: 'Linter', details: 'Mock' });
      await this.eventBus.publish('OBJECTIVE_REGISTERED', { id: 'OBJ-MOCK-001' });
      this.transitionTo(RuntimeState.PRIORITIZING);
      // Priority done, move to execution
      this.transitionTo(RuntimeState.EXECUTING);
      await this.executor.executeNext(this.currentIterationId);
    });

    this.eventBus.subscribe('EXECUTOR_STATE_CHANGE', async (event: RuntimeEvent) => {
      if (event.payload?.state === 'COMPLETED' || event.payload?.state === 'FAILED') {
        this.transitionTo(RuntimeState.VALIDATING);
        await this.eventBus.publish('VALIDATION_STARTED', { iterationId: this.currentIterationId });
      }
    });

    this.eventBus.subscribe('VALIDATION_STARTED', async (event: RuntimeEvent) => {
      // The ValidationEngine now handles this event to run the tools.
      // We no longer simulate it resolving here.
    });

    this.eventBus.subscribe('OBJECTIVE_SOLVED', async () => {
      this.transitionTo(RuntimeState.ARCHIVING);
    });

    this.eventBus.subscribe('OBJECTIVE_FAILED', async () => {
      this.transitionTo(RuntimeState.ARCHIVING);
    });

    this.eventBus.subscribe('EVIDENCE_GENERATED', async (event: RuntimeEvent) => {
      // The ValidationEngine completed the tools and passed the payload here.
      // So we must call the objective resolver first before archiving.
      this.transitionTo(RuntimeState.RESOLVING);
      
      const registry = RegistryManager.loadRegistry();
      const obj = registry.find(o => o.status === 'Completed' || o.status === 'Failed') || registry[0];
      if (obj) {
        await this.resolver.resolveObjective(obj, event.payload.iterationId, 'prev_iteration');
      } else {
        await this.eventBus.publish('OBJECTIVE_SOLVED', { id: 'Mock' });
      }

      this.evidenceEngine.generateEvidencePackage(event.payload.iterationId, event.payload.evidence || {});
      this.maturityEngine.recalculateMaturity(event.payload.iterationId, null);
      await this.eventBus.publish('MATURITY_UPDATED', { iterationId: event.payload.iterationId });
    });

    this.eventBus.subscribe('MATURITY_UPDATED', async () => {
      await this.eventBus.publish('DASHBOARD_SYNC_REQUIRED', {});
      FSUtils.releaseLock(path.join(__dirname, '..', 'iteration.lock'));
      this.transitionTo(RuntimeState.IDLE);
    });

    // Core Controls
    this.eventBus.subscribe('FATAL_ERROR', async (event: RuntimeEvent) => {
      console.error(`[RuntimeKernel] Fatal Error:`, event.payload);
      this.transitionTo(RuntimeState.SHUTDOWN);
    });

    this.eventBus.subscribe('HUMAN_GATE_REQUIRED', async (event: RuntimeEvent) => {
      console.log(`[RuntimeKernel] Human Gate Required.`);
      this.transitionTo(RuntimeState.WAITING_HUMAN_GATE);
    });
  }

  public async initialize() {
    const runtimeLockPath = path.join(__dirname, '..', 'runtime.lock');
    FSUtils.clearStaleLocks(path.join(__dirname, '..'));

    if (!FSUtils.acquireLock(runtimeLockPath)) {
      console.error('[RuntimeKernel] Failed to acquire runtime lock. Is another instance running?');
      process.exit(1);
    }

    this.transitionTo(RuntimeState.BOOTING);
    console.log('[RuntimeKernel] Initializing subsystems...');
    
    // Starting the scheduler which will eventually emit TRIGGER_ITERATION
    this.scheduler.start();

    console.log('[RuntimeKernel] Initialization complete.');
    this.transitionTo(RuntimeState.IDLE);
  }

  public transitionTo(newState: RuntimeState) {
    if (this.state === RuntimeState.SHUTDOWN) {
      console.warn('[RuntimeKernel] Cannot transition from SHUTDOWN state.');
      return;
    }
    console.log(`[RuntimeKernel] State Transition: ${this.state} -> ${newState}`);
    this.state = newState;
    this.eventBus.publish('RUNTIME_STATE_CHANGED', { state: this.state }, EventPriority.HIGH);
  }

  public getState(): RuntimeState {
    return this.state;
  }

  public async shutdown() {
    console.log('[RuntimeKernel] Initiating graceful shutdown...');
    this.scheduler.stop();
    
    // Release locks
    FSUtils.releaseLock(path.join(__dirname, '..', 'runtime.lock'));
    FSUtils.releaseLock(path.join(__dirname, '..', 'iteration.lock'));

    this.transitionTo(RuntimeState.SHUTDOWN);
    console.log('[RuntimeKernel] Shutdown complete.');
  }
}
