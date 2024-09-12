import AttackStatus from './AttackStatus';
import serviceLog from './ServiceLog';

export enum Status {
  Up = 'Up',
  Down = 'Down',
}

class VMState {
  private static vmID: string;

  private static attackStatus: AttackStatus;

  public constructor(vmID: string) {
    VMState.vmID = vmID;
    VMState.attackStatus = new AttackStatus(0);
    serviceLog.serviceDown(VMState.vmID);
  }

  public get getStatus() {
    return VMState.attackStatus.isVMCompromised;
  }

  public get vmID() {
    return VMState.vmID;
  }

  public setVMLogService(statusType: Status) {
    if (statusType === Status.Up) {
      serviceLog.serviceUp(VMState.vmID);
    }

    if (statusType === Status.Down) {
      serviceLog.serviceDown(VMState.vmID);
    }
  }
}

export default VMState;
