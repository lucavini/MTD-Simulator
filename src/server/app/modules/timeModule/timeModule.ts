import cron from 'node-cron';
import debug from '../../../../lib/Debug';

class TimeModule {
  Refresh() {
    cron.schedule('*/1 * * * * *', () => {
      debug.warn('⏰ TimeModule', ' Time-based migration has started');
    });
  }
}

export default new TimeModule();
