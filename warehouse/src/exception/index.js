import { ERRORS } from '../constants';
import winston from '../winston';

const BaseException = (exception) => {
  const { message, name, status } = exception;
  const error = new Error(message);
  error.name = name;
  error.status = status || 500;

  winston.logger.error('Exception Handler', { ...exception });
  return error;
};

const BadRequestException = (message = ERRORS.BAD_REQUEST) => {
  const exception = {
    message,
    name: 'BadRequestException',
    status: 400,
  };
  return new BaseException(exception);
};

const NotFoundException = (message = ERRORS.NOT_FOUND) => {
  const exception = {
    message,
    name: 'NotFoundException',
    status: 404,
  };
  return new BaseException(exception);
};

const UnauthorizedAccessException = (message = ERRORS.INVALID_TOKEN) => {
  const exception = {
    message,
    name: 'UnauthorizedAccessException',
    status: 401,
  };
  return new BaseException(exception);
};

export {
  BaseException,
  BadRequestException,
  NotFoundException,
  UnauthorizedAccessException,
};
