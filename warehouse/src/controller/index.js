import express from 'express';
import inventory from './inventory';
import depositReceipt from './depositReceipt';

const controllers = [
  inventory,
  depositReceipt,
];

const controllerApi = express.Router();

controllerApi.use(controllers);

export default controllerApi;
