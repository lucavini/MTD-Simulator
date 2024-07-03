import { NextFunction, Request, Response } from 'express';
import debug from '@Lib/Debug';
import wait from '@Root/src/Utils/wait';
import globalMigration from '../controller/tasks/GlobalMigration';

const migrationHandler = async (req: Request, res: Response, next: NextFunction) => {
  // hold the request while migration is running
  while (globalMigration.MigrationIsRunning) {
    debug.info('migrationHandler', `${req.ip} is waiting the migration finish`);
    await wait(1000);
  }

  next();
};

export default migrationHandler;
