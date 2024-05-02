import { NextFunction, Request, Response } from 'express';
import timeModule from '../modules/timeModule/timeModule';

const migrationHandler = (req: Request, res: Response, next: NextFunction) => {
  timeModule.Refresh();
  next();
};

export default migrationHandler;
