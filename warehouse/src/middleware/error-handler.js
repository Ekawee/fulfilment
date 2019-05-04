import { getOr } from 'lodash/fp';
import logger from '../winston';

// NOTE: HERE is required to have next
export default async (err, req, res, next) => { //eslint-disable-line
  const { name: type, message, status, messageCode } = err;
  const code = status || 500;
  const errors = getOr(message, ['errors'], err);
  const payloadError = {
    type,
    errors,
    status,
    message,
    messageCode,
  };
  logger.error('Exception Middleware', { originalErr: err, payloadError });
  res.status(code).json(payloadError);
};
