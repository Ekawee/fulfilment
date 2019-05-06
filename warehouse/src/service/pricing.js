import { getOr } from 'lodash/fp';
import { Op } from 'sequelize';
import { DateTime } from 'luxon';
import model from '../model';
import DatetimeUtil from '../util/datetime';
import { UNIT_MEASURE_TYPE } from '../constants';

const calculateInventoryDeposited = async (inventoryId, modelOptions) => {
  const { transaction } = modelOptions;

  const inventory = await model.inventory.findByPk(inventoryId, modelOptions);
  const inventoryTypeId = getOr(null, 'inventoryTypeId')(inventory);
  const depositedAt = getOr(null, 'depositedAt')(inventory);

  const inventoryTypePrice = await model.inventoryTypePrice.findOne({
    where: {
      inventoryTypeId,
      [Op.and]: {
        effectiveDate: {
          [Op.lte]: depositedAt,
        },
        expiryDate: {
          [Op.gte]: depositedAt,
        },
      },
    },
    transaction,
  });

  /*
   * unitMeasureType to know what measure fields from inventory table we should get.
   * Between:
   * - [DIMENSION] stand for [width, height, length].
   * - or [WEIGHT] stand for [weight].
   * - or [CHARTER] stand for [day count].
   */
  const unitMeasureType = getOr(null, 'unitMeasureType')(inventoryTypePrice);
  const amountPerUnitMeasure = getOr(0, 'amountPerUnitMeasure')(inventoryTypePrice);
  const price = getOr(0, 'price')(inventoryTypePrice);
  const multiplyPricePerDay = getOr(0, 'multiplyPricePerDay')(inventoryTypePrice);
  const pricePerOneUnit = price / amountPerUnitMeasure;

  const width = getOr(0, 'width')(inventory);
  const height = getOr(0, 'height')(inventory);
  const length = getOr(0, 'length')(inventory);
  const weight = getOr(0, 'weight')(inventory);

  const today = DateTime.utc().toISO();
  const dayCount = Math.floor(DatetimeUtil.diffDateInUnit(today, depositedAt, 'days'));

  const calculateByUnitMeasureType = {
    [UNIT_MEASURE_TYPE.DIMENSION]: () => {
      const dimension = width * height * length;
      return multiplyPricePerDay
      ? (Math.pow(multiplyPricePerDay, dayCount) - 1) * dimension * pricePerOneUnit
      : dimension * dayCount * pricePerOneUnit;
    },
    [UNIT_MEASURE_TYPE.WEIGHT]: () => {
      return weight * dayCount * pricePerOneUnit;
    },
    [UNIT_MEASURE_TYPE.CHARTER]: () => {
      return dayCount * pricePerOneUnit;
    },
    'default': () => 0,
  };

  return {
    dayCount,
    price: calculateByUnitMeasureType[unitMeasureType || 'default'](),
  };
};

export default {
  calculateInventoryDeposited,
};
