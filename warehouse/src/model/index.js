import Sequelize from 'sequelize';
import config from '../config';
import inventoryType from './inventoryType';
import inventoryTypePrice from './inventoryTypePrice';
import customer from './customer';
import depositReceipt from './depositReceipt';
import shipment from './shipment';
import dispatchReceipt from './dispatchReceipt';
import inventory from './inventory';
import user from './user';
import inventoryAudit from './inventoryAudit';
import customerAudit from './customerAudit';
import payment from './payment';

Sequelize.postgres.DECIMAL.parse = (value) => parseFloat(value);

const sequelize = new Sequelize(
  config.dbScheme,
  config.dbUser,
  config.dbPassword,
  {
    host: config.dbHost,
    dialect: 'postgres',
    operatorAliases: false,
    logging: (config.isEnableDBlogging === 'true'),
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: {
      timestamps: true,
      freezeTableName: true,
    },
  }
);

const db = {
  inventoryType: sequelize.import('inventoryType', inventoryType),
  inventoryTypePrice: sequelize.import('inventoryTypePrice', inventoryTypePrice),
  customer: sequelize.import('customer', customer),
  depositReceipt: sequelize.import('depositReceipt', depositReceipt),
  shipment: sequelize.import('shipment', shipment),
  dispatchReceipt: sequelize.import('dispatchReceipt', dispatchReceipt),
  inventory: sequelize.import('inventory', inventory),
  user: sequelize.import('user', user),
  inventoryAudit: sequelize.import('inventoryAudit', inventoryAudit),
  customerAudit: sequelize.import('customerAudit', customerAudit),
  payment: sequelize.import('payment', payment),
};

Object.keys(db).forEach(model => {
  if (db[model].associate) {
    db[model].associate(db);
  }
});

db.sequelize = sequelize; // Configured model
db.Sequelize = Sequelize; // Sequelize library

export default db;
