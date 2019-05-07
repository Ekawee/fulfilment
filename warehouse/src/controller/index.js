import express from 'express';
import inventory from './inventory';
import depositReceipt from './depositReceipt';
import dispatchReceipt from './dispatchReceipt';
import inventoryAudit from './inventoryAudit';

const controllers = [
  inventory,
  depositReceipt,
  dispatchReceipt,
  inventoryAudit,
];

const controllerApi = express.Router();

controllerApi.use(controllers);

export default controllerApi;
