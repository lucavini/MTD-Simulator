import debug from '@Root/src/Lib/Debug';
import * as path from 'path';
import { exec } from 'child_process';

const directoryPath = path.resolve(__dirname, '../');

class GetDataLogs {
  start() {
    exec(`${directoryPath}/scripts/datalog.sh`, (error, stdout) => {
      if (error) {
        debug.error('datalog script', `error: ${error}`);
        return;
      }
      if (stdout) {
        debug.info('datalog script', `stdout: ${stdout}`);
      }
    });
  }
}

export default new GetDataLogs();
