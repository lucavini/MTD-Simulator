import '../../path.config';
import express from 'express';
import debug from '@Lib/Debug';
import route from './Router';

const app = express();
const port = process.env.APP_PORT;

app.use(express.json());
app.use(route);
app.listen(port, () => {
  debug.info('🚀 App', `is running on http://localhost:${port}`);
});
