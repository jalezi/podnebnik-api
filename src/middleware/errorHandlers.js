import ApplicationError from '../Errors/ApplicationError/ApplicationError.js';

export const logErrors = (error, _req, _res, next) => {
  console.error(error.stack);
  next(error);
};

export const clientErrorHandler = (error, req, res, next) => {
  if (req.xhr) {
    res
      .status(500)
      .json({ error: { status: 500, message: 'Something failed!' } });
  } else {
    next(error);
  }
};

const nodeEnv = process.env.NODE_ENV;
console.log(nodeEnv);
export const errorHandler = (error, _req, res, next) => {
  if (nodeEnv === 'development') {
    if (error instanceof ApplicationError) {
      res.status(500).send(`<pre>${error.stack}</pre>`);
      return process.emit('SIGTERM');
    }
    return res.status(error.status || 500).json({
      error: {
        status: error.status || 500,
        message: error.message || 'Internal Server Error',
      },
    });
  }

  if (nodeEnv === 'production' || nodeEnv === 'stagging') {
    return res.status(500).json({
      error: {
        status: error.status || 500,
        message: error.message || 'Something went wrong!',
      },
    });
  }

  res.status(500).json({
    error: {
      status: error.status || 500,
      message: error.message || 'Internal Server Error',
    },
  });
};
