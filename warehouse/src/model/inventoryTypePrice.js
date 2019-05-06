import sequelizeUtil from '../util/sequelize';

export default (sequelize, Sequelize) => {

  const attributes = sequelizeUtil.withDefaultTableFields({
    inventoryTypeId: { type: Sequelize.BIGINT },
    effectiveDate: { type: Sequelize.DATE },
    expiryDate: { type: Sequelize.DATE },
    price: { type: Sequelize.DECIMAL(10, 2) },
    unitMeasure: { type: Sequelize.STRING },
    unitMeasureType: { type: Sequelize.STRING },
    amountPerUnitMeasure: { type: Sequelize.DECIMAL(10, 2) },
    multiplyPricePerDay: { type: Sequelize.DECIMAL(10, 2) },
  }, Sequelize);

  const inventoryTypePrice = sequelize.define(
    'inventory_type_price',
    sequelizeUtil.appendKeyField(attributes),
    {
      paranoid: true,
    }
  );

  inventoryTypePrice.associate = (models) => {
    inventoryTypePrice.belongsTo(models.inventoryType, { as: 'inventoryType' });
  };

  return inventoryTypePrice;
};
