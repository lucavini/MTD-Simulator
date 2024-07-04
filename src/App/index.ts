import '../../path.config';
import express from 'express';
import debug from '@Lib/Debug';
import io from 'socket.io-client';
import route from './Router';

const app = express();
const port = process.env.APP_PORT;
const socketPort = process.env.SOCKET_PORT;

app.use(express.json());
app.use(route);

app.listen(port, () => {
  debug.info('🚀 App', `is running on http://localhost:${port}`);
});

const socket = io(`http://192.168.0.105:${socketPort}`);
socket.emit('App running', 'App has started');
