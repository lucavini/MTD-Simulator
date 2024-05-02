import express from 'express';
import route from './app/Router';

const app = express();
const port = 3333;

app.use(express.json());
app.use(route);
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
