import { Request, Response } from 'express';

class ServiceController {
  async requestService(req: Request, res: Response) {
    try {
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

export default new ServiceController();
