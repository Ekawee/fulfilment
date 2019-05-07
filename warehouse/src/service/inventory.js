import { getOr, map, compose, sum, last } from 'lodash/fp';
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
  const shipmentPrice = await service.pricing.calculateShipment(shipment, modelOptions);

  return {
    inventoriesDepositedPrice,
    shipmentPrice,
  };
};

/*
 * Calculate deposited inventory as requested for summary price before customer submittion.
 * @return net amount and dispatch receipt number for payment
 */
const dispatch = async (data, modelOptions) => {

  const pricing = await service.inventory.dispatchPrice(data, modelOptions);

  const depositAmount = compose(
    sum,
    map((inventory) => (inventory.price))
  )(pricing.inventoriesDepositedPrice);

  const shipAmount = pricing.shipmentPrice;
  const netAmount = depositAmount + shipAmount;

  const dispatchReceiptNumber = service.dispatchReceipt.generateDispatchReceiptNumber();

  const dispatchReceiptPayload = {
    dispatchReceiptNumber,
    depositAmount,
    shipAmount,
    netAmount,
    // customerId // TODO: need to get customer id from autherization header
  };

  const dispatchReceipt = await model.dispatchReceipt.create(dispatchReceiptPayload, modelOptions);

  /*
   * update inventories status
   */
  const inventoriesUpdated = await Promise.all(compose(
    map(async (inventory) => {
      const inventoryUpdatePayload = {
        dispatchReceiptId: dispatchReceipt.id,
        status: INVENTORY_AUDIT.STATUS.DISPATCHED,
        dispatchedAt: DateTime.utc().toSQL(),
        expectedAmount: inventory.price,
      };
      const inventoryUpdate = await model.inventory.update(
        inventoryUpdatePayload,
        {
          where: {
            id: inventory.id,
          },
          returning: true,
          plain: true,
          ...modelOptions,
        },
      );
      return sequelizeUtil.modelToObject(last(inventoryUpdate));
    })
  )(pricing.inventoriesDepositedPrice));

  await service.inventoryAudit.logUpdated(inventoriesUpdated, modelOptions);

  return {
    dispatchReceiptNumber,
    netAmount,
  };
};

/*
 * query list detail of inventories by using depositeR.
 * @param1 string deposit receipt id.
 * @return array contain inventory detail.
 */
const getByDepositeReceiptPk = async (id, modelOptions) => {
  const depositReceipt = await model.inventory.findAll({
    where: {
      depositReceiptId: id,
    },
    ...modelOptions,
  });

  return sequelizeUtil.modelToObject(depositReceipt);
};

export default {
  deposit,
  dispatchPrice,
  dispatch,
  getByDepositeReceiptPk,
};
