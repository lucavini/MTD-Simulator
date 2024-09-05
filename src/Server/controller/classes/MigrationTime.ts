import * as path from 'path';
import { exec } from 'child_process';

const directoryPath = path.resolve(__dirname, '../');

class MigrationTime {
  serviceUp(vmId?: string) {
    exec('pkill datalog.sh');
    exec(`${directoryPath}/scripts/datalog.sh 1 ${vmId}`);
  }

  serviceDown(vmId?: string) {
    exec('pkill datalog.sh');
    exec(`${directoryPath}/scripts/datalog.sh 0 ${vmId}`);
  }
}

const migrationTime = new MigrationTime();

export default migrationTime;
