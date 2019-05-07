import { map, sum, size, head } from 'lodash/fp';
import model from '../model';
import service from '.';
import sequelizeUtil from '../util/sequelize';

/*
 * query summary profit and forcast amount.
 * @param1 object to contain request query fields
 * @return object to contain data.
 */
const profit = async (query, modelOptions) => {
  const {
    limit = 10,
    offset = 0,
  } = query;
  const depositQuery = `
    select
      i.id
    from deposit_receipt dr
    join inventory i
    on dr.id = i.deposit_receipt_id
    where status in ('DEPOSITED', 'STORED')
    ${limit ? `limit ${limit}` : ''}
    ${offset ? `offset ${offset}` : ''}
  `;

  const depositModel = await model.sequelize.query(depositQuery, {
    type: model.sequelize.QueryTypes.SELECT,
    raw: true,
    ...modelOptions,
  });

  const depositTransform = sequelizeUtil.transformKeySnakeToCamelCase(depositModel);

  const depositPrice = await Promise.all(
    map(
      async (inventory) => {
        const pricing = await service.pricing.calculateInventoryDeposited(inventory.id, modelOptions);
        return pricing.price;
      }
    )(depositTransform)
  );

  const depositInventory = {
    amount: size(depositTransform),
    forcastAmount: sum(depositPrice),
  };

  const dispatchQuery = `
    select
      sum(deposit_amount) as expected_amount,
      sum(ship_amount) as ship_amount,
      sum(net_amount) as net_amount,
      count(*) as amount
    from dispatch_receipt dr
    join inventory i
    on dr.id = i.dispatch_receipt_id
    where status = 'DISPATCHED'
    ${limit ? `limit ${limit}` : ''}
    ${offset ? `offset ${offset}` : ''}
  `;

  const dispatchModel = await model.sequelize.query(dispatchQuery, {
    type: model.sequelize.QueryTypes.SELECT,
    raw: true,
    ...modelOptions,
  });

  const dispatchTransform = sequelizeUtil.transformKeySnakeToCamelCase(dispatchModel);

  const paidQuery = `
    select
      sum(deposit_amount) as profit_amount,
      sum(ship_amount) as ship_amount,
      sum(net_amount) as net_amount,
      count(*) as amount
    from dispatch_receipt dr
    join inventory i
    on dr.id = i.dispatch_receipt_id
    where status = 'PAID'
    ${limit ? `limit ${limit}` : ''}
    ${offset ? `offset ${offset}` : ''}
  `;

  const paidModel = await model.sequelize.query(paidQuery, {
    type: model.sequelize.QueryTypes.SELECT,
    raw: true,
    ...modelOptions,
  });

  const paidTransform = sequelizeUtil.transformKeySnakeToCamelCase(paidModel);

  return {
    depositInventory,
    dispatchInventory: head(dispatchTransform),
    paidInventory: head(paidTransform),
  };
};
export default {
  profit,
};
