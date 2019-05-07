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
const isObject = Joi.object();

const createPaymentSchema = {
  creditCardNumber: isString.required(),
  name: isString.required(),
  expiryDate: isString.required(),
  cvv: isString.required(),
  amount: isNumber.required(),
};

/**
 * @swagger
 * /payment/deposit:
 *  post:
 *    description: NOTE THAT AS MY CONCEPT THIS ENDPOINT ACTUALLY SPLIT TO A "PAYMENT SERVICE"
 *    tags: [Payment]
 *    produces:
 *      - application/json
 *    parameters:
 *       - name: obj
 *         description: credit card info
 *         in: body
 *         schema:
 *           $ref: '#/definitions/basePaymentRequest'
 *    responses:
 *       200:
 *         description: once finish will return payment reference
 *         schema:
 *           $ref: '#/definitions/basePaymentResponse'
*/
router.post(
  '/payment',
  validate({
    body: isObject.keys(createPaymentSchema),
  }),
  machineAuthenticate,
  asyncWrapper(async (req, res) => {
    try {
      await model.sequelize.transaction(async (transaction) => {
        const body = pick(keys(createPaymentSchema), req.body);
        res.send(await service.payment.submit(body, { transaction }));
      });
    } catch (err) {
      winston.logger.error('Error while payment submittion.', { error: toString(err), body: JSON.stringify(req.body) });
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
 *   basePaymentRequest:
 *     type: object
 *     required:
 *       - creditCardNumber
 *       - name
 *       - expiryDate
 *       - cvv
 *       - amount
 *     properties:
 *       creditCardNumber:
 *         type: string
 *       name:
 *         type: string
 *       expiryDate:
 *         type: string
 *       cvv:
 *         type: string
 *       amount:
 *         type: number
 *   basePaymentResponse:
 *      type: object
 *      properties:
 *        paymentReference:
 *          type: string
 *        status:
 *          type: string
 */
