import sequelizeUtil from '../util/sequelize';

export default (sequelize, Sequelize) => {

  const attributes = sequelizeUtil.withDefaultTableFields({
    name: { type: Sequelize.STRING },
  }, Sequelize);

  const inventoryType = sequelize.define(
    'inventory_type',
    sequelizeUtil.appendKeyField(attributes),
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
