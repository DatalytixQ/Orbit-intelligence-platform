import * as fs from 'fs';
import * as yaml from 'js-yaml';
import * as path from 'path';
import { FSUtils } from './fs_utils';

export interface Objective {
  id: string;
  version: number;
  title: string;
  description: string;
  category: string;
  severity: string;
  priority_score: number;
  business_value: number;
  technical_value: number;
  security_value: number;
  ux_value: number;
  performance_value: number;
  estimated_effort: string;
  dependencies: string[];
  affected_modules: string[];
  discovered_by: string;
  discovered_at: string;
  expected_maturity_gain: number;
  actual_maturity_gain?: number;
  automatic_validation_required: string[];
  manual_validation_required: string[];
  screenshots_before?: string[];
  screenshots_after?: string[];
  build_report?: string;
  playwright_report?: string;
  lighthouse_report?: string;
  accessibility_report?: string;
  security_report?: string;
  database_report?: string;
  evidence_links: string[];
  retry_count: number;
  failure_count: number;
  execution_history: string[];
  status: 'Pending' | 'In Progress' | 'Completed' | 'Failed' | 'Cancelled';
  auto_close_conditions: string[];
  reopen_conditions: string[];
}

const REGISTRY_PATH = path.join(__dirname, '..', 'docs', 'orchestration', 'objective_registry.yaml');

export class RegistryManager {
  static loadRegistry(): Objective[] {
    if (!fs.existsSync(REGISTRY_PATH)) {
      return [];
    }
    const fileContents = fs.readFileSync(REGISTRY_PATH, 'utf8');
    try {
      const data = yaml.load(fileContents) as any;
      return data?.objectives || [];
    } catch (e) {
      console.error('Failed to parse objective registry', e);
      return [];
    }
  }

  static saveRegistry(objectives: Objective[]) {
    const fileContents = yaml.dump({
      version: '2.3.1',
      last_updated: new Date().toISOString(),
      objectives
    });
    FSUtils.atomicWriteSync(REGISTRY_PATH, fileContents);
  }

  static addOrUpdateObjective(obj: Partial<Objective>): Objective {
    const registry = this.loadRegistry();
    const existingIndex = registry.findIndex(o => o.id === obj.id || (o.title === obj.title && o.category === obj.category));
    
    let targetObj: Objective;
    if (existingIndex >= 0) {
      targetObj = { ...registry[existingIndex], ...obj, version: (registry[existingIndex].version || 1) + 1 };
      registry[existingIndex] = targetObj;
    } else {
      targetObj = {
        id: obj.id || `OBJ-AUTO-${Date.now()}`,
        version: 1,
        title: 'Auto Discovered',
        description: '',
        category: 'Uncategorized',
        severity: 'Medium',
        priority_score: 10,
        business_value: 0,
        technical_value: 0,
        security_value: 0,
        ux_value: 0,
        performance_value: 0,
        estimated_effort: '1h',
        dependencies: [],
        affected_modules: [],
        discovered_by: 'Runtime',
        discovered_at: new Date().toISOString(),
        expected_maturity_gain: 1,
        automatic_validation_required: [],
        manual_validation_required: [],
        evidence_links: [],
        retry_count: 0,
        failure_count: 0,
        execution_history: [],
        status: 'Pending',
        auto_close_conditions: [],
        reopen_conditions: [],
        ...obj,
      };
      registry.push(targetObj);
    }

    this.saveRegistry(registry);
    return targetObj;
  }
}
