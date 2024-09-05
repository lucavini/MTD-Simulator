import { NextFunction, Request, Response } from 'express';
import wait from '@Root/src/Utils/wait';
import migrationState from '../controller/classes/MigrationState';

const migrationHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // hold the request while migration is running
  while (migrationState.MigrationIsRunning || !migrationState.AppIsRunning) {
    // debug.info('migrationHandler', `${req.ip} is waiting the migration finish`);
    await wait(1000);
  }

  next();
};

export default migrationHandler;
