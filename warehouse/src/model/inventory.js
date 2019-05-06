import sequelizeUtil from '../util/sequelize';

export default (sequelize, Sequelize) => {

  const attributes = sequelizeUtil.withDefaultTableFields({
    inventoryTypeId: { type: Sequelize.BIGINT },
    depositReceiptId: { type: Sequelize.BIGINT },
    dispatchReceiptId: { type: Sequelize.BIGINT },
    width: { type: Sequelize.DECIMAL(10, 2) },
    height: { type: Sequelize.DECIMAL(10, 2) },
    length: { type: Sequelize.DECIMAL(10, 2) },
    weight: { type: Sequelize.DECIMAL(10, 2) },
    depositedAt: { type: Sequelize.DATE },
    dispatchedAt: { type: Sequelize.DATE },
    expectedAmount: { type: Sequelize.DECIMAL(10, 2) },
    paidAmount: { type: Sequelize.DECIMAL(10, 2) },
    status: { type: Sequelize.STRING },
  }, Sequelize);

  const inventory = sequelize.define(
    'inventory',
    sequelizeUtil.appendKeyField(attributes),
    {
      paranoid: true,
    }
  );

  inventory.associate = (models) => {
    inventory.belongsTo(models.inventoryType, { as: 'inventoryType' });
    inventory.belongsTo(models.depositReceipt, { as: 'depositReceipt' });
    inventory.belongsTo(models.dispatchReceipt, { as: 'dispatchReceipt' });
    inventory.hasMany(models.inventoryAudit, { as: 'inventoriesAudit' });
  };

  return inventory;
};
