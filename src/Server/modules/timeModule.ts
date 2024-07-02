import cron from 'node-cron';
import debug from '@Lib/Debug';
import startNewMigration from '../controller/tasks/createNewMigration';

class TimeModule {
  private static instance: TimeModule;

  private constructor() {
    debug.info('TimeModule', 'instance created');
  }

  public static Instance(): TimeModule {
    if (!TimeModule.instance) {
      TimeModule.instance = new TimeModule();
    }

    return TimeModule.instance;
  }

  public Refresh() {
    cron.schedule('*/15 * * * * *', () => {
      debug.warn('⏰ TimeModule', ' Time-based migration has started');
      startNewMigration();
    });
  }
}

const timeModule = TimeModule.Instance();

export default timeModule;
