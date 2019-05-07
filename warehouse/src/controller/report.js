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
 * /report/profit:
 *  get:
 *    description: get profit and forcast
 *    tags: [Report]
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        schema:
 *          type: array
 *          items:
 *            $ref: '#/definitions/reportProfitResponse'
 */
router.get(
  '/report/profit',
  machineAuthenticate,
  asyncWrapper(async (req, res) => {
    try {
      await model.sequelize.transaction(async (transaction) => {
        res.send(await service.report.profit(req.query, { transaction }));
      });
    } catch (err) {
      winston.logger.error('Error while get profit reports.');
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
 *     type: object
 *     properties:
 *       depositInventory:
 *         type: object
 *         properties:
 *          amount:
 *            type: number
 *          forcastAmount:
 *            type: number
 *       dispatchInventory:
 *         type: object
 *         properties:
 *           amount:
 *             type: number
 *           expectedAmount:
 *             type: number
 *           shipAmount:
 *             type: number
 *           netAmount:
 *             type: number
 *       paidInventory:
 *         type: object
 *         properties:
 *           amount:
 *             type: number
 *           profitAmount:
 *             type: number
 *           shipAmount:
 *             type: number
 *           netAmount:
 *             type: number
 */
