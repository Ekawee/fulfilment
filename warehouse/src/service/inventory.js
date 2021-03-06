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
 * query list detail of inventories by using depositeReceiptId.
 * @param1 string deposit receipt id.
 * @return array contain inventory detail include current price.
 */
const getByDepositeReceiptPk = async (id, modelOptions) => {
  const inventories = await model.inventory.findAll({
    where: {
      depositReceiptId: id,
    },
    ...modelOptions,
  });

  const inventoriesObject = sequelizeUtil.modelToObject(inventories);

  const inventoriesWithPrice = await Promise.all(
    map(
      async (inventory) => {
        const pricing = await service.pricing.calculateInventoryDeposited(inventory.id, modelOptions);
        return {
          ...pricing,
          ...inventory,
        };
      }
    )(inventoriesObject)
  );

  return inventoriesWithPrice;
};

/*
 * query list detail of inventories by using dispatchReceiptId.
 * @param1 string dispatch receipt id.
 * @return array contain inventory detail.
 */
const getByDispatchReceiptPk = async (id, modelOptions) => {
  const inventories = await model.inventory.findAll({
    where: {
      dispatchReceiptId: id,
    },
    ...modelOptions,
  });

  return sequelizeUtil.modelToObject(inventories);
};

/*
 * query inventory by id
 * @param1 string inventory id.
 * @return object contain inventory detail.
 */
const getByPk = async (id, modelOptions) => {
  const inventory = await model.inventory.findByPk(id, modelOptions);

  const inventoryObjecct = sequelizeUtil.modelToObject(inventory);

  const pricing = await service.pricing.calculateInventoryDeposited(inventoryObjecct.id, modelOptions);
  return {
    ...pricing,
    ...inventoryObjecct,
  };
};

export default {
  deposit,
  dispatchPrice,
  dispatch,
  getByDepositeReceiptPk,
  getByDispatchReceiptPk,
  getByPk,
};
