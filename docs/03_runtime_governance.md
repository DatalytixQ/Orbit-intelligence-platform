# RUNTIME GOVERNANCE

## 1. Runtime Version
The ERP Intelligence Foundation operates on **Runtime v2.4**. The runtime architecture is permanently frozen.

## 2. Process Orchestration
- **Node.js**: The Express broker runs as an isolated process mapping Database Views to HTTP JSON payloads.
- **Next.js**: The Frontend runs as a separate process handling all UI composition, hydration, and routing.

## 3. Communication Protocols
- The Frontend `fetch` mechanisms must target the Next.js API Proxy (`/api/*`), which handles security, session mapping, and forwards the request to the Node.js broker.
- Direct Frontend to Database connections are strictly forbidden.

## 4. Execution Loop Constraints
Any new background jobs, campaigns, or automated data loops must execute asynchronously. The UI thread and the main API event loop must remain unblocked at all times to guarantee 0-latency executive interactions.
