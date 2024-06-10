import express, { urlencoded } from 'express';
import morgan from 'morgan';
import router from './root-routes';
import {globalErrorHandler} from '@tscc/core';
const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use('/', router);
app.use(globalErrorHandler)

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
