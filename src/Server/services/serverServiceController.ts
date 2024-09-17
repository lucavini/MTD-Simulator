import { Request, Response } from 'express';
import axios from 'axios';
// import debug from '@Lib/Debug';
import TimeModule from '../modules/timeModule';

const appPort = process.env.APP_PORT;
const appURL = process.env.APP_URL;

class ServerServiceController {
  async requestService(req: Request, res: Response) {
    if (TimeModule.currentVm?.status?.isVMCompromised) {
      return res.status(400).json({
        error: 'error',
      });
    }

    try {
      const response = await axios.get(`http://${appURL}:${appPort}/app`);
      // debug.info('ServerServiceController', 'request redirected successfully');
      return res.json(response.data);
    } catch (err) {
      return res.status(400).json({
        error: err,
      });
    }
  }
}

export default new ServerServiceController();
