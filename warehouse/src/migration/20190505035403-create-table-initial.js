import sequelizeUtil from '../util/sequelize';

const tableName = {
  inventoryType: 'inventoryType',
  inventoryTypePrice: 'inventoryTypePrice',
  customer: 'customer',
  depositReceipt: 'depositReceipt',
  shipment: 'shipment',
  dispatchReceipt: 'dispatchReceipt',
  inventory: 'inventory',
  user: 'user',
  inventoryAudit: 'inventoryAudit',
  customerAudit: 'customerAudit',
  payment: 'payment',
};

const inventoryType = (queryInterface, Sequelize, transaction) =>
  queryInterface.createTable(
    tableName.inventoryType,
    sequelizeUtil.withDefaultTableFields({
      name: { type: Sequelize.STRING },
    }, Sequelize),
    { transaction },
  );

const inventoryTypePrice = (queryInterface, Sequelize, transaction) =>
  queryInterface.createTable(
    tableName.inventoryTypePrice,
    sequelizeUtil.withDefaultTableFields({
      inventoryTypeId: sequelizeUtil.withForeignKey({ model: tableName.inventoryType }, Sequelize),
      effectiveDate: { type: Sequelize.DATE },
      expiryDate: { type: Sequelize.DATE },
      price: { type: Sequelize.DECIMAL(10, 2) },
      unitMeasure: { type: Sequelize.STRING },
      amountPerUnitMeasure: { type: Sequelize.DECIMAL(10, 2) },
      multiplyPricePerDay: { type: Sequelize.DECIMAL(10, 2) },
    }, Sequelize),
    { transaction },
  );

const customer = (queryInterface, Sequelize, transaction) =>
  queryInterface.createTable(
    tableName.customer,
    sequelizeUtil.withDefaultTableFields({
      uid: { type: Sequelize.STRING },
      firstName: { type: Sequelize.STRING },
      lastName: { type: Sequelize.STRING },
      identificationNumber: { type: Sequelize.STRING },
      mobileNumber: { type: Sequelize.STRING },
      email: { type: Sequelize.STRING },
    }, Sequelize),
    { transaction },
  );

const depositReceipt = (queryInterface, Sequelize, transaction) =>
  queryInterface.createTable(
    tableName.depositReceipt,
    sequelizeUtil.withDefaultTableFields({
      customerId: sequelizeUtil.withForeignKey({ model: tableName.customer }, Sequelize),
      depositReceiptNumber: { type: Sequelize.STRING },
    }, Sequelize),
    { transaction },
  );

const shipment = (queryInterface, Sequelize, transaction) =>
  queryInterface.createTable(
    tableName.shipment,
    sequelizeUtil.withDefaultTableFields({
      name: { type: Sequelize.STRING },
      address: { type: Sequelize.STRING },
      mobileNumber: { type: Sequelize.STRING },
      email: { type: Sequelize.STRING },
    }, Sequelize),
    { transaction },
  );

const dispatchReceipt = (queryInterface, Sequelize, transaction) =>
  queryInterface.createTable(
    tableName.dispatchReceipt,
    sequelizeUtil.withDefaultTableFields({
      customerId: sequelizeUtil.withForeignKey({ model: tableName.customer }, Sequelize),
      shipmentId: sequelizeUtil.withForeignKey({ model: tableName.shipment }, Sequelize),
      dispatchReceiptNumber: { type: Sequelize.STRING },
      paymentReference: { type: Sequelize.STRING },
      depositAmount: { type: Sequelize.DECIMAL(10, 2) },
      shipAmount: { type: Sequelize.DECIMAL(10, 2) },
      netAmount: { type: Sequelize.DECIMAL(10, 2) },
    }, Sequelize),
    { transaction },
  );

