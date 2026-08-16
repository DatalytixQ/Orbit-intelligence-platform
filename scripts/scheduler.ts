import { EventEmitter } from 'events';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import { RuntimeState } from './runtime_kernel';

export interface SchedulerConfig {
  cronIntervalMs: number;
  cooldownMs: number;
  backoffMultiplier: number;
  maxBackoffMs: number;
}

export class SmartScheduler {
  private eventBus: EventEmitter;
  private config: SchedulerConfig;
  private executionLock: boolean = false;
  private lastExecutionTime: number = 0;
  private currentBackoff: number = 0;
  private cronTimer: NodeJS.Timeout | null = null;
  private fsWatcher: fs.FSWatcher | null = null;

  // Queues
  private retryQueue: string[] = [];
  private humanGateQueue: string[] = [];

  constructor(eventBus: EventEmitter, config?: Partial<SchedulerConfig>) {
    this.eventBus = eventBus;
    this.config = {
      cronIntervalMs: 60000,
      cooldownMs: 5000,
      backoffMultiplier: 2,
      maxBackoffMs: 3600000,
      ...config
    };
    this.setupListeners();
  }

  private setupListeners() {
    this.eventBus.on('STATE_CHANGE', (state: RuntimeState) => {
      if (state === RuntimeState.IDLE) {
        this.releaseLock();
      } else if (state === RuntimeState.SHUTDOWN) {
        this.stop();
      }
    });

    this.eventBus.on('HUMAN_GATE_REQUIRED', (objectiveId: string) => {
      if (!this.humanGateQueue.includes(objectiveId)) {
        this.humanGateQueue.push(objectiveId);
      }
    });

    this.eventBus.on('OBJECTIVE_FAILED', (objectiveId: string) => {
      if (!this.retryQueue.includes(objectiveId)) {
        this.retryQueue.push(objectiveId);
      }
      this.increaseBackoff();
    });

    this.eventBus.on('OBJECTIVE_SOLVED', () => {
      this.resetBackoff();
    });
  }

  public start() {
    console.log('[Scheduler] Starting Smart Scheduler...');
    this.startCron();
    this.startFilesystemWatch();
    this.startGitWatch(); // Simulated via interval polling in this scaffold
  }

  public stop() {
    console.log('[Scheduler] Stopping Smart Scheduler...');
    if (this.cronTimer) clearInterval(this.cronTimer);
    if (this.fsWatcher) this.fsWatcher.close();
  }

  private startCron() {
    this.cronTimer = setInterval(() => {
      this.attemptTrigger('CRON');
    }, this.config.cronIntervalMs);
  }

  private startFilesystemWatch() {
    const srcDir = path.join(__dirname, '..', 'frontend');
    if (fs.existsSync(srcDir)) {
      this.fsWatcher = fs.watch(srcDir, { recursive: true }, (eventType, filename) => {
        // Debounce logic would go here
        this.attemptTrigger(`FS_EVENT: ${filename}`);
      });
    }
  }

  private startGitWatch() {
    // Scaffold for watching git changes (e.g. polling `git log -1 --format=%H`)
    setInterval(() => {
      try {
        const hash = execSync('git rev-parse HEAD').toString().trim();
        // Check if hash changed from memory state...
      } catch (e) {
        // Not a git repo or no git installed
      }
    }, 60000);
  }

  private attemptTrigger(source: string) {
    const now = Date.now();

    // 1. Execution Lock Check
    if (this.executionLock) {
      console.log(`[Scheduler] Trigger ignored (${source}): Lock is active.`);
      return;
    }

    // 2. Cooldown Check
    if (now - this.lastExecutionTime < this.config.cooldownMs) {
      return;
    }

    // 3. Backoff Check (if runtime is failing repeatedly, we slow down execution)
    if (now - this.lastExecutionTime < this.currentBackoff) {
      console.log(`[Scheduler] Trigger ignored (${source}): In backoff period (${this.currentBackoff}ms).`);
      return;
    }

    // 4. Human Gate Check (if blocked, we shouldn't run autonomously until cleared)
    if (this.humanGateQueue.length > 0) {
      console.log(`[Scheduler] Trigger ignored: Blocked by ${this.humanGateQueue.length} Human Gates.`);
      return;
    }

    this.triggerExecution(source);
  }

  private triggerExecution(source: string) {
    console.log(`[Scheduler] Acquiring lock. Triggered by: ${source}`);
    this.executionLock = true;
    this.lastExecutionTime = Date.now();
    this.eventBus.emit('TRIGGER_ITERATION');
  }

  public releaseLock() {
    if (this.executionLock) {
      console.log('[Scheduler] Execution lock released.');
      this.executionLock = false;
    }
  }

  private increaseBackoff() {
    if (this.currentBackoff === 0) {
      this.currentBackoff = this.config.cooldownMs;
    } else {
      this.currentBackoff = Math.min(this.currentBackoff * this.config.backoffMultiplier, this.config.maxBackoffMs);
    }
    console.log(`[Scheduler] Backoff increased to ${this.currentBackoff}ms`);
  }

  private resetBackoff() {
    if (this.currentBackoff > 0) {
      console.log('[Scheduler] Backoff reset to 0ms');
      this.currentBackoff = 0;
    }
  }

  public resolveHumanGate(objectiveId: string) {
    this.humanGateQueue = this.humanGateQueue.filter(id => id !== objectiveId);
    console.log(`[Scheduler] Human Gate resolved for ${objectiveId}`);
    if (this.humanGateQueue.length === 0) {
      this.attemptTrigger('HUMAN_GATE_CLEARED');
    }
  }
}
