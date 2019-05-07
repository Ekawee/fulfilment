import { map, sum, size, head } from 'lodash/fp';
import model from '../model';
import service from '.';
import sequelizeUtil from '../util/sequelize';

/*
 * query summary profit from inventory status 'DEPOSITED' and 'STORED'
 * @param1 object sequelize transaction
 * @return object to contain data.
 */
const depositForcast = async (modelOptions) => {
  const depositQuery = `
    select
      i.id
    from deposit_receipt dr
    join inventory i
    on dr.id = i.deposit_receipt_id
    where status in ('DEPOSITED', 'STORED')
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

  return {
    amount: size(depositTransform),
    forcastAmount: sum(depositPrice),
  };
};

/*
 * query summary profit from inventory status 'DISPATCHED'
 * @param1 object sequelize transaction
 * @return object to contain data.
 */
const dispatchExpected = async (modelOptions) => {
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
  `;

  const dispatchModel = await model.sequelize.query(dispatchQuery, {
    type: model.sequelize.QueryTypes.SELECT,
    raw: true,
    ...modelOptions,
  });

  return head(sequelizeUtil.transformKeySnakeToCamelCase(dispatchModel));
};

/*
 * query summary profit from inventory status 'PAID'
 * @param1 object sequelize transaction
 * @return object to contain data.
 */
const paidProfit = async (modelOptions) => {
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
  `;

  const paidModel = await model.sequelize.query(paidQuery, {
    type: model.sequelize.QueryTypes.SELECT,
    raw: true,
    ...modelOptions,
  });

  return head(sequelizeUtil.transformKeySnakeToCamelCase(paidModel));
};

/*
 * query summary profit and forcast amount.
 * @param1 object sequelize transaction
 * @return object to contain data.
 */
const profit = async (modelOptions) => {
  const depositInventory = await service.report.depositForcast(modelOptions);
  const dispatchInventory = await service.report.dispatchExpected(modelOptions);
  const paidInventory = await service.report.paidProfit(modelOptions);
  return {
    depositInventory,
    dispatchInventory,
    paidInventory,
  };
};

export default {
  profit,
  depositForcast,
  dispatchExpected,
  paidProfit,
};
