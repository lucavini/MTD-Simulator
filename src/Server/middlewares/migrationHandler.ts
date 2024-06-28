import { NextFunction, Request, Response } from 'express';
import timeModule from '@Modules/timeModule';

const migrationHandler = (req: Request, res: Response, next: NextFunction) => {
  timeModule.Refresh();
  next();
};

export default migrationHandler;