const inventory = (queryInterface, Sequelize, transaction) =>
queryInterface.createTable(
  tableName.inventory,
  sequelizeUtil.withDefaultTableFields({
    inventoryTypeId: sequelizeUtil.withForeignKey({ model: tableName.inventoryType }, Sequelize),
    depositReceiptId: sequelizeUtil.withForeignKey({ model: tableName.depositReceipt }, Sequelize),
    dispatchReceiptId: sequelizeUtil.withForeignKey({ model: tableName.dispatchReceipt }, Sequelize),
    width: { type: Sequelize.DECIMAL(10, 2) },
    height: { type: Sequelize.DECIMAL(10, 2) },
    length: { type: Sequelize.DECIMAL(10, 2) },
    weight: { type: Sequelize.DECIMAL(10, 2) },
    depositedAt: { type: Sequelize.DATE },
    dispatchedAt: { type: Sequelize.DATE },
    expectedAmount: { type: Sequelize.DECIMAL(10, 2) },
    paidAmount: { type: Sequelize.DECIMAL(10, 2) },
    status: { type: Sequelize.STRING },
  }, Sequelize),
  { transaction },
);

const user = (queryInterface, Sequelize, transaction) =>
  queryInterface.createTable(
    tableName.user,
    sequelizeUtil.withDefaultTableFields({
      uid: { type: Sequelize.STRING },
      role: { type: Sequelize.STRING },
      firstName: { type: Sequelize.STRING },
      lastName: { type: Sequelize.STRING },
    }, Sequelize),
    { transaction },
  );

const inventoryAudit = (queryInterface, Sequelize, transaction) =>
  queryInterface.createTable(
    tableName.inventoryAudit,
    sequelizeUtil.withDefaultTableFields({
      inventoryId: sequelizeUtil.withForeignKey({ model: tableName.inventory }, Sequelize),
      userId: sequelizeUtil.withForeignKey({ model: tableName.user }, Sequelize),
      action: { type: Sequelize.STRING },
      status: { type: Sequelize.STRING },
      remark: { type: Sequelize.TEXT },
    }, Sequelize),
    { transaction },
  );

const customerAudit = (queryInterface, Sequelize, transaction) =>
  queryInterface.createTable(
    tableName.inventoryAudit,
    sequelizeUtil.withDefaultTableFields({
      customerId: sequelizeUtil.withForeignKey({ model: tableName.customer }, Sequelize),
      userId: sequelizeUtil.withForeignKey({ model: tableName.user }, Sequelize),
      previousInformation: { type: Sequelize.TEXT },
      currentInformation: { type: Sequelize.TEXT },
      remark: { type: Sequelize.STRING },
    }, Sequelize),
    { transaction },
  );

const payment = (queryInterface, Sequelize, transaction) =>
  queryInterface.createTable(
    tableName.payment,
    sequelizeUtil.withDefaultTableFields({
      paymentReference: { type: Sequelize.STRING },
      amount: { type: Sequelize.DECIMAL(10, 2) },
      status: { type: Sequelize.STRING },
    }, Sequelize),
    { transaction },
  );

export default {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        inventoryType(queryInterface, Sequelize, transaction),
        inventoryTypePrice(queryInterface, Sequelize, transaction),
        customer(queryInterface, Sequelize, transaction),
        depositReceipt(queryInterface, Sequelize, transaction),
        shipment(queryInterface, Sequelize, transaction),
        dispatchReceipt(queryInterface, Sequelize, transaction),
        inventory(queryInterface, Sequelize, transaction),
        user(queryInterface, Sequelize, transaction),
        inventoryAudit(queryInterface, Sequelize, transaction),
        customerAudit(queryInterface, Sequelize, transaction),
        payment(queryInterface, Sequelize, transaction),
      ]);
    });
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.dropTable(tableName.payment, { transaction }),
        queryInterface.dropTable(tableName.customerAudit, { transaction }),
        queryInterface.dropTable(tableName.inventoryAudit, { transaction }),
        queryInterface.dropTable(tableName.user, { transaction }),
        queryInterface.dropTable(tableName.inventory, { transaction }),
        queryInterface.dropTable(tableName.dispatchReceipt, { transaction }),
        queryInterface.dropTable(tableName.shipment, { transaction }),
        queryInterface.dropTable(tableName.depositReceipt, { transaction }),
        queryInterface.dropTable(tableName.customer, { transaction }),
        queryInterface.dropTable(tableName.inventoryTypePrice, { transaction }),
        queryInterface.dropTable(tableName.inventoryType, { transaction }),
      ]);
    });
  },
};
