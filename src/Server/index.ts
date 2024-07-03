import '../../path.config';
import express from 'express';
import debug from '@Lib/Debug';
import migrationHandler from './middlewares/migrationHandler';
import route from './routes';
import TimeModule from './modules/timeModule';

const app = express();
const port = process.env.SERVER_PORT;
const timeModule = TimeModule.Instance();

app.use(express.json());
app.use(migrationHandler);

app.use(route);
timeModule.start();

app.listen(port, () => {
  debug.info('🚀 Server', `is running on http://localhost:${port}`);
});
