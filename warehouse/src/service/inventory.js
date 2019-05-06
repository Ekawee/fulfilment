import { getOr, map } from 'lodash/fp';
import { DateTime } from 'luxon';
import model from '../model';
import service from '.';
import sequelizeUtil from '../util/sequelize';
import { INVENTORY_AUDIT } from '../constants';

const deposit = async (data, modelOptions) => {
  const { customer, inventories } = data;
  const { transaction } = modelOptions;

  const customerModel = await service.customer.findByPkOrCreate(customer, modelOptions);

  const inventoriesAppendInfo = map(
    inventory => ({
      depositedAt: DateTime.utc().toSQL(),
      status: INVENTORY_AUDIT.STATUS.DEPOSITED,
      ...inventory,
    })
  )(inventories);

  const payloadCreateInventory = {
    customerId: getOr(null, 'id')(customerModel),
    depositReceiptNumber: service.depositReceipt.generateDepositReceiptNumber(),
    inventories: inventoriesAppendInfo,
  };

  const depositReceipt = await model.depositReceipt.create(
    payloadCreateInventory,
    {
      include: [
        {
          model: model.inventory,
          as: 'inventories',
        },
      ],
      transaction,
    }
    );

  await service.inventoryAudit.logAdded(depositReceipt.inventories, modelOptions);
  return sequelizeUtil.modelToObject(depositReceipt);
};

export default {
  deposit,
};
