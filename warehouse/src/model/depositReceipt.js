import sequelizeUtil from '../util/sequelize';

export default (sequelize, Sequelize) => {

  const attributes = sequelizeUtil.withDefaultTableFields({
    customerId: { type: Sequelize.BIGINT },
    depositReceiptNumber: { type: Sequelize.STRING },
  }, Sequelize);

  const depositReceipt = sequelize.define(
    'depositReceipt',
    attributes,
    {
      paranoid: true,
    }
  );

  depositReceipt.associate = (models) => {
    depositReceipt.belongsTo(models.customer, { as: 'customer' });
    depositReceipt.hasMany(models.inventory, { as: 'inventories' });
  };

  return depositReceipt;
};
