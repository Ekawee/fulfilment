import sequelizeUtil from '../util/sequelize';

export default (sequelize, Sequelize) => {

  const attributes = sequelizeUtil.withDefaultTableFields({
    uid: { type: Sequelize.STRING },
    firstName: { type: Sequelize.STRING },
    lastName: { type: Sequelize.STRING },
    identificationNumber: { type: Sequelize.STRING },
    mobileNumber: { type: Sequelize.STRING },
    email: { type: Sequelize.STRING },
  }, Sequelize);

  const customer = sequelize.define(
    'customer',
    attributes,
    {
      paranoid: true,
    }
  );

  customer.associate = (models) => {
    customer.hasMany(models.depositReceipt, { as: 'depositReceipts' });
    customer.hasMany(models.dispatchReceipt, { as: 'dispatchReceipts' });
  };

  return customer;
};
