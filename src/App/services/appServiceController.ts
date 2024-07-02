import debug from '@Lib/Debug';
import { Request, Response } from 'express';

class AppServiceController {
  async requestService(req: Request, res: Response) {
    try {
      debug.info('AppServiceController', 'service provided successfully');

      res.json({
        message: 'success',
      });
    } catch (error) {
      res.status(400).json({
        message: 'error',
      });
    }
  }
}

export default new AppServiceController();
