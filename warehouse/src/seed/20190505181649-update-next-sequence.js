/* eslint-disable quotes */
/*
 * Fix issue from 20190505051635-initial-sample-data.js
 * Becasue there are specify id when seeding.
 * But sequence table doesn't update.
 * The problem is when insert id with DEFAULT value the validator constraint id key will error.
 */

export default {
  up: (queryInterface) => {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.sequelize.query(`SELECT setval('inventory_type_id_seq', (SELECT MAX(id) FROM "inventory_type"))`, { transaction }),
        queryInterface.sequelize.query(`SELECT setval('inventory_type_price_id_seq', (SELECT MAX(id) FROM "inventory_type_price"))`, { transaction }),
        queryInterface.sequelize.query(`SELECT setval('customer_id_seq', (SELECT MAX(id) FROM "customer"))`, { transaction }),
        queryInterface.sequelize.query(`SELECT setval('deposit_receipt_id_seq', (SELECT MAX(id) FROM "deposit_receipt"))`, { transaction }),
        queryInterface.sequelize.query(`SELECT setval('shipment_id_seq', (SELECT MAX(id) FROM "shipment"))`, { transaction }),
        queryInterface.sequelize.query(`SELECT setval('dispatch_receipt_id_seq', (SELECT MAX(id) FROM "dispatch_receipt"))`, { transaction }),
        queryInterface.sequelize.query(`SELECT setval('inventory_id_seq', (SELECT MAX(id) FROM "inventory"))`, { transaction }),
        queryInterface.sequelize.query(`SELECT setval('user_id_seq', (SELECT MAX(id) FROM "user"))`, { transaction }),
        queryInterface.sequelize.query(`SELECT setval('inventory_audit_id_seq', (SELECT MAX(id) FROM "inventory_audit"))`, { transaction }),
        queryInterface.sequelize.query(`SELECT setval('customer_audit_id_seq', (SELECT MAX(id) FROM "customer_audit"))`, { transaction }),
        queryInterface.sequelize.query(`SELECT setval('payment_id_seq', (SELECT MAX(id) FROM "payment"))`, { transaction }),
      ]);
    });
  },

  down: () => {},
};
