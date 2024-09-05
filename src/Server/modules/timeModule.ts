import cron from 'node-cron';
import debug from '@Lib/Debug';
import startNewMigration from '../controller/tasks/createNewMigration';
import migrationState from '../controller/classes/MigrationState';
import checkRunningVMs from '../controller/tasks/getRunningVMName';
import serviceLog from '../controller/classes/ServiceLog';

const delay = 5 * 60 * 1000;
// const delay = 5000;

class TimeModule {
  public static instance: TimeModule;

  public static cronJob: cron.ScheduledTask;

  public static timer: NodeJS.Timeout;

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
    const enabled = await this.canStartMigration();
    const runningVm = await checkRunningVMs();

    if (enabled) {
      debug.info('⏰ TimeModule', 'starting new migration');
      serviceLog.serviceDown(runningVm);
      startNewMigration();
    }
  }

  public async start() {
    debug.warn('⏰ TimeModule', ' Time-based migration has been scheduled');

    TimeModule.timer = setTimeout(async () => {
      await this.startMigration();
    }, delay);
  }

  public async stop() {
    debug.warn('⏰ TimeModule', ' Time-based migration rescheduled');

    const runningVm = await checkRunningVMs();
    serviceLog.serviceUp(runningVm);

    clearTimeout(TimeModule.timer);

    TimeModule.timer = setTimeout(async () => {
      await this.startMigration();
    }, delay);
  }
}

export default TimeModule;
