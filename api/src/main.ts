import express, { urlencoded } from 'express';
import morgan from 'morgan';
import router from './root-routes';
import {userRoutes} from './module/user';
const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use('/user', userRoutes)
app.use('/', router);

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
