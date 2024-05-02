import express from 'express';
import route from './Router';
import migrationHandler from './app/middlewares/migrationHandler';
import debug from '../lib/Debug';

const app = express();
const port = 3333;

app.use(express.json());
app.use(migrationHandler);
app.use(route);
app.listen(port, () => {
  debug.info('🚀 Server', `is running on http://localhost:${port}`);
});
