import { DateTime } from 'luxon';
import sequelizeUtil from '../util/sequelize';

const tableName = {
  inventoryType: 'inventory_type',
  inventoryTypePrice: 'inventory_type_price',
  customer: 'customer',
  depositReceipt: 'deposit_receipt',
  shipment: 'shipment',
  dispatchReceipt: 'dispatch_receipt',
  inventory: 'inventory',
  user: 'user',
  inventoryAudit: 'inventory_audit',
  customerAudit: 'customer_audit',
  payment: 'payment',
};

const inventoryType = [
  sequelizeUtil.withInsertTimeStamp({
    id: 1,
    name: 'Supplementary Food',
  }),
  sequelizeUtil.withInsertTimeStamp({
    id: 2,
    name: 'Clothes - day',
  }),
  sequelizeUtil.withInsertTimeStamp({
    id: 3,
    name: 'Clothes - weight',
  }),
  sequelizeUtil.withInsertTimeStamp({
    id: 4,
    name: 'Others',
  }),
];

const inventoryTypePrice =[
  sequelizeUtil.withInsertTimeStamp({
    id: 1,
    inventoryTypeId: 1,
    effectiveDate: DateTime.fromISO('2019-01-01').toSQL(),
    expiryDate: DateTime.fromISO('2019-12-31').toSQL(),
    price: 1,
    unitMeasure: 'sq.cm',
    amountPerUnitMeasure: 1,
    multiplyPricePerDay: 2,
  }),
  sequelizeUtil.withInsertTimeStamp({
    id: 2,
    inventoryTypeId: 2,
    effectiveDate: DateTime.fromISO('2019-01-01').toSQL(),
    expiryDate: DateTime.fromISO('2019-12-31').toSQL(),
    price: 20,
    unitMeasure: 'kg',
    amountPerUnitMeasure: 1,
    multiplyPricePerDay: null,
  }),
  sequelizeUtil.withInsertTimeStamp({
    id: 3,
    inventoryTypeId: 3,
    effectiveDate: DateTime.fromISO('2019-01-01').toSQL(),
    expiryDate: DateTime.fromISO('2019-12-31').toSQL(),
    price: 50,
    unitMeasure: 'day',
    amountPerUnitMeasure: 1,
    multiplyPricePerDay: null,
  }),
  sequelizeUtil.withInsertTimeStamp({
    id: 4,
    inventoryTypeId: 4,
    effectiveDate: DateTime.fromISO('2019-01-01').toSQL(),
    expiryDate: DateTime.fromISO('2019-12-31').toSQL(),
    price: 10,
    unitMeasure: 'sq.m',
    amountPerUnitMeasure: 1,
    multiplyPricePerDay: null,
  }),
];

const customer = [
  sequelizeUtil.withInsertTimeStamp({
    id: 1,
    uid: 'sxm01-222ll-30osi-22019',
    firstName: 'John',
    lastName: 'Doe',
    identificationNumber: 'AA0000001',
    mobileNumber: '0900000001',
    email: 'john.doe@customer-test.com',
  }),
  sequelizeUtil.withInsertTimeStamp({
    id: 2,
    uid: 'xooi1-yyysa-290sx-m019s',
    firstName: 'Marie',
    lastName: 'Perry',
    identificationNumber: 'AA0000002',
    mobileNumber: '0900000002',
    email: 'marie.perry@mycompany-test.com',
  }),
];

const depositReceipt = [
  sequelizeUtil.withInsertTimeStamp({
    id: 1,
    customerId: 1,
    depositReceiptNumber: 'FXIU603',
  }),
  sequelizeUtil.withInsertTimeStamp({
    id: 2,
    customerId: 1,
    depositReceiptNumber: 'HU09KK1',
  }),
  sequelizeUtil.withInsertTimeStamp({
    id: 3,
    customerId: 2,
    depositReceiptNumber: 'ZU9DK01',
  }),
];

const shipment = [
  sequelizeUtil.withInsertTimeStamp({
    id: 1,
    name: 'Andrew Ortiz',
    address: '426 Tyler Avenue, Florida, United States, 33311',
    mobileNumber: '727-858-1637',
    email: 'andrewortiz@example-test.com',
  }),
];

const dispatchReceipt = [
  sequelizeUtil.withInsertTimeStamp({
    id: 1,
    customerId: 1,
    shipmentId: 1,
    dispatchReceiptNumber: 'KU8I0LL',
    paymentReference: 'PAY1539249943114',
    depositAmount: 600,
    shipAmount: 20,
    netAmount: 620,
  }),
];

