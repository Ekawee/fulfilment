import sequelizeUtil from '../util/sequelize';

export default (sequelize, Sequelize) => {

  const attributes = sequelizeUtil.withDefaultTableFields({
    customerId: { type: Sequelize.BIGINT },
    shipmentId: { type: Sequelize.BIGINT },
    dispatchReceiptNumber: { type: Sequelize.STRING },
    paymentReference: { type: Sequelize.STRING },
    depositAmount: { type: Sequelize.DECIMAL(10, 2) },
    shipAmount: { type: Sequelize.DECIMAL(10, 2) },
    netAmount: { type: Sequelize.DECIMAL(10, 2) },
  }, Sequelize);

  const dispatchReceipt = sequelize.define(
    'dispatch_receipt',
    sequelizeUtil.appendKeyField(attributes),
    {
      paranoid: true,
    }
  );

  dispatchReceipt.associate = (models) => {
    dispatchReceipt.belongsTo(models.customer, { as: 'customer' });
    dispatchReceipt.belongsTo(models.shipment, { as: 'shipment' });
    dispatchReceipt.hasMany(models.inventory, { as: 'inventories' });
  };

  return dispatchReceipt;
};
