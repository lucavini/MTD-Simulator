import debug from '@Lib/Debug';
import AttackStatus from './AttackStatus';
import serviceLog from './ServiceLog';

export enum Status {
  Up = 'Up',
  Down = 'Down',
}

class VMState {
  private vmID: string;

  private attackStatus: AttackStatus;

  public constructor(vmID: string) {
    this.vmID = vmID;
    this.attackStatus = new AttackStatus();
    serviceLog.serviceDown(this.vmID);
    debug.info('VMState', `${vmID} instance created`);
  }

  public get status() {
    return this.attackStatus;
  }

  public get Id() {
    return this.vmID;
  }

  public stopAllLogging() {
    serviceLog.stopAllLogging();
  }

  public setVMLogService(statusType: Status) {
    debug.info(this.vmID, `${statusType}`);
    if (statusType === Status.Up) {
      serviceLog.serviceUp(this.vmID);
    }

    if (statusType === Status.Down) {
      serviceLog.serviceDown(this.vmID);
    }
  }
}

export default VMState;
