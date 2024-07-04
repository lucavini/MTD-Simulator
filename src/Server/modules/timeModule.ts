import cron from 'node-cron';
import debug from '@Lib/Debug';
import startNewMigration from '../controller/tasks/createNewMigration';
import globalMigration from '../controller/tasks/GlobalMigration';
import checkRunningVMs from '../controller/tasks/getRunningVMName';

class TimeModule {
  public static instance: TimeModule;

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

  public start() {
    debug.warn('⏰ TimeModule', ' Time-based migration has been scheduled');
    cron.schedule('*/15 * * * * *', async () => {
      const enabled = await this.canStartMigration();

      if (enabled) {
        debug.info('⏰ TimeModule', 'starting new migration');
        startNewMigration();
      }
    });
  }
}

export default TimeModule;
