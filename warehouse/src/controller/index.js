import express from 'express';
import inventory from './inventory';
import depositReceipt from './depositReceipt';
import dispatchReceipt from './dispatchReceipt';

const controllers = [
  inventory,
  depositReceipt,
  dispatchReceipt,
];

const controllerApi = express.Router();

controllerApi.use(controllers);

export default controllerApi;
