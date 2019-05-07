import express from 'express';
import validate from 'express-validation';
import Joi from 'joi';
import { toString, pick, keys } from 'lodash/fp';
import winston from '../winston';
import service from '../service';
import model from '../model';
import asyncWrapper from '../middleware/async-wrapper';
import machineAuthenticate from '../middleware/machine-authenticate';

const router = express.Router();
const isNumber = Joi.number();
const isString = Joi.string();
const isArray = Joi.array();
const isObject = Joi.object();

const customerSchema = {
  id: isString.allow('', null),
  firstName: isString.required(),
  lastName: isString.required(),
  identificationNumber: isString.required(),
  mobileNumber: isString.required(),
  email: isString.required(),
};

const inventorySchema = {
  width: isNumber.allow('', null),
  height: isNumber.allow('', null),
  length: isNumber.allow('', null),
  weight: isNumber.allow('', null),
  inventoryTypeId: isString.required(),
};

const createInventorySchema = {
  customer: isObject.keys(customerSchema),
  inventories: isArray.min(1).items(inventorySchema),
};

const createShipmentSchema = {
  name: isString.required(),
  address: isString.required(),
  mobileNumber: isString.required(),
  email: isString.required(),
};

const inventoryDispatchSchema = {
  inventories: isArray.min(1).items({ id: isString.required() }),
  shipment: isObject.keys(createShipmentSchema),
};

/**
 * @swagger
 * /inventory/deposit:
 *  post:
 *    description: for deposit inventories
 *    tags: [Inventory]
 *    produces:
 *      - application/json
 *    parameters:
 *       - name: obj
 *         description: inventory items to want to deposit
 *         in: body
 *         schema:
 *           $ref: '#/definitions/requestDepositInventory'
 *    responses:
 *       200:
 *         description: once finish will return deposit receipt
 *         schema:
 *           $ref: '#/definitions/responseDepositInventory'
*/
router.post(
  '/inventory/deposit',
  validate({
    body: isObject.keys(createInventorySchema),
  }),
  machineAuthenticate,
  asyncWrapper(async (req, res) => {
    try {
      await model.sequelize.transaction(async (transaction) => {
        const body = pick(keys(createInventorySchema), req.body);
        res.send(await service.inventory.deposit(body, { transaction }));
      });
    } catch (err) {
      winston.logger.error('Error while deposit inventory.', { error: toString(err), body: JSON.stringify(req.body) });
      res.status(500).send({
        statusCode: 500,
        description: toString(err),
      });
    }
  }),
);

/**
 * @swagger
 * /inventory/dispatch/price:
 *  post:
 *    description: for calculate summary price before dispatching
 *    tags: [Inventory]
 *    produces:
 *      - application/json
 *    parameters:
 *       - name: obj
 *         description: inventory item to want to dispatch
 *         in: body
 *         schema:
 *           $ref: '#/definitions/requestDispatchInventory'
 *    responses:
 *       200:
 *         description: return deposited and shipment price
 *         schema:
 *           $ref: '#/definitions/responseDispatchInventoryPrice'
*/
router.post(
  '/inventory/dispatch/price',
  validate({
    body: isObject.keys(inventoryDispatchSchema),
  }),
  machineAuthenticate,
  asyncWrapper(async (req, res) => {
    try {
      await model.sequelize.transaction(async (transaction) => {
        const body = pick(keys(inventoryDispatchSchema), req.body);
        res.send(await service.inventory.dispatchPrice(body, { transaction }));
      });
    } catch (err) {
      winston.logger.error('Error while summary dispatch deposited inventory price.', { error: toString(err), body: JSON.stringify(req.body) });
      res.status(500).send({
        statusCode: 500,
        description: toString(err),
      });
    }
  }),
);

/**
 * @swagger
 * /inventory/dispatch:
 *  post:
 *    description: customer submittion dispatch inventory
 *    tags: [Inventory]
 *    produces:
 *      - application/json
 *    parameters:
 *       - name: obj
 *         description: inventory item to want to dispatch
 *         in: body
 *         schema:
 *           $ref: '#/definitions/requestDispatchInventory'
 *    responses:
 *       200:
 *         description: net price and dispatchReceiptNumber for request to payment service
 *         schema:
 *           $ref: '#/definitions/responseDispatchInventory'
*/
router.post(
  '/inventory/dispatch',
  validate({
    body: isObject.keys(inventoryDispatchSchema),
  }),
  machineAuthenticate,
  asyncWrapper(async (req, res) => {
    try {
      await model.sequelize.transaction(async (transaction) => {
        const body = pick(keys(inventoryDispatchSchema), req.body);
        res.send(await service.inventory.dispatch(body, { transaction }));
      });
    } catch (err) {
      winston.logger.error('Error while sumittion dispatch deposited inventory.', { error: toString(err), body: JSON.stringify(req.body) });
      res.status(500).send({
        statusCode: 500,
        description: toString(err),
      });
    }
  }),
);

export default router;

/**
 * @swagger
 * definitions:
 *   requestDepositInventory:
 *     type: object
 *     required:
 *       - firstName
 *       - lastName
 *       - identificationNumber
 *       - mobileNumber
 *       - email
 *     properties:
 *       customer:
 *          type: object
 *          properties:
 *           firstName:
 *             type: string
 *           lastName:
 *             type: string
 *           identificationNumber:
 *             type: string
 *           mobileNumber:
 *             type: string
 *           email:
 *             type: string
 *       inventories:
 *          type: array
 *          items:
 *           required:
 *             - inventoryTypeId
 *           type: object
 *           properties:
 *             width:
 *               type: number
 *             height:
 *               type: number
 *             length:
 *               type: number
 *             weight:
 *               type: number
 *             inventoryTypeId:
 *               type: string
 *   responseDepositInventory:
 *      type: object
 *      properties:
 *        depositReceiptNumber:
 *          type: string
 *   requestDispatchInventory:
 *     type: object
 *     properties:
 *       inventories:
 *          type: array
 *          items:
 *           required:
 *             - id
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *       shipment:
 *          type: object
 *          properties:
 *           name:
 *             type: string
 *           address:
 *             type: string
 *           mobileNumber:
 *             type: string
 *           email:
 *             type: string
 *   responseDispatchInventoryPrice:
 *      type: object
 *      properties:
 *       inventoriesDepositedPrice:
 *          type: array
 *          items:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             dayCount:
 *               type: string
 *             price:
 *               type: number
 *       shipmentPrice:
 *          type: number
 *   responseDispatchInventory:
 *      type: object
 *      properties:
 *        netAmount:
 *          type: number
 *        dispatchReceiptNumber:
 *          type: string
 */
