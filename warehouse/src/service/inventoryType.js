import { map, omit } from 'lodash/fp';
import { DateTime } from 'luxon';
import { Op } from 'sequelize';
import model from '../model';
import sequelizeUtil from '../util/sequelize';

/*
 * query inventory type by id.
 * @param1 string inventory type id.
 * @return object contain inventory type include current price.
 */
const getByPk = async (id, modelOptions) => {

  const inventoryTypePrice = await model.inventoryTypePrice.findOne({
    where: {
      inventoryTypeId: id,
      [Op.and]: {
        effectiveDate: {
          [Op.lte]: DateTime.utc().toString(),
        },
        expiryDate: {
          [Op.gte]: DateTime.utc().toString(),
        },
      },
    },
    include: [
      {
        model: model.inventoryType,
        as: 'inventoryType',
      }
    ],
    ...modelOptions,
  });

  const inventoryTypePriceObject = sequelizeUtil.modelToObject(inventoryTypePrice);

  const flatInventoryType = {
    ...omit(['id', 'inventoryType', 'createdAt', 'updatedAt', 'deletedAt'])(inventoryTypePriceObject),
    ...(inventoryTypePriceObject.inventoryType),
  };

  return flatInventoryType;
};

export default {
  getByPk,
};
