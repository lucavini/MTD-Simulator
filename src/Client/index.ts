import '../../path.config';
import express from 'express';
import cron from 'node-cron';
import debug from '@Lib/Debug';
import getData from './services/requestService';

const app = express();
const port = process.env.CLIENT_PORT;

app.use(express.json());

const clientRequestService = () => {
  cron.schedule('*/5 * * * * *', () => {
    debug.info('clientRequestService', 'client requested service to proxy');
    getData();
  });
};

app.listen(port, () => {
  debug.info('🚀 Client', `is running on http://localhost:${port}`);
  clientRequestService();
});
