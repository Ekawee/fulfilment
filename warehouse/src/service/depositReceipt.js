import generate from 'nanoid/generate';
import { compose, upperCase } from 'lodash/fp';
import { DEPOSITE_RECEIPT_NUMBER } from '../constants';

const generateDepositReceiptNumber = compose(
  (str) => str.replace(/ /g, ''),
  upperCase,
  () => generate(DEPOSITE_RECEIPT_NUMBER.CHARACTER, DEPOSITE_RECEIPT_NUMBER.LENGTH),
);

export default {
  generateDepositReceiptNumber,
};
