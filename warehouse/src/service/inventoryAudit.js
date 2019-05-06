import { map, compose } from 'lodash/fp';
import model from '../model';
import { INVENTORY_AUDIT } from '../constants';

const payloadMapper = (inventories, action) => map(
  inventory => ({
    inventoryId: inventory.id,
    action: action,
    status: inventory.status,
  })
)(inventories);

const logAdded = async (inventories, modelOptions) => {

  const inventoryAudit = Promise.all(compose(
    map(inventory => model.inventoryAudit.create(inventory, modelOptions)),
    () => payloadMapper(inventories, INVENTORY_AUDIT.ACTION.ADDED),
  )(inventories));

  return inventoryAudit;
};

export default {
  logAdded,
};
