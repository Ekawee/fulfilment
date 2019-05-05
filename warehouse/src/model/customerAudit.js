import sequelizeUtil from '../util/sequelize';

export default (sequelize, Sequelize) => {

  const attributes = sequelizeUtil.withDefaultTableFields({
    customerId: { type: Sequelize.BIGINT },
    userId: { type: Sequelize.BIGINT },
    previousInformation: { type: Sequelize.TEXT },
    currentInformation: { type: Sequelize.TEXT },
    remark: { type: Sequelize.STRING },
  }, Sequelize);

  const customerAudit = sequelize.define(
    'customerAudit',
    attributes,
    {
      paranoid: true,
    }
  );

  customerAudit.associate = (models) => {
    customerAudit.belongsTo(models.customer, { as: 'customer' });
    customerAudit.belongsTo(models.user, { as: 'user' });
  };

  return customerAudit;
};
