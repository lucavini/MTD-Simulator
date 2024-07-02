import '../../path.config';
import express from 'express';
import debug from '@Lib/Debug';
import migrationHandler from './middlewares/migrationHandler';
import route from './routes';

const app = express();
const port = process.env.SERVER_PORT;

app.use(express.json());
app.use(migrationHandler);

app.use(route);

app.listen(port, () => {
  debug.info('🚀 Server', `is running on http://localhost:${port}`);
});
