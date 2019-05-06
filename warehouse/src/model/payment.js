import sequelizeUtil from '../util/sequelize';

export default (sequelize, Sequelize) => {

  const attributes = sequelizeUtil.withDefaultTableFields({
    paymentReference: { type: Sequelize.STRING },
    amount: { type: Sequelize.DECIMAL(10, 2) },
    status: { type: Sequelize.STRING },
  }, Sequelize);

  const payment = sequelize.define(
    'payment',
    sequelizeUtil.appendKeyField(attributes),
    {
      paranoid: true,
    }
  );

  return payment;
};
