import * as fs from 'fs';
import * as path from 'path';

export class FSUtils {
  /**
   * Safely writes a file by writing to a temporary file first and renaming.
   * Ensures no partial files exist if the process crashes mid-write.
   */
  public static atomicWriteSync(filePath: string, data: string | Buffer) {
    const tmpPath = `${filePath}.${Date.now()}.tmp`;
    fs.writeFileSync(tmpPath, data);
    fs.renameSync(tmpPath, filePath);
  }

  /**
   * Attempts to acquire a lock file. Returns false if already locked.
   */
  public static acquireLock(lockPath: string): boolean {
    if (fs.existsSync(lockPath)) {
      return false; // Locked
    }
    try {
      fs.writeFileSync(lockPath, process.pid.toString(), { flag: 'wx' });
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Releases a lock file.
   */
  public static releaseLock(lockPath: string) {
    if (fs.existsSync(lockPath)) {
      try {
        fs.unlinkSync(lockPath);
      } catch (e) {
        console.error(`[FSUtils] Failed to release lock at ${lockPath}:`, e);
      }
    }
  }

  /**
   * Forcefully removes stale locks during crash recovery boot.
   */
  public static clearStaleLocks(dir: string) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
      if (file.endsWith('.lock')) {
        const lockPath = path.join(dir, file);
        console.warn(`[FSUtils] Removing stale lock file: ${lockPath}`);
        fs.unlinkSync(lockPath);
      }
    }
  }
}
