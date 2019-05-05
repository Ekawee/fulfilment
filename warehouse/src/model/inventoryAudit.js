import sequelizeUtil from '../util/sequelize';

export default (sequelize, Sequelize) => {

  const attributes = sequelizeUtil.withDefaultTableFields({
    inventoryId: { type: Sequelize.STRING },
    userId: { type: Sequelize.STRING },
    action: { type: Sequelize.STRING },
    status: { type: Sequelize.STRING },
    remark: { type: Sequelize.TEXT },
  }, Sequelize);

  const inventoryAudit = sequelize.define(
    'inventoryAudit',
    attributes,
    {
      paranoid: true,
    }
  );

  inventoryAudit.associate = (models) => {
    inventoryAudit.belongsTo(models.inventory, { as: 'inventory' });
    inventoryAudit.belongsTo(models.user, { as: 'user' });
  };

  return inventoryAudit;
};
