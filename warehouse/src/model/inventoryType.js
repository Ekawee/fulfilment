import sequelizeUtil from '../util/sequelize';

export default (sequelize, Sequelize) => {

  const attributes = sequelizeUtil.withDefaultTableFields({
    name: { type: Sequelize.STRING },
  }, Sequelize);

  const inventoryType = sequelize.define(
    'inventoryType',
    attributes,
    {
      paranoid: true,
    }
  );

  inventoryType.associate = (models) => {
    inventoryType.hasMany(models.inventoryTypePrice, { as: 'inventoryTypePrices' });
    inventoryType.hasMany(models.inventory, { as: 'inventories' });
  };

  return inventoryType;
};
