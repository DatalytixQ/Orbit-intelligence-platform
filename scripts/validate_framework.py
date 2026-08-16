import yaml
import sys
import os

CONTRACTS_FILE = r"C:\Users\dario\erp-intelligence-foundation\docs\orchestration\task_contracts.yaml"

def main():
    if not os.path.exists(CONTRACTS_FILE):
        print("Contracts file not found.")
        return

    with open(CONTRACTS_FILE, 'r', encoding='utf-8') as f:
        data = yaml.safe_load(f)
    
    tasks = data.get('tasks', {})
    
    # Add T005 if missing
    if 'T005' not in tasks:
        tasks['T005'] = {
            'id': 'T005',
            'owner': 'Backend Agent',
            'purpose': 'Validate JWT_SECRET at startup',
            'prerequisites': [],
            'inputs': ['backend/app.js'],
            'outputs': ['backend/app.js'],
            'artifacts': [],
            'files_to_update': ['backend/app.js'],
            'validation_criteria': 'App crashes if JWT_SECRET is default',
            'rollback_strategy': 'git checkout backend/app.js',
            'resume_point': 'Check if validation exists in app.js',
            'human_gate': 'none',
            'completion_conditions': 'Validation added and tested.'
        }
        print("Auto-fixed: Added missing T005 contract.")

    # Add missing keys to all tasks
    for tid, t in tasks.items():
        if 'model_class' not in t:
            t['model_class'] = 'Pro'  # default fallback
        if 'estimated_tokens' not in t:
            t['estimated_tokens'] = 25000
        if 'checkpoint_transition' not in t:
            t['checkpoint_transition'] = 'Update execution_log and checkpoint_state'
            
        # specifically route based on owner
        if 'Backend' in t.get('owner', ''):
            t['model_class'] = 'Pro'
        if 'Database' in t.get('owner', ''):
            t['model_class'] = 'Flash'
        if 'Documentation' in t.get('owner', ''):
            t['model_class'] = 'Flash'

    data['tasks'] = tasks
    
    with open(CONTRACTS_FILE, 'w', encoding='utf-8') as f:
        yaml.dump(data, f, sort_keys=False, allow_unicode=True)
    
    print("Auto-fixed: Added model_class, estimated_tokens, checkpoint_transition to all tasks.")

if __name__ == '__main__':
    main()
