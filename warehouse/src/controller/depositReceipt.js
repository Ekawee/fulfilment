import express from 'express';
import { toString } from 'lodash/fp';
import winston from '../winston';
import service from '../service';
import model from '../model';
import asyncWrapper from '../middleware/async-wrapper';
import machineAuthenticate from '../middleware/machine-authenticate';

const router = express.Router();
/**
 * @swagger
 * /deposit-receipts:
 *  get:
 *    description: get all deposit receipt
 *    tags: [DepositReceipt]
 *    produces:
 *      - application/json
 *    parameters:
 *      - name: depositeReceiptNumber
 *        in: path
 *        description: deposite receipt number
 *        type: string
 *      - name: limit
 *        in: path
 *        description: limit records
 *        type: number
 *      - name: offset
 *        in: path
 *        description: offset records
 *        type: number
 *    responses:
 *      200:
 *        schema:
 *          type: array
 *          items:
 *            $ref: '#/definitions/depositReceiptsDashboard'
 */
router.get(
  '/deposit-receipt/dashboard',
  machineAuthenticate,
  asyncWrapper(async (req, res) => {
    try {
      await model.sequelize.transaction(async (transaction) => {
        res.send(await service.depositReceipt.getDashboard(req.query, { transaction }));
      });
    } catch (err) {
      winston.logger.error('Error while get deposit receipts dashboard.');
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
 *   depositReceiptsDashboard:
 *     type: array
 *     items:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *        depositReceiptNumber:
 *          type: string
 *        createdAt:
 *          type: string
 *        depositAmount:
 *          type: number
 *        storeAmount:
 *          type: number
 *        dispatchAmount:
 *          type: number
 *        paidAmount:
 *          type: number
 *        firstName:
 *          type: string
 *        lastName:
 *          type: string
 *        mobileNumber:
 *          type: string
 *        email:
 *          type: string
 */
