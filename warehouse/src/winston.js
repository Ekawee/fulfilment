import winston from 'winston';
import expressWinston from 'express-winston';
import { DateTime } from 'luxon';

const { format } = winston;
const { combine, timestamp, json, splat } = format;

const winstonDefaultOption = {
  level: 'info',
  format: combine(json(), splat()),
  transports: [
    new winston.transports.Console({
      timestamp: DateTime.utc().toString(),
    }),
  ],
};

const logger = winston.createLogger({
  ...winstonDefaultOption,
  format: combine(timestamp(), json()),
});

const loggerExpress = expressWinston.logger({
  expressFormat: true,
  meta: true,
  ...winstonDefaultOption,
});

export default {
  logger,
  loggerExpress,
};
