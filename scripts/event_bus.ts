export enum EventPriority {
  LOW = 0,
  NORMAL = 1,
  HIGH = 2,
  CRITICAL = 3
}

export interface RuntimeEvent {
  id: string;
  type: string;
  priority: EventPriority;
  payload: any;
  timestamp: number;
  retryCount: number;
}

type EventHandler = (event: RuntimeEvent) => Promise<void> | void;

export class EventBus {
  private handlers: Map<string, EventHandler[]> = new Map();
  private deadLetterQueue: RuntimeEvent[] = [];
  private maxRetries: number = 3;

  // Subscribe to an event topic
  public subscribe(type: string, handler: EventHandler) {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, []);
    }
    this.handlers.get(type)!.push(handler);
  }

  // Alias for compatibility
  public on(type: string, handler: any) {
    this.subscribe(type, handler);
  }

  // Publish an event (processed immediately or asynchronously based on handlers)
  public async publish(type: string, payload: any, priority: EventPriority = EventPriority.NORMAL) {
    const event: RuntimeEvent = {
      id: `EVT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type,
      priority,
      payload,
      timestamp: Date.now(),
      retryCount: 0
    };

    await this.dispatch(event);
  }

  // Alias for compatibility
  public emit(type: string, ...args: any[]) {
    this.publish(type, args.length > 0 ? args[0] : {});
  }

  // Internal dispatcher with retry and DLQ logic
  private async dispatch(event: RuntimeEvent) {
    const topicHandlers = this.handlers.get(event.type) || [];
    
    if (topicHandlers.length === 0) {
      console.warn(`[EventBus] No handlers registered for event: ${event.type}. Sending to DLQ.`);
      this.moveToDeadLetterQueue(event);
      return;
    }

    // Execute handlers. If an error occurs, we catch it and trigger retry logic.
    for (const handler of topicHandlers) {
      try {
        await handler(event);
      } catch (error) {
        console.error(`[EventBus] Handler failed for event ${event.id} of type ${event.type}:`, error);
        await this.handleFailure(event);
      }
    }
  }

  private async handleFailure(event: RuntimeEvent) {
    event.retryCount += 1;
    if (event.retryCount <= this.maxRetries) {
      console.log(`[EventBus] Retrying event ${event.id} (Attempt ${event.retryCount} of ${this.maxRetries})`);
      // Simple exponential backoff for retry
      const backoffMs = Math.pow(2, event.retryCount) * 100;
      await new Promise(resolve => setTimeout(resolve, backoffMs));
      await this.dispatch(event);
    } else {
      console.error(`[EventBus] Event ${event.id} exhausted retries. Moving to DLQ.`);
      this.moveToDeadLetterQueue(event);
    }
  }

  private moveToDeadLetterQueue(event: RuntimeEvent) {
    this.deadLetterQueue.push(event);
    console.log(`[EventBus] DLQ size: ${this.deadLetterQueue.length}`);
  }

  public getDeadLetterQueue(): RuntimeEvent[] {
    return [...this.deadLetterQueue];
  }

  public clearDeadLetterQueue() {
    this.deadLetterQueue = [];
  }
}
