import { getOr, map } from 'lodash/fp';
import { DateTime } from 'luxon';
import model from '../model';
import service from '.';
import sequelizeUtil from '../util/sequelize';
import { INVENTORY_AUDIT } from '../constants';

/*
 * insert data when customer deposition inventories
 * @return deposit receipt information
 */
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

/*
 * Calculate deposited inventory as requested for summary price before customer submittion.
 * @return deposited price for each items
 */
const dispatchPrice = async (data, modelOptions) => {
  const { inventories, shipment } = data;

  const inventoriesDepositedPrice = await Promise.all(
    map(
      (inventory) => service.pricing.calculateInventoryDeposited(inventory.id, modelOptions)
    )(inventories)
  );

  /*
   * service.pricing.calculateShipment is mocking up to fix price for now
   */
  const shipmentPrice = await service.pricing.calculateShipment(shipment);

  return {
    inventoriesDepositedPrice,
    shipmentPrice,
  };
};

export default {
  deposit,
  dispatchPrice,
};
