import '../../path.config';
import express from 'express';
import debug from '@Lib/Debug';
import { Server } from 'socket.io';
import { createServer } from 'http';
import migrationHandler from './middlewares/migrationHandler';
import route from './routes';
import TimeModule from './modules/timeModule';
import globalMigration from './controller/classes/GlobalMigration';

const app = express();
const httpServer = createServer(app);
const port = process.env.SERVER_PORT;
const timeModule = TimeModule.Instance();

app.use(express.json());
app.use(migrationHandler);

app.use(route);
timeModule.start();

const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

io.on('connection', (socket) => {
  socket.on('App running', async (data: string) => {
    debug.info('socket', data);
    globalMigration.setAppIsRunning(true);
    timeModule.stop();
  });
});

httpServer.listen(3003);

app.listen(port, () => {
  debug.info('🚀 Server', `is running on http://localhost:${port}`);
});
