import { map } from 'lodash/fp';
import model from '../model';
import { INVENTORY_AUDIT } from '../constants';

/*
 * keep logging when inventory records were inserted.
 */
const logAdded = async (inventories, modelOptions) => {

  const inventoryAudit = Promise.all(
    map(async inventory => {
      const payload = {
        inventoryId: inventory.id,
        action: INVENTORY_AUDIT.ACTION.ADDED,
        status: inventory.status,
      };
      return model.inventoryAudit.create(payload, modelOptions);
    })(inventories)
  );

  return inventoryAudit;
};

/*
 * keep logging when inventory records were updated.
 */
const logUpdated = async (inventories, modelOptions) => {

  const inventoryAudit = Promise.all(
    map(async inventory => {
      const payload = {
        inventoryId: inventory.id,
        action: INVENTORY_AUDIT.ACTION.UPDATED,
        status: inventory.status,
      };
      return model.inventoryAudit.create(payload, modelOptions);
    })(inventories)
  );

  return inventoryAudit;
};

export default {
  logAdded,
  logUpdated,
};