const inventory = [
  sequelizeUtil.withInsertTimeStamp({
    id: 1,
    inventoryTypeId: 1,
    depositReceiptId: 1,
    dispatchReceiptId: 1,
    width: 5,
    height: 3,
    length: '10',
    weight: null,
    depositedAt: DateTime.fromISO('2019-05-02T14:30:20').toSQL(),
    dispatchedAt: DateTime.fromISO('2019-05-04T20:13:05').toSQL(),
    expectedAmount: 300,
    paidAmount: 300,
    status: 'PAID',
  }),
  sequelizeUtil.withInsertTimeStamp({
    id: 2,
    inventoryTypeId: 1,
    depositReceiptId: 1,
    dispatchReceiptId: 1,
    width: 5,
    height: 3,
    length: '10',
    weight: null,
    depositedAt: DateTime.fromISO('2019-05-02T14:30:20').toSQL(),
    dispatchedAt: DateTime.fromISO('2019-05-04T20:13:05').toSQL(),
    expectedAmount: 300,
    paidAmount: 300,
    status: 'PAID',
  }),
  sequelizeUtil.withInsertTimeStamp({
    id: 3,
    inventoryTypeId: 1,
    depositReceiptId: 2,
    dispatchReceiptId: null,
    width: 3,
    height: 3,
    length: '5',
    weight: null,
    depositedAt: DateTime.fromISO('2019-05-02T20:21:01').toSQL(),
    dispatchedAt: null,
    expectedAmount: null,
    paidAmount: null,
    status: 'STORED',
  }),
  sequelizeUtil.withInsertTimeStamp({
    id: 4,
    inventoryTypeId: 2,
    depositReceiptId: 3,
    dispatchReceiptId: null,
    width: null,
    height: null,
    length: null,
    weight: 3,
    depositedAt: DateTime.fromISO('2019-05-03T08:02:00').toSQL(),
    dispatchedAt: null,
    expectedAmount: null,
    paidAmount: null,
    status: 'DEPOSITED',
  }),
  sequelizeUtil.withInsertTimeStamp({
    id: 5,
    inventoryTypeId: 2,
    depositReceiptId: 3,
    dispatchReceiptId: null,
    width: null,
    height: null,
    length: null,
    weight: null,
    depositedAt: DateTime.fromISO('2019-05-03T08:03:00').toSQL(),
    dispatchedAt: null,
    expectedAmount: null,
    paidAmount: null,
    status: 'DEPOSITED',
  }),
  sequelizeUtil.withInsertTimeStamp({
    id: 6,
    inventoryTypeId: 3,
    depositReceiptId: 3,
    dispatchReceiptId: null,
    width: 2,
    height: 2,
    length: '2',
    weight: null,
    depositedAt: DateTime.fromISO('2019-05-03T08:03:00').toSQL(),
    dispatchedAt: null,
    expectedAmount: null,
    paidAmount: null,
    status: 'DEPOSITED',
  }),
];

const user = [
  sequelizeUtil.withInsertTimeStamp({
    id: 1,
    uid: 'llp01-829ff-v29v0-z3d1s',
    role: 'ADMIN',
    firstName: 'Christine',
    lastName: 'Foster',
  }),
];

const inventoryAudit = [
  sequelizeUtil.withInsertTimeStamp({
    id: 1,
    inventoryId: 1,
    userId: 1,
    action: 'ADDED',
    status: 'DEPOSITED',
    remark: null,
  }),
  sequelizeUtil.withInsertTimeStamp({
    id: 2,
    inventoryId: 1,
    userId: 1,
    action: 'UPDATED',
    status: 'STORED',
    remark: null,
  }),
  sequelizeUtil.withInsertTimeStamp({
    id: 3,
    inventoryId: 1,
    userId: 1,
    action: 'UPDATED',
    status: 'DISPATCHED',
    remark: null,
  }),
  sequelizeUtil.withInsertTimeStamp({
    id: 4,
    inventoryId: 1,
    userId: 1,
    action: 'UPDATED',
    status: 'PAID',
    remark: null,
  }),
  sequelizeUtil.withInsertTimeStamp({
    id: 5,
    inventoryId: 2,
    userId: 1,
    action: 'ADDED',
    status: 'DEPOSITED',
    remark: null,
  }),
  sequelizeUtil.withInsertTimeStamp({
    id: 6,
    inventoryId: 2,
    userId: 1,
    action: 'UPDATED',
    status: 'STORED',
    remark: null,
  }),
  sequelizeUtil.withInsertTimeStamp({
    id: 7,
    inventoryId: 2,
    userId: 1,
    action: 'UPDATED',
    status: 'DISPATCHED',
    remark: null,
  }),
  sequelizeUtil.withInsertTimeStamp({
    id: 8,
    inventoryId: 2,
    userId: 1,
    action: 'UPDATED',
    status: 'PAID',
    remark: null,
  }),
  sequelizeUtil.withInsertTimeStamp({
    id: 9,
    inventoryId: 3,
    userId: 1,
    action: 'ADDED',
    status: 'DEPOSITED',
    remark: null,
  }),
  sequelizeUtil.withInsertTimeStamp({
    id: 10,
    inventoryId: 3,
    userId: 1,
    action: 'UPDATED',
    status: 'STORED',
    remark: null,
  }),
  sequelizeUtil.withInsertTimeStamp({
    id: 11,
    inventoryId: 4,
    userId: 1,
    action: 'ADDED',
    status: 'DEPOSITED',
    remark: null,
  }),
  sequelizeUtil.withInsertTimeStamp({
    id: 12,
    inventoryId: 5,
    userId: 1,
    action: 'ADDED',
    status: 'DEPOSITED',
    remark: null,
  }),
  sequelizeUtil.withInsertTimeStamp({
    id: 13,
    inventoryId: 6,
    userId: 1,
    action: 'ADDED',
    status: 'DEPOSITED',
    remark: null,
  }),
];

