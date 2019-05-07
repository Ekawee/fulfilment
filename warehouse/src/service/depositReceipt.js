import generate from 'nanoid/generate';
import model from '../model';
import { compose, upperCase } from 'lodash/fp';
import sequelizeUtil from '../util/sequelize';
import { DEPOSITE_RECEIPT_NUMBER } from '../constants';

/*
 * generate random keys to combine with A-Z and 0-9
 * @return string.
 */
const generateDepositReceiptNumber = compose(
  (str) => str.replace(/ /g, ''),
  upperCase,
  () => generate(DEPOSITE_RECEIPT_NUMBER.CHARACTER, DEPOSITE_RECEIPT_NUMBER.LENGTH),
);

/*
 * query summary data from deposit receipt
 * @param1 object to contain request query fields
 * @return array to contain data object.
 */
const getDashboard = async (query, modelOptions) => {
  const {
    depositReceiptNumber,
    limit = 10,
    offset = 0,
  } = query;
  const rawSql = `
    select
      dr.id, dr.deposit_receipt_number, dr.created_at,
      c.first_name, c.last_name, c.mobile_number, c.email,
      (select count(*) from inventory where status = 'DEPOSITED' and deposit_receipt_id = dr.id) as deposit_amount,
      (select count(*) from inventory where status = 'STORED' and deposit_receipt_id = dr.id) as store_amount,
      (select count(*) from inventory where status = 'DISPATCHED' and deposit_receipt_id = dr.id) as dispatch_amount,
      (select count(*) from inventory where status = 'PAID' and deposit_receipt_id = dr.id) as paid_amount
    from deposit_receipt dr
    join customer c
    on dr.customer_id = c.id
    where 1=1
    ${depositReceiptNumber ? `and dr.deposit_receipt_number ilike '${depositReceiptNumber}'` : ''}
    ${limit ? `limit ${limit}` : ''}
    ${offset ? `offset ${offset}` : ''}
  `;

  const dashboardData = await model.sequelize.query(rawSql, {
    type: model.sequelize.QueryTypes.SELECT,
    raw: true,
    ...modelOptions,
  });

  return sequelizeUtil.transformKeySnakeToCamelCase(dashboardData);
};

export default {
  getDashboard,
  generateDepositReceiptNumber,
};
