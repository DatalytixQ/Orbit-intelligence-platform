const fs = require('fs');
const path = require('path');

const ROOT = 'c:/Users/dario/erp-intelligence-foundation';

const patterns = [
    'data_pipeline_step_log',
    'pipeline_log',
    'etl_log',
    'etl_step',
    'sync_log',
    'job_log',
    'job_execution',
    'execution_log',
    'task_log',
    'workflow_log',
    'pipeline_execution',
    'pipeline_history',
    'sync_history',
    'scheduler_log',
    'background_job_log',
    'queue_log',
    'process_log',
    'audit_execution',
    'step_log',
    'data_pipeline',
    'system_log',
    'audit_log'
];

let results = {};
patterns.forEach(p => results[p] = []);

function searchDir(dir) {
    if (dir.includes('.git') || dir.includes('node_modules') || dir.includes('.vs')) return;
    const items = fs.readdirSync(dir);
    for (let item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            searchDir(fullPath);
        } else if (stat.isFile()) {
            // only check text-like files
            if (!fullPath.match(/\.(js|ts|jsx|tsx|sql|md|yaml|yml|json|txt)$/)) continue;
            
            try {
                const content = fs.readFileSync(fullPath, 'utf8');
                const lowerContent = content.toLowerCase();
                for (let pattern of patterns) {
                    if (lowerContent.includes(pattern.toLowerCase())) {
                        results[pattern].push(fullPath.replace(ROOT, ''));
                    }
                }
            } catch (e) {}
        }
    }
}

searchDir(ROOT);

console.log(JSON.stringify(results, null, 2));
