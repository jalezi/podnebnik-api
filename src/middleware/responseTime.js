const getDurationInMilliseconds = start => {
  const NS_PER_SEC = 1e9;
  const NS_TO_MS = 1e6;
  const diff = process.hrtime(start);

  return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
};

const nodeEnv = process.env.NODE_ENV;
const isDev = nodeEnv === 'development';
export default (req, res, next) => {
  isDev && console.log(`${req.method} ${req.originalUrl} [STARTED]`);
  const start = process.hrtime();

  res.on('finish', () => {
    const durationInMilliseconds = getDurationInMilliseconds(start);
    isDev &&
      console.log(
        `${req.method} ${
          req.originalUrl
        } [FINISHED] ${durationInMilliseconds.toLocaleString()} ms`
      );
  });

  res.on('close', () => {
    const durationInMilliseconds = getDurationInMilliseconds(start);
    isDev &&
      console.log(
        `${req.method} ${
          req.originalUrl
        } [CLOSED] ${durationInMilliseconds.toLocaleString()} ms`
      );
  });

  next();
};
