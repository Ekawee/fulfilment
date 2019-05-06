import sequelizeUtil from '../util/sequelize';

export default (sequelize, Sequelize) => {

  const attributes = sequelizeUtil.withDefaultTableFields({
    name: { type: Sequelize.STRING },
    address: { type: Sequelize.STRING },
    mobileNumber: { type: Sequelize.STRING },
    email: { type: Sequelize.STRING },
  }, Sequelize);

  const shipment = sequelize.define(
    'shipment',
    sequelizeUtil.appendKeyField(attributes),
    {
      paranoid: true,
    }
  );

  shipment.associate = (models) => {
    shipment.hasMany(models.dispatchReceipt, { as: 'dispatchReceipts' });
  };

  return shipment;
};
