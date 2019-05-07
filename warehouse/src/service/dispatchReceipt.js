import generate from 'nanoid/generate';
import { compose, upperCase, last, map, head } from 'lodash/fp';
import sequelizeUtil from '../util/sequelize';
import model from '../model';
import service from '.';
import { DISPATCH_RECEIPT_NUMBER, INVENTORY_AUDIT } from '../constants';
import { BadRequestException } from '../exception';

/*
 * generate random keys to combine with A-Z and 0-9
 * @return string.
 */
const generateDispatchReceiptNumber = compose(
  (str) => str.replace(/ /g, ''),
  upperCase,
  () => generate(DISPATCH_RECEIPT_NUMBER.CHARACTER, DISPATCH_RECEIPT_NUMBER.LENGTH),
);

/*
 * after paid via payment. then update dispatch receipt with payment reference.
 * and update inventory status with PAID.
 * @return dispatch receipt info
 */
const updatePaid = async (data, modelOptions) => {
  const { paymentReference, dispatchReceiptNumber } = data;

  const dispatchReceiptUpdated = await model.dispatchReceipt.update(
    { paymentReference },
    {
      where: { dispatchReceiptNumber },
      returning: true,
      plain: true,
      ...modelOptions,
    }
  );

  if(head(dispatchReceiptUpdated) === 0) {
    throw new BadRequestException(`there is no dispatch receipt number ${dispatchReceiptNumber}`);
  }

  const dispatchReceipt = last(dispatchReceiptUpdated);

  const inventories = await model.inventory.findAll({
    where: { dispatchReceiptId: dispatchReceipt.id },
    ...modelOptions,
  });

  /*
   * update inventories status
   */
  const inventoriesUpdated = await Promise.all(compose(
    map(async (inventory) => {
      const inventoryUpdatePayload = {
        status: INVENTORY_AUDIT.STATUS.PAID,
      };
      const inventoryUpdate = await model.inventory.update(
        inventoryUpdatePayload,
        {
          where: {
            id: inventory.id,
          },
          returning: true,
          plain: true,
          ...modelOptions,
        },
      );
      return sequelizeUtil.modelToObject(last(inventoryUpdate));
    })
  )(inventories));

  await service.inventoryAudit.logUpdated(inventoriesUpdated, modelOptions);

  return sequelizeUtil.modelToObject(dispatchReceipt);
};

export default {
  updatePaid,
  generateDispatchReceiptNumber,
};
