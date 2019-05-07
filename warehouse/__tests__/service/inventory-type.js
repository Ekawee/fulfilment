import { Op } from 'sequelize';
import { DateTime } from 'luxon';
import serviceInventoryType from '../../src/service/inventoryType';
import model from '../../src/model';

jest.mock('../../src/model', () => ({
  inventoryTypePrice: {
    findOne: jest.fn(),
  },
}));


describe('/service/inventoryType/getByPk', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return inventory type include price', async () => {
    const mockInventoryTypeId = 'inventory-type-id-1';

    const mockModelOptions = {
      transaction: 'transaction-id-12345',
    };

    const mockfindOneResponse = {
      id: mockInventoryTypeId,
      name: 'Supplementary Food',
      inventoryType: {
        inventoryTypeId: mockInventoryTypeId,
        effectiveDate: '2019-01-01T00:00:00.000Z',
        expiryDate: '2019-12-31T00:00:00.000Z',
        price: 3,
        unitMeasure: 'SQ.CM',
        unitMeasureType: 'DIMENSION',
        amountPerUnitMeasure: 1,
        multiplyPricePerDay: 4,
      },
    };

    const expected = {
      id: mockInventoryTypeId,
      name: 'Supplementary Food',
      inventoryTypeId: mockInventoryTypeId,
      effectiveDate: '2019-01-01T00:00:00.000Z',
      expiryDate: '2019-12-31T00:00:00.000Z',
      price: 3,
      unitMeasure: 'SQ.CM',
      unitMeasureType: 'DIMENSION',
      amountPerUnitMeasure: 1,
      multiplyPricePerDay: 4,
    };

    const mockToday = DateTime.fromISO('2019-05-01');
    DateTime.utc = jest.fn(() => mockToday);
    model.inventoryTypePrice.findOne = jest.fn(() => mockfindOneResponse);

    const result = await serviceInventoryType.getByPk(mockInventoryTypeId, mockModelOptions);

    expect(model.inventoryTypePrice.findOne).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          inventoryTypeId: mockInventoryTypeId,
          [Op.and]: expect.objectContaining({
            effectiveDate: expect.objectContaining({
              [Op.lte]: mockToday.toString(),
            }),
            expiryDate: expect.objectContaining({
              [Op.gte]: mockToday.toString(),
            }),
          }),
        }),
        ...mockModelOptions,
      }),
    );

    expect(model.inventoryTypePrice.findOne).toHaveReturnedWith(
      expect.objectContaining(mockfindOneResponse),
    );

    expect(model.inventoryTypePrice.findOne).toHaveBeenCalledTimes(1);

    expect(result).toEqual(expected);
  });
});
