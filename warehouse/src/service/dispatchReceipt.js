import generate from 'nanoid/generate';
import { compose, upperCase } from 'lodash/fp';
import { DISPATCH_RECEIPT_NUMBER } from '../constants';

const generateDispatchReceiptNumber = compose(
  (str) => str.replace(/ /g, ''),
  upperCase,
  () => generate(DISPATCH_RECEIPT_NUMBER.CHARACTER, DISPATCH_RECEIPT_NUMBER.LENGTH),
);

export default {
  generateDispatchReceiptNumber,
};
