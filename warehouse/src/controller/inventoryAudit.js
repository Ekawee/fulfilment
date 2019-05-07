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
 * /inventory/{id}/audit:
 *  get:
 *    description: get inventory detail
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
 *            $ref: '#/definitions/baseInventoryAudit'
 */
router.get(
  '/inventory/:id/audit',
  machineAuthenticate,
  validate({
    id: Joi.string().valid(Joi.ref('$params.id')).required(),
  }),
  asyncWrapper(async (req, res) => {
    try {
      await model.sequelize.transaction(async (transaction) => {
        res.send(await service.inventoryAudit.getByInventoryPk(req.params.id, { transaction }));
      });
    } catch (err) {
      winston.logger.error('Error while get inventory audit detail.', { error: JSON.stringify(req.params) });
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
 *   baseInventoryAudit:
 *    properties:
 *      id:
 *        type: string
 *      inventoryId:
 *        type: string
 *      userId:
 *        type: string
 *      action:
 *        type: string
 *      status:
 *        type: string
 *      remark:
 *        type: string
 */
