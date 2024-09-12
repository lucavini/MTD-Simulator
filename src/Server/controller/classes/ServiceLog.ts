import * as path from 'path';
import * as fs from 'fs';
import debug from '@Root/src/Lib/Debug';

interface ObjectLog {
  vmID: string;
  statusType: 'serviceUp' | 'serviceDown';
  intervalID: NodeJS.Timeout;
}
class ServiceLog {
  private static instance: ServiceLog;

  private arrayIntervals: ObjectLog[] = [];

  public static Instance(): ServiceLog {
    if (!ServiceLog.instance) {
      ServiceLog.instance = new ServiceLog();
    }

    return ServiceLog.instance;
  }

  private constructor() {
    debug.info('ServiceLog', 'instance created');
  }

  appendToCSV = (isServiceUp: number, vmID: string) => {
    const filePath = path.join(__dirname, `../Data/${vmID}.csv`);

    // gets the last second written in file
    const second = this.getLastSecond(filePath) + 1;

    const data = {
      second,
      IsServiceUp: isServiceUp,
      vmID,
    };

    const row = `${data.second},${data.IsServiceUp},${data.vmID}\n`;

    if (!fs.existsSync(filePath)) {
      const header = 'second,IsServiceUp,vmID\n';
      fs.writeFileSync(filePath, header);
    }

    fs.appendFileSync(filePath, row);
  };

  serviceUp = (vmID: string) => {
    this.stopLogging(vmID, 'serviceDown');

    const intervalID = setInterval(() => {
      this.appendToCSV(1, vmID);
    }, 1000);

    const interval: ObjectLog = {
      vmID,
      intervalID,
      statusType: 'serviceUp',
    };

    this.arrayIntervals.push(interval);
  };

  serviceDown = (vmID: string) => {
    this.stopLogging(vmID, 'serviceUp');

    const intervalID = setInterval(() => {
      this.appendToCSV(0, vmID);
    }, 1000);

    const interval: ObjectLog = {
      vmID,
      intervalID,
      statusType: 'serviceDown',
    };

    this.arrayIntervals.push(interval);
  };

  stopLogging = (vmID: string, statusType: string) => {
    this.arrayIntervals.filter((objectLog) => {
      if (objectLog.vmID === vmID && objectLog.statusType === statusType) {
        clearInterval(objectLog.intervalID);
        return false;
      }

      return true;
    });
  };

  getLastSecond(filePath: string): number {
    if (!fs.existsSync(filePath)) {
      return 0;
    }

    const data = fs.readFileSync(filePath, 'utf-8');
    const lines = data.trim().split('\n');

    if (lines.length > 1) {
      const lastLine = lines[lines.length - 1];
      const lastSecond = parseInt(lastLine.split(',')[0], 10);
      return !isNaN(lastSecond) ? lastSecond : 0;
    }

    return 0;
  }
}

const serviceLog = ServiceLog.Instance();

export default serviceLog;
