import cron from 'node-cron';
import debug from '@Lib/Debug';
import startNewMigration from '../controller/tasks/createNewMigration';
import globalMigration from '../controller/tasks/GlobalMigration';
import checkRunningVMs from '../controller/tasks/getRunningVMName';

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
    return (
      !globalMigration.MigrationIsRunning
      && globalMigration.AppIsRunning
      && !!(await checkRunningVMs())
    );
  }

  public async migrationTask() {
    const enabled = await this.canStartMigration();

    if (enabled) {
      debug.info('⏰ TimeModule', 'starting new migration');
      startNewMigration();
    }
  }

  public start() {
    debug.warn('⏰ TimeModule', ' Time-based migration has been scheduled');
    // TimeModule.cronJob = cron.schedule('*/15 * * * * *', async () => {
    //   await this.migrationTask();
    //   // console.log('rodou');
    // });

    TimeModule.timer = setTimeout(async () => {
      await this.migrationTask();
    }, 15000);
  }

  public stop() {
    debug.warn('⏰ TimeModule', ' Time-based migration rescheduled');
    // TimeModule.cronJob.stop();
    clearTimeout(TimeModule.timer);

    TimeModule.timer = setTimeout(async () => {
      await this.migrationTask();
    }, 15000);
  }
}

export default TimeModule;
