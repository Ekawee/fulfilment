import asyncWrapper from './async-wrapper';
import { HEADER_REQUEST } from '../constants';
import config from '../config';
import { UnauthorizedAccessException } from '../exception';

export default asyncWrapper(async (req, res, next) => {
  const apiMachineAuthen = req.get(HEADER_REQUEST.MACHINE_AUTHEN_KEY);
  if (apiMachineAuthen !== config.machineAuthenValue) {
    throw new UnauthorizedAccessException('Invalid api secret key');
  }
  next();
});
