import sequelize from '../util/sequelize';

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
    sequelize.withDefaultTableFields({
      name: { type: Sequelize.STRING },
    }, Sequelize),
    { transaction },
  );

const inventoryTypePrice = (queryInterface, Sequelize, transaction) =>
  queryInterface.createTable(
    tableName.inventoryTypePrice,
    sequelize.withDefaultTableFields({
      inventoryTypeId: sequelize.withForeignKey({ model: tableName.inventoryType }, Sequelize),
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
    sequelize.withDefaultTableFields({
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
    sequelize.withDefaultTableFields({
      customerId: sequelize.withForeignKey({ model: tableName.customer }, Sequelize),
      depositReceiptNumber: { type: Sequelize.STRING },
    }, Sequelize),
    { transaction },
  );

const shipment = (queryInterface, Sequelize, transaction) =>
  queryInterface.createTable(
    tableName.shipment,
    sequelize.withDefaultTableFields({
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
    sequelize.withDefaultTableFields({
      customerId: sequelize.withForeignKey({ model: tableName.customer }, Sequelize),
      shipmentId: sequelize.withForeignKey({ model: tableName.shipment }, Sequelize),
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
  sequelize.withDefaultTableFields({
    inventoryTypeId: sequelize.withForeignKey({ model: tableName.inventoryType }, Sequelize),
    depositReceiptId: sequelize.withForeignKey({ model: tableName.depositReceipt }, Sequelize),
    dispatchReceiptId: sequelize.withForeignKey({ model: tableName.dispatchReceipt }, Sequelize),
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
    sequelize.withDefaultTableFields({
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
    sequelize.withDefaultTableFields({
      inventoryId: sequelize.withForeignKey({ model: tableName.inventory }, Sequelize),
      userId: sequelize.withForeignKey({ model: tableName.user }, Sequelize),
      action: { type: Sequelize.STRING },
      status: { type: Sequelize.STRING },
      remark: { type: Sequelize.TEXT },
    }, Sequelize),
    { transaction },
  );

const customerAudit = (queryInterface, Sequelize, transaction) =>
  queryInterface.createTable(
    tableName.inventoryAudit,
    sequelize.withDefaultTableFields({
      customerId: sequelize.withForeignKey({ model: tableName.customer }, Sequelize),
      userId: sequelize.withForeignKey({ model: tableName.user }, Sequelize),
      previousInformation: { type: Sequelize.TEXT },
      currentInformation: { type: Sequelize.TEXT },
      remark: { type: Sequelize.STRING },
    }, Sequelize),
    { transaction },
  );

const payment = (queryInterface, Sequelize, transaction) =>
  queryInterface.createTable(
    tableName.payment,
    sequelize.withDefaultTableFields({
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
    return Promise.all([
      queryInterface.dropTable(tableName.inventoryType),
      queryInterface.dropTable(tableName.inventoryTypePrice),
      queryInterface.dropTable(tableName.customer),
      queryInterface.dropTable(tableName.depositReceipt),
      queryInterface.dropTable(tableName.shipment),
      queryInterface.dropTable(tableName.dispatchReceipt),
      queryInterface.dropTable(tableName.inventory),
      queryInterface.dropTable(tableName.user),
      queryInterface.dropTable(tableName.inventoryAudit),
      queryInterface.dropTable(tableName.customerAudit),
      queryInterface.dropTable(tableName.v),
    ]);
  },
};
