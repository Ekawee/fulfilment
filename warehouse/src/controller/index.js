import express from 'express';
import inventory from './inventory';
import depositReceipt from './depositReceipt';
import dispatchReceipt from './dispatchReceipt';
import inventoryAudit from './inventoryAudit';
import inventoryType from './inventoryType';
import payment from './payment';

const controllers = [
  inventory,
  depositReceipt,
  dispatchReceipt,
  inventoryAudit,
  inventoryType,
  payment,
];

const controllerApi = express.Router();

controllerApi.use(controllers);

export default controllerApi;
