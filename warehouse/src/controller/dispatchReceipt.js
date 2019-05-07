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
 * /dispatch-receipts:
 *  get:
 *    description: get all dispatch receipt
 *    tags: [DispatchReceipt]
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        schema:
 *          type: array
 *          items:
 *            $ref: '#/definitions/dispatchReceiptsDashboard'
 */
router.get(
  '/dispatch-receipt/dashboard',
  machineAuthenticate,
  asyncWrapper(async (req, res) => {
    try {
      await model.sequelize.transaction(async (transaction) => {
        res.send(await service.dispatchReceipt.getDashboard(req.query, { transaction }));
      });
    } catch (err) {
      winston.logger.error('Error while get dispatch receipts dashboard.');
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
 *   dispatchReceiptsDashboard:
 *     type: array
 *     items:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *        dispatchReceiptNumber:
 *          type: string
 *        paymentReference:
 *          type: string
 *        depositAmount:
 *          type: number
 *        shipAmount:
 *          type: number
 *        netAmount:
 *          type: number
 *        inventoyAmount:
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
