import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { config } from '../config/index';
import { texts } from './utils/textLogs';
import { initializeJobs } from './job';
import './firebaseAdmin';
import routes from './routers';

dotenv.config();
const app = express();
app.use(express.json());

app.use('/', routes);

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', texts.localhost);
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, x-access-token'
  );
  next();
});

app.use(cors({ origin: texts.localhost }));

initializeJobs();

app.listen(config.port, () => {
   console.log(texts.start_server);
});
