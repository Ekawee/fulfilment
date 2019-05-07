import express from 'express';
import validate from 'express-validation';
import Joi from 'joi';
import { toString } from 'lodash/fp';
import winston from '../winston';
import service from '../service';
import model from '../model';
import asyncWrapper from '../middleware/async-wrapper';
import machineAuthenticate from '../middleware/machine-authenticate';

const router = express.Router();

/**
 * @swagger
 * /inventoryType/{id}:
 *  get:
 *    description: get inventory type by id
 *    tags: [Inventory]
 *    produces:
 *      - application/json
 *    parameters:
 *      - name: id
 *        in: path
 *        description: inventory id
 *        type: string
 *    responses:
 *      200:
 *        schema:
 *          type: array
 *          items:
 *            $ref: '#/definitions/baseInventoryType'
 */
router.get(
  '/inventoryType/:id',
  machineAuthenticate,
  validate({
    id: Joi.string().valid(Joi.ref('$params.id')).required(),
  }),
  asyncWrapper(async (req, res) => {
    try {
      await model.sequelize.transaction(async (transaction) => {
        res.send(await service.inventoryType.getByPk(req.params.id, { transaction }));
      });
    } catch (err) {
      winston.logger.error('Error while get inventory type detail.', { error: JSON.stringify(req.params) });
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
 *   baseInventoryType:
 *    properties:
 *      id:
 *        type: string
 *      name:
 *        type: string
 *      effectiveDate:
 *        type: string
 *      expiryDate:
 *        type: string
 *      price:
 *        type: number
 *      unitMeasure:
 *        type: string
 *      unitMeasureType:
 *        type: string
 *      amountPerUnitMeasure:
 *        type: number
 *      multiplyPricePerDay:
 *        type: number
 */
