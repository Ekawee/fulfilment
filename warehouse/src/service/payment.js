import { compose, upperCase } from 'lodash/fp';
import generate from 'nanoid/generate';
import model from '../model';
import service from '../service';
import sequelizeUtil from '../util/sequelize';
import { PAYMENT_REFERENCE } from '../constants';

/*
 * generate random keys to combine with A-Z and 0-9
 * @return string.
 */
const generatePaymentReference = compose(
  (str) => str.replace(/ /g, ''),
  upperCase,
  () => generate(PAYMENT_REFERENCE.CHARACTER, PAYMENT_REFERENCE.LENGTH),
);

/*
 * create payment transacction.
 * @param1 object that contain credit card info
 * @return object that contain payment reference.
 */
const submit = async (data, modelOptions) => {
  /*
   * this must have a verification e.g.
   * - verify credit card number format.
   * - verrify expiry date
   * - etc..
   */
  const { amount } = data;

  const payload = {
    amount,
    paymentReference: service.payment.generatePaymentReference(),
    status: 'COMPLETED',
  };

  const payment = await model.payment.create(payload, modelOptions);
  return sequelizeUtil.modelToObject(payment);
};

export default {
  submit,
  generatePaymentReference,
};
