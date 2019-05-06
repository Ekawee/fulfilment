import { DateTime } from 'luxon';
import { Op } from 'sequelize';
import servicePricing from '../../src/service/pricing';
import model from '../../src/model';
import { UNIT_MEASURE_TYPE } from '../../src/constants';

jest.mock('../../src/model', () => ({
  inventory: {
    findByPk: jest.fn(),
  },
  inventoryTypePrice: {
    findOne: jest.fn(),
  },
}));

describe('/service/pricing/calculateInventoryDeposited', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return Supplementary Food price for 5 days', async () => {
    const mockInventoryId = 'inventory-id-1';
    const mockModelOptions = {
      transaction: 'transaction-id-12345',
    };

    const mockInventoryResponse = {
      inventoryTypeId: 'inventory-type-id-1',
      depositedAt: DateTime.fromISO('2019-05-01T16:21:01').toString(),
      width: 1.0,
      height: 1.0,
      length: 1.0,
      weight: null,
    };

    const mockInventoryTypePrice = {
      unitMeasure: 'SQ.CM',
      unitMeasureType: UNIT_MEASURE_TYPE.DIMENSION,
      amountPerUnitMeasure: 1.0,
      price: 1.0,
      multiplyPricePerDay: 2.0,
    };

    const mockToday = DateTime.fromISO('2019-05-06T14:00:21');

    /*
     * Expected calculate
     * dayCount: from 2019-05-01 to 2019-05-06 is 5 days doesn't care about time
     * price: 1 x 1 x 1 = 1 SQ.CM / 1 Baht / 1 Day (double price for next day)
     *  - day 1: 1 Baht
     *  - day 2: 2 Baht
     *  - day 3: 4 Baht
     *  - day 4: 8 Baht
     *  - day 5: 16 Bath
     *  - Total: 31 Bath
     */
    const expecetedResult = {
      dayCount: 5,
      price: 31,
    };

    DateTime.utc = jest.fn(() => mockToday);
    model.inventory.findByPk = jest.fn(() => mockInventoryResponse);
    model.inventoryTypePrice.findOne = jest.fn(() => mockInventoryTypePrice);

    const result = await servicePricing.calculateInventoryDeposited(mockInventoryId, mockModelOptions);

    expect(model.inventory.findByPk).toHaveBeenCalledWith(
      mockInventoryId,
      expect.objectContaining(mockModelOptions),
    );

    expect(model.inventory.findByPk).toHaveReturnedWith(
      expect.objectContaining(mockInventoryResponse),
    );

    expect(model.inventory.findByPk).toHaveBeenCalledTimes(1);

    expect(model.inventoryTypePrice.findOne).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          inventoryTypeId: mockInventoryResponse.inventoryTypeId,
          [Op.and]: {
            effectiveDate: expect.objectContaining({
              [Op.lte]: mockInventoryResponse.depositedAt,
            }),
            expiryDate: expect.objectContaining({
              [Op.gte]: mockInventoryResponse.depositedAt,
            }),
          },
        }),
        ...mockModelOptions,
      }),
    );

    expect(model.inventoryTypePrice.findOne).toHaveReturnedWith(
      expect.objectContaining(mockInventoryTypePrice),
    );

    expect(model.inventoryTypePrice.findOne).toHaveBeenCalledTimes(1);

    expect(result).toEqual(expecetedResult);
  });

  it('should return Clothes by weight price for 4 days', async () => {
    const mockInventoryId = 'inventory-id-1';
    const mockModelOptions = {
      transaction: 'transaction-id-12345',
    };

    const mockInventoryResponse = {
      inventoryTypeId: 'inventory-type-id-1',
      depositedAt: DateTime.fromISO('2019-05-03T20:21:01').toString(),
      width: null,
      height: null,
      length: null,
      weight: 3.0,
    };

    const mockInventoryTypePrice = {
      unitMeasure: 'KG',
      unitMeasureType: UNIT_MEASURE_TYPE.WEIGHT,
      amountPerUnitMeasure: 1.0,
      price: 20.0,
      multiplyPricePerDay: null,
    };

    const mockToday = DateTime.fromISO('2019-05-07T14:00:21');

    /*
     * Expected calculate
     * dayCount: from 2019-05-03 to 2019-05-07 is 4 days doesn't care about time
     * price: 3 KG / 20 Baht / 1 Day
     *  - day 1: 3 x 20 = 60 Baht
     *  - day 2: 3 x 20 = 60 Baht
     *  - day 3: 3 x 20 = 60 Baht
     *  - day 4: 3 x 20 = 60 Baht
     *  - Total: 240 Bath
     */
    const expecetedResult = {
      dayCount: 4,
      price: 240,
    };

    DateTime.utc = jest.fn(() => mockToday);
    model.inventory.findByPk = jest.fn(() => mockInventoryResponse);
    model.inventoryTypePrice.findOne = jest.fn(() => mockInventoryTypePrice);

    const result = await servicePricing.calculateInventoryDeposited(mockInventoryId, mockModelOptions);

    expect(model.inventory.findByPk).toHaveBeenCalledWith(
      mockInventoryId,
      expect.objectContaining(mockModelOptions),
    );

    expect(model.inventory.findByPk).toHaveReturnedWith(
      expect.objectContaining(mockInventoryResponse),
    );

    expect(model.inventory.findByPk).toHaveBeenCalledTimes(1);

    expect(model.inventoryTypePrice.findOne).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          inventoryTypeId: mockInventoryResponse.inventoryTypeId,
          [Op.and]: {
            effectiveDate: expect.objectContaining({
              [Op.lte]: mockInventoryResponse.depositedAt,
            }),
            expiryDate: expect.objectContaining({
              [Op.gte]: mockInventoryResponse.depositedAt,
            }),
          },
        }),
        ...mockModelOptions,
      }),
    );

    expect(model.inventoryTypePrice.findOne).toHaveReturnedWith(
      expect.objectContaining(mockInventoryTypePrice),
    );

    expect(model.inventoryTypePrice.findOne).toHaveBeenCalledTimes(1);

    expect(result).toEqual(expecetedResult);
  });

  it('should return Clothes by charter price for 3 days', async () => {
    const mockInventoryId = 'inventory-id-1';
    const mockModelOptions = {
      transaction: 'transaction-id-12345',
    };

    const mockInventoryResponse = {
      inventoryTypeId: 'inventory-type-id-1',
      depositedAt: DateTime.fromISO('2019-05-03T20:21:01').toString(),
      width: null,
      height: null,
      length: null,
      weight: null,
    };

    const mockInventoryTypePrice = {
      unitMeasure: 'DAY',
      unitMeasureType: UNIT_MEASURE_TYPE.CHARTER,
      amountPerUnitMeasure: 1.0,
      price: 50.0,
      multiplyPricePerDay: null,
    };

    const mockToday = DateTime.fromISO('2019-05-06T14:00:21');

    /*
     * Expected calculate
     * dayCount: from 2019-05-03 to 2019-05-06 is 3 days doesn't care about time
     * price: 50 Baht / 1 Day
     *  - day 1: 1 x 50 = 50 Baht
     *  - day 2: 1 x 50 = 50 Baht
     *  - day 3: 1 x 50 = 50 Baht
     *  - Total: 150 Bath
     */
    const expecetedResult = {
      dayCount: 3,
      price: 150,
    };

    DateTime.utc = jest.fn(() => mockToday);
    model.inventory.findByPk = jest.fn(() => mockInventoryResponse);
    model.inventoryTypePrice.findOne = jest.fn(() => mockInventoryTypePrice);

    const result = await servicePricing.calculateInventoryDeposited(mockInventoryId, mockModelOptions);

    expect(model.inventory.findByPk).toHaveBeenCalledWith(
      mockInventoryId,
      expect.objectContaining(mockModelOptions),
    );

    expect(model.inventory.findByPk).toHaveReturnedWith(
      expect.objectContaining(mockInventoryResponse),
    );

    expect(model.inventory.findByPk).toHaveBeenCalledTimes(1);

    expect(model.inventoryTypePrice.findOne).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          inventoryTypeId: mockInventoryResponse.inventoryTypeId,
          [Op.and]: {
            effectiveDate: expect.objectContaining({
              [Op.lte]: mockInventoryResponse.depositedAt,
            }),
            expiryDate: expect.objectContaining({
              [Op.gte]: mockInventoryResponse.depositedAt,
            }),
          },
        }),
        ...mockModelOptions,
      }),
    );

    expect(model.inventoryTypePrice.findOne).toHaveReturnedWith(
      expect.objectContaining(mockInventoryTypePrice),
    );

    expect(model.inventoryTypePrice.findOne).toHaveBeenCalledTimes(1);

    expect(result).toEqual(expecetedResult);
  });

  it('should return Others type price for 6 days', async () => {
    const mockInventoryId = 'inventory-id-1';
    const mockModelOptions = {
      transaction: 'transaction-id-12345',
    };

    const mockInventoryResponse = {
      inventoryTypeId: 'inventory-type-id-1',
      depositedAt: DateTime.fromISO('2019-05-01T20:21:01').toString(),
      width: 2.0,
      height: 2.0,
      length: 2.0,
      weight: null,
    };

    const mockInventoryTypePrice = {
      unitMeasure: 'SQ.M',
      unitMeasureType: UNIT_MEASURE_TYPE.DIMENSION,
      amountPerUnitMeasure: 1.0,
      price: 10.0,
      multiplyPricePerDay: null,
    };

    const mockToday = DateTime.fromISO('2019-05-07T14:00:21');

    /*
     * Expected calculate
     * dayCount: from 2019-05-01 to 2019-05-07 is 6 days doesn't care about time
     * price: 2 x 2 x 2 = 8 SQ.M / 10 Baht / 1 Day
     *  - day 1: 8 x 10 = 80 Baht
     *  - day 2: 8 x 10 = 80 Baht
     *  - day 3: 8 x 10 = 80 Baht
     *  - day 4: 8 x 10 = 80 Baht
     *  - day 5: 8 x 10 = 80 Baht
     *  - day 6: 8 x 10 = 80 Baht
     *  - Total: 480 Bath
     */
    const expecetedResult = {
      dayCount: 6,
      price: 480,
    };

    DateTime.utc = jest.fn(() => mockToday);
    model.inventory.findByPk = jest.fn(() => mockInventoryResponse);
    model.inventoryTypePrice.findOne = jest.fn(() => mockInventoryTypePrice);

    const result = await servicePricing.calculateInventoryDeposited(mockInventoryId, mockModelOptions);

    expect(model.inventory.findByPk).toHaveBeenCalledWith(
      mockInventoryId,
      expect.objectContaining(mockModelOptions),
    );

    expect(model.inventory.findByPk).toHaveReturnedWith(
      expect.objectContaining(mockInventoryResponse),
    );

    expect(model.inventory.findByPk).toHaveBeenCalledTimes(1);

    expect(model.inventoryTypePrice.findOne).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          inventoryTypeId: mockInventoryResponse.inventoryTypeId,
          [Op.and]: {
            effectiveDate: expect.objectContaining({
              [Op.lte]: mockInventoryResponse.depositedAt,
            }),
            expiryDate: expect.objectContaining({
              [Op.gte]: mockInventoryResponse.depositedAt,
            }),
          },
        }),
        ...mockModelOptions,
      }),
    );

    expect(model.inventoryTypePrice.findOne).toHaveReturnedWith(
      expect.objectContaining(mockInventoryTypePrice),
    );

    expect(model.inventoryTypePrice.findOne).toHaveBeenCalledTimes(1);

    expect(result).toEqual(expecetedResult);
  });

});
