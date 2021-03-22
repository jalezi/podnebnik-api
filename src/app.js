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

const app = express();

nodeEnv === 'development' && app.use(responseTime);
nodeEnv !== 'test' && app.use(logger);

app.use(bodyParser.json());
app.use(helmet());

// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
// see https://expressjs.com/en/guide/behind-proxies.html
// app.set('trust proxy', 1);

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
});
app.use(apiLimiter);

app.use('/api', api);
app.use('/healthcheck', healthcheck);

nodeEnv !== 'test' && app.use(logErrors);
app.use(clientErrorHandler);
app.use(errorHandler);

export default app;
