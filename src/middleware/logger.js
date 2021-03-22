import winston from 'winston';
import expressWinston from 'express-winston';

const { format, transports } = winston;

const consoleFormat = format.printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

export default expressWinston.logger({
  transports: [new transports.Console()],
  format: format.combine(
    format.label({ label: 'Winston' }),
    format.colorize(),
    format.json(),
    format.timestamp(),
    consoleFormat
  ),
  meta: true,
  msg: 'HTTP {{req.method}} {{req.url}}',
  expressFormat: true,
  colorize: true,
});
