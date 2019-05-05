import sequelizeUtil from '../util/sequelize';

export default (sequelize, Sequelize) => {

  const attributes = sequelizeUtil.withDefaultTableFields({
    uid: { type: Sequelize.STRING },
    role: { type: Sequelize.STRING },
    firstName: { type: Sequelize.STRING },
    lastName: { type: Sequelize.STRING },
  }, Sequelize);

  const user = sequelize.define(
    'user',
    attributes,
    {
      paranoid: true,
    }
  );

  user.associate = (models) => {
    user.hasMany(models.inventoryAudit, { as: 'inventoriesAudit' });
    user.hasMany(models.customerAudit, { as: 'customersAudit' });
  };

  return user;
};