const customerAudit = [
  sequelizeUtil.withInsertTimeStamp({
    id: 1,
    customerId: 1,
    userId: 1,
    previousInformation: null,
    currentInformation: '{"id":1,"uid":"sxm01-222ll-30osi-22019","firstName":"Henry","lastName":"Doe","identificationNumber":"AA0000001","mobileNumber":"0900000001","email":"john.doe@customer-test.com","createdAt":"2019-05-05 11:56:49.180","updatedAt":"2019-05-03 11:56:49.205","deletedAt":null}',
    remark: 'new customer',
  }),
  sequelizeUtil.withInsertTimeStamp({
    id: 2,
    customerId: 1,
    userId: 1,
    previousInformation: '{"id":1,"uid":"sxm01-222ll-30osi-22019","firstName":"Henry","lastName":"Doe","identificationNumber":"AA0000001","mobileNumber":"0900000001","email":"john.doe@customer-test.com","createdAt":"2019-05-05 11:56:49.180","updatedAt":"2019-05-03 11:56:49.205","deletedAt":null}',
    currentInformation: '{"id":1,"uid":"sxm01-222ll-30osi-22019","firstName":"John","lastName":"Doe","identificationNumber":"AA0000001","mobileNumber":"0900000001","email":"john.doe@customer-test.com","createdAt":"2019-05-05 11:56:49.180","updatedAt":"2019-05-05 11:56:49.205","deletedAt":null}',
    remark: 'change information',
  }),
  sequelizeUtil.withInsertTimeStamp({
    id: 3,
    customerId: 2,
    userId: 1,
    previousInformation: null,
    currentInformation: '{"id":2,"uid":"xooi1-yyysa-290sx-m019s","firstName":"Marie","lastName":"Perry","identificationNumber":"AA0000002","mobileNumber":"0900000002","email":"marie.perry@mycompany-test.com","createdAt":"2019-05-05 11:59:37.797","updatedAt":"2019-05-05 11:59:37.802","deletedAt":null}',
    remark: 'new customer',
  }),
];

const payment = [
  sequelizeUtil.withInsertTimeStamp({
    id: 1,
    paymentReference: 'PAY1539249943114',
    amount: 620,
    status: 'PAID',
  }),
];

export default {
  up: (queryInterface) => {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.bulkInsert(tableName.inventoryType, inventoryType, { transaction }),
        queryInterface.bulkInsert(tableName.inventoryTypePrice, inventoryTypePrice, { transaction }),
        queryInterface.bulkInsert(tableName.customer, customer, { transaction }),
        queryInterface.bulkInsert(tableName.depositReceipt, depositReceipt, { transaction }),
        queryInterface.bulkInsert(tableName.shipment, shipment, { transaction }),
        queryInterface.bulkInsert(tableName.dispatchReceipt, dispatchReceipt, { transaction }),
        queryInterface.bulkInsert(tableName.inventory, inventory, { transaction }),
        queryInterface.bulkInsert(tableName.user, user, { transaction }),
        queryInterface.bulkInsert(tableName.inventoryAudit, inventoryAudit, { transaction }),
        queryInterface.bulkInsert(tableName.customerAudit, customerAudit, { transaction }),
        queryInterface.bulkInsert(tableName.payment, payment, { transaction }),
      ]);
    });
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.bulkDelete(tableName.payment, { id: [1] }, { transaction }),
        queryInterface.bulkDelete(tableName.customerAudit, { id: [1, 2, 3] }, { transaction }),
        queryInterface.bulkDelete(tableName.inventoryAudit, { id: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13] }, { transaction }),
        queryInterface.bulkDelete(tableName.user, { id: [1] }, { transaction }),
        queryInterface.bulkDelete(tableName.inventory, { id: [1, 2, 3, 4, 5, 6] }, { transaction }),
        queryInterface.bulkDelete(tableName.dispatchReceipt, { id: [1] }, { transaction }),
        queryInterface.bulkDelete(tableName.shipment, { id: [1] }, { transaction }),
        queryInterface.bulkDelete(tableName.depositReceipt, { id: [1, 2, 3] }, { transaction }),
        queryInterface.bulkDelete(tableName.customer, { id: [1, 2] }, { transaction }),
        queryInterface.bulkDelete(tableName.inventoryTypePrice, { id: [1, 2, 3, 4] }, { transaction }),
        queryInterface.bulkDelete(tableName.inventoryType, { id: [1, 2, 3, 4] }, { transaction }),
      ]);
    });
  },
};
