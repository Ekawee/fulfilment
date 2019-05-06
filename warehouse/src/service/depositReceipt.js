import shortid from 'shortid';
import { compose, upperCase } from 'lodash/fp';


const generateDepositReciptNumber = compose(
  (str) => str.replace(/ /g, ''),
  upperCase,
  shortid.generate,
);

export default {
  generateDepositReciptNumber,
};
