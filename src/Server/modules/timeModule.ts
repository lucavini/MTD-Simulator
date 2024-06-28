import cron from 'node-cron';
import debug from '@Lib/Debug';
import startNewMigration from '../controller/tasks/createNewMigration';

class TimeModule {
  Refresh() {
    cron.schedule('*/15 * * * * *', () => {
      debug.warn('⏰ TimeModule', ' Time-based migration has started');
      startNewMigration();
    });
  }
}

export default new TimeModule();
