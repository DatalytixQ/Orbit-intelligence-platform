const fs = require('fs');
const path = require('path');

const ORCH_DIR = path.join(__dirname, '../docs/orchestration');
const MASTER_PLAN = path.join(__dirname, '../docs/agents/platform/product-intelligence/master_execution_plan_v2.md');
const MANIFEST_YAML = path.join(ORCH_DIR, 'execution_manifest.yaml');
const CONTRACTS_YAML = path.join(ORCH_DIR, 'task_contracts.yaml');
const ARTIFACT_REGISTRY = path.join(ORCH_DIR, 'artifact_registry.yaml');

// Ensure YAML dump works without modules by constructing it manually, or if simple enough
const content = fs.readFileSync(MASTER_PLAN, 'utf-8');
const lines = content.split('\n');

let currentWave = null;
let currentEpic = null;
const waves = {};
const tasksMap = {};

// Simple Markdown Table parser
const tableRegex = /^\|([A-Z0-9a-z\s]+)\|(.+)\|(.+)\|(.+)\|(.+)\|(.+)\|(.+)\|$/;

for (let line of lines) {
    if (line.startsWith('## WAVE ')) {
        const match = line.match(/## WAVE (\d+) — (.+)/);
        if (match) {
            currentWave = `wave_${match[1]}`;
            waves[currentWave] = {
                name: match[2].trim(),
                milestone: `M${match[1]}`,
                completion_criteria: [],
                status: match[1] === "0" ? "Completed" : "Not Started",
                allowed_transitions: [`wave_${parseInt(match[1]) + 1}`],
                dependencies: match[1] === "0" ? [] : [`wave_${parseInt(match[1]) - 1}`],
                tasks: []
            };
        }
    }
    
    if (line.startsWith('|')) {
        const parts = line.split('|').map(s => s.trim());
        if (parts.length > 7 && parts[1].match(/^[A-Z]\d{3}[a-z]?$/)) {
            const id = parts[1];
            let name = parts[2];
            name = name.replace(/~~/g, '').trim(); // Remove strike-through
            const agent = parts[4];
            let rawDeps = parts[6];
            let deps = rawDeps !== 'None' && rawDeps !== '—' ? rawDeps.split(',').map(d => d.trim()) : [];
            
            if (id) {
                tasksMap[id] = { id, name, agent, deps, wave: currentWave };
                if (currentWave && waves[currentWave]) {
                    waves[currentWave].tasks.push(id);
                }
            }
        }
    }
}

// Write tasks into manifest
let manifestContent = `# Execution Manifest v1.3\n# Source of truth for Roadmap orchestration\n\nroadmap:\n`;
for (let [wId, w] of Object.entries(waves)) {
    if (!wId) continue;
    manifestContent += `  ${wId}:\n`;
    manifestContent += `    name: "${w.name.replace(/"/g, "'")}"\n`;
    manifestContent += `    milestone: "${w.milestone}"\n`;
    manifestContent += `    status: "${w.status}"\n`;
    manifestContent += `    dependencies: ${JSON.stringify(w.dependencies)}\n`;
    manifestContent += `    tasks:\n`;
    for (let tid of w.tasks) {
        let taskStatus = "Not Started";
        if (["N001", "N002", "T001", "T002", "T003", "T004", "T005", "T006"].includes(tid)) {
            taskStatus = "Completed";
        }
        manifestContent += `      - id: "${tid}"\n`;
        manifestContent += `        status: "${taskStatus}"\n`;
        manifestContent += `        dependencies: ${JSON.stringify(tasksMap[tid].deps)}\n`;
    }
    manifestContent += `\n`;
}
fs.writeFileSync(MANIFEST_YAML, manifestContent);

// Update Contracts
let contractsContent = fs.readFileSync(CONTRACTS_YAML, 'utf-8');
for (let [tid, t] of Object.entries(tasksMap)) {
    if (!contractsContent.includes(`  ${tid}:`)) {
        let agent = t.agent || 'Backend Agent';
        if (agent === '—') agent = 'Backend Agent';
        
        contractsContent += `\n  ${tid}:\n`;
        contractsContent += `    id: "${tid}"\n`;
        contractsContent += `    owner: "${agent}"\n`;
        contractsContent += `    purpose: "${t.name.replace(/"/g, "'")}"\n`;
        contractsContent += `    prerequisites: ${JSON.stringify(t.deps)}\n`;
        contractsContent += `    inputs: ["system/*"]\n`;
        contractsContent += `    outputs: ["system/*"]\n`;
        contractsContent += `    artifacts: []\n`;
        contractsContent += `    files_to_update: []\n`;
        contractsContent += `    validation_criteria: "Pending explicit validation"\n`;
        contractsContent += `    rollback_strategy: "git checkout"\n`;
        contractsContent += `    resume_point: "Check implementation state"\n`;
        contractsContent += `    human_gate: "none"\n`;
        contractsContent += `    completion_conditions: "Task executed successfully"\n`;
        contractsContent += `    model_class: "Pro"\n`;
        contractsContent += `    estimated_tokens: 25000\n`;
        contractsContent += `    checkpoint_transition: "Update checkpoint state"\n`;
    }
}
fs.writeFileSync(CONTRACTS_YAML, contractsContent);

// Count
const totalTasks = Object.keys(tasksMap).length;
const completedTasks = ["N001", "N002", "T001", "T002", "T003", "T004", "T005", "T006"].length;
const remainingTasks = totalTasks - completedTasks;

const reports = `
Remaining Tasks: ${remainingTasks}
Total Tasks: ${totalTasks}
Estimated Token Consumption: ${remainingTasks * 25000}
`;

fs.writeFileSync(path.join(__dirname, 'metrics.txt'), reports);
console.log("Upgraded framework to v1.3");
