import express from 'express';
import inventory from './inventory';
import depositReceipt from './depositReceipt';
import dispatchReceipt from './dispatchReceipt';
import inventoryAudit from './inventoryAudit';
import inventoryType from './inventoryType';
import payment from './payment';
import report from './report';

const controllers = [
  inventory,
  depositReceipt,
  dispatchReceipt,
  inventoryAudit,
  inventoryType,
  payment,
  report,
];

const controllerApi = express.Router();

controllerApi.use(controllers);

export default controllerApi;
