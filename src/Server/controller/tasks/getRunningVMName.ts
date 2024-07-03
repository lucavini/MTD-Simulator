import { exec } from 'child_process';
import globalMigration from './GlobalMigration';

const checkRunningVMs = (): Promise<string> => new Promise((resolve, reject) => {
  globalMigration.setCurrentRunningVM(undefined);

  exec('virsh list', (error, stdout, stderr) => {
    if (error) {
      reject(error);
      return;
    }
    if (stderr) {
      reject(stderr);
      return;
    }

    const lines = stdout.trim().split('\n').slice(2);

    const runningVMNames = lines.map((line) => {
      const parts = line.trim().split(/\s+/);
      return parts[1];
    });

    globalMigration.setCurrentRunningVM(runningVMNames[0]);
    resolve(runningVMNames[0]);
  });
});

export default checkRunningVMs;
