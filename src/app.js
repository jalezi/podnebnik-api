import express from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import api from './routes/api.js';
import healthcheck from './routes/healthcheck.js';

import logger from './middleware/logger.js';
import responseTime from './middleware/responseTime.js';
import {
  logErrors,
  clientErrorHandler,
  errorHandler,
} from './middleware/errorHandlers.js';

const nodeEnv = process.env.NODE_ENV;
const isDev = nodeEnv === 'development';
const isTest = nodeEnv !== 'test';
const app = express();

isDev && app.use(responseTime);
isTest && app.use(logger);

app.use(bodyParser.json());
app.use(helmet());

// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
// see https://expressjs.com/en/guide/behind-proxies.html
app.set('trust proxy', 1);

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
});
app.use(apiLimiter);

app.use('/api', api);
app.use('/healthcheck', healthcheck);
app.get('/favicon.ico', (req, res) => {
  res.json({ status: 'ok', icon: false });
});
app.use((_req, _res, next) => {
  console.log('Create Not Found error!');
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

isTest && app.use(logErrors);
app.use(clientErrorHandler);
app.use(errorHandler);

export default app;
