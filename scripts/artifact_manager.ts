import * as fs from 'fs';
import * as path from 'path';
import { FSUtils } from './fs_utils';

export class ArtifactManager {
  private static getArtifactsRootDir() {
    return path.join(__dirname, '..', 'artifacts');
  }

  public static initializeIteration(iterationId: string) {
    const rootDir = this.getArtifactsRootDir();
    if (!fs.existsSync(rootDir)) {
      fs.mkdirSync(rootDir, { recursive: true });
    }

    const iterDir = path.join(rootDir, iterationId);
    if (!fs.existsSync(iterDir)) {
      fs.mkdirSync(iterDir, { recursive: true });
    }

    const folders = [
      'build',
      'logs',
      'screenshots',
      'playwright',
      'lighthouse',
      'accessibility',
      'security',
      'database',
      'coverage',
      'performance',
      'telemetry',
      'reports',
      'manifest'
    ];

    for (const folder of folders) {
      const target = path.join(iterDir, folder);
      if (!fs.existsSync(target)) {
        fs.mkdirSync(target);
      }
    }
    console.log(`[ArtifactManager] Successfully scaffolded directory tree for ${iterationId}`);
  }

  public static writeArtifact(iterationId: string, folder: string, filename: string, content: string | object) {
    const targetPath = path.join(this.getArtifactsRootDir(), iterationId, folder, filename);
    const data = typeof content === 'string' ? content : JSON.stringify(content, null, 2);
    FSUtils.atomicWriteSync(targetPath, data);
  }
}
