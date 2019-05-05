import { getOr } from 'lodash/fp';
import winston from '../winston';

export default async (err, req, res) => {
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
  winston.logger.error('Exception Middleware', { originalErr: err, payloadError });
  res.status(code).json(payloadError);
};
