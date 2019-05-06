import { getOr } from 'lodash/fp';
import model from '../model';
import service from '.';
import sequelizeUtil from '../util/sequelize';

const deposit = async (data, modelOptions) => {
  const { customer, inventories } = data;
  const { transaction } = modelOptions;

  const customerModel = await service.customer.findByIdOrCreate(customer, modelOptions);

  const payloadCreateInventory = {
    customerId: getOr(null, 'id')(customerModel),
    depositReceiptNumber: service.depositReceipt.generateDepositReciptNumber(),
    inventories,
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
  return sequelizeUtil.modelToObject(depositReceipt);
};

export default {
  deposit,
};
