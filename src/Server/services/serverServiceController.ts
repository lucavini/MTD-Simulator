import { Request, Response } from 'express';
import axios from 'axios';
import debug from '@Lib/Debug';

const appPort = process.env.APP_PORT;
const appURL = process.env.APP_URL;

class ServerServiceController {
  async requestService(req: Request, res: Response) {
    try {
      const response = await axios.get(`http://${appURL}:${appPort}/app`);
      debug.info('ServerServiceController', 'request redirected successfully');
      res.json(response.data);
    } catch (err) {
      res.status(400).json({
        error: err,
      });
    }
  }
}

export default new ServerServiceController();
