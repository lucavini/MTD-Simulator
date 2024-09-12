import cron from 'node-cron';
import debug from '@Lib/Debug';
import * as path from 'path';
import startNewMigration, { listAllVMsName } from '../controller/tasks/createNewMigration';
import migrationState from '../controller/classes/MigrationState';
import checkRunningVMs from '../controller/tasks/getRunningVMName';
import VMState, { Status } from '../controller/classes/VMState';

const delay = migrationState.TimeBetweenMigrations;
const directoryPath = path.resolve(__dirname, '../controller/image');

class TimeModule {
  public static instance: TimeModule;

  public static cronJob: cron.ScheduledTask;

  public static timer: NodeJS.Timeout;

  public static arrayVMS: VMState[];

  public static currentVm: VMState | undefined;

  private constructor() {
    debug.info('TimeModule', 'instance created');
  }

  public static Instance(): TimeModule {
    if (!TimeModule.instance) {
      TimeModule.instance = new TimeModule();
    }
    return TimeModule.instance;
  }

  public async canStartMigration() {
    const runningVm = !!(await checkRunningVMs());

    return (
      !migrationState.MigrationIsRunning &&
      migrationState.AppIsRunning &&
      runningVm
    );
  }

  public async startMigration() {
    const isEnabled = await this.canStartMigration();

    if (isEnabled) {
      debug.info('⏰ TimeModule', 'starting new migration');
      TimeModule.currentVm?.setVMLogService(Status.Down);
      startNewMigration();
    }
  }

  public async start() {
    debug.warn('⏰ TimeModule', ' Time-based migration has been started');

    const vmsList = await listAllVMsName(directoryPath);
    TimeModule.arrayVMS = vmsList.map((vmID) => new VMState(vmID));
  }

  public async schedule() {
    debug.warn('⏰ TimeModule', 'new migration scheduled');

    const runningVm = await checkRunningVMs();

    TimeModule.currentVm = TimeModule.arrayVMS.find((vm) => vm.vmID === runningVm);
    TimeModule.currentVm?.setVMLogService(Status.Up);

    clearTimeout(TimeModule.timer);

    TimeModule.timer = setTimeout(async () => {
      await this.startMigration();
    }, delay);
  }
}

export default TimeModule;
