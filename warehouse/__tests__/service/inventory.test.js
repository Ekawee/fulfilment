import { find } from 'lodash/fp';
import serviceInventory from '../../src/service/inventory';
import model from '../../src/model';
import service from '../../src/service';

jest.mock('../../src/model', () => ({
  inventory: {
    findAll: jest.fn(),
    findByPk: jest.fn(),
  },
}));

jest.mock('../../src/service', () => ({
  pricing: {
    calculateInventoryDeposited: jest.fn(),
  },
}));

describe('/service/inventory/getByDepositeReceiptPk', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return invetories list by using depositReceiptId (found)', async () => {
    const mockDepositReceiptId = 'deposit-receipt-id-1';

    const mockModelOptions = {
      transaction: 'transaction-id-12345',
    };

    const mockInventoriesResponse = [
      {
        id: 'inventory-id-1',
        inventoryTypeId: '1',
        depositReceiptId: 'deposit-receipt-id-1',
        dispatchReceiptId: '1',
        width: '5',
        height: '3',
        length: '10',
        weight: null,
        depositedAt: '2019-05-02T14:30:20.000Z',
        dispatchedAt: '2019-05-04T20:13:05.000Z',
        expectedAmount: '300',
        paidAmount: '300',
        status: 'PAID',
        price: '1000',
        dayCount: '10',
      },
      {
        id: 'inventory-id-2',
        inventoryTypeId: '1',
        depositReceiptId: 'deposit-receipt-id-2',
        dispatchReceiptId: '1',
        width: '5',
        height: '3',
        length: '10',
        weight: null,
        depositedAt: '2019-05-02T14:30:20.000Z',
        dispatchedAt: '2019-05-04T20:13:05.000Z',
        expectedAmount: '300',
        paidAmount: '300',
        status: 'PAID',
        price: '2000',
        dayCount: '9',
      },
    ];

    const pricingResponse = [
      {
        id: 'inventory-id-1',
        price: '1000',
        dayCount: '10',
      },
      {
        id: 'inventory-id-2',
        price: '2000',
        dayCount: '9',
      },
    ];

    model.inventory.findAll = jest.fn(
      ({ where: { depositReceiptId } }) => [find({ depositReceiptId })(mockInventoriesResponse)]
      );
    service.pricing.calculateInventoryDeposited = jest.fn((id) => find({ id })(pricingResponse));

    const result = await serviceInventory.getByDepositeReceiptPk(mockDepositReceiptId, mockModelOptions);

    expect(model.inventory.findAll).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          depositReceiptId: mockDepositReceiptId,
        }),
        ...mockModelOptions,
      }),
    );

    // Return only index 0
    expect(model.inventory.findAll).toHaveReturnedWith(
      expect.arrayContaining([mockInventoriesResponse[0]]),
    );

    expect(model.inventory.findAll).toHaveBeenCalledTimes(1);

    expect(result).toHaveLength(1);
    expect(result).toEqual([mockInventoriesResponse[0]]);
  });
});

describe('/service/inventory/getByDispatchReceiptPk', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return invetories list by using dispatchReceiptId (found)', async () => {
    const mockDispatchReceiptId = 'dispatch-receipt-1';

    const mockModelOptions = {
      transaction: 'transaction-id-12345',
    };

    const mockInventoriesResponse = [
      {
        id: 'inventory-id-1',
        inventoryTypeId: '1',
        depositReceiptId: '1',
        dispatchReceiptId: 'dispatch-receipt-1',
        width: '5',
        height: '3',
        length: '10',
        weight: null,
        depositedAt: '2019-05-02T14:30:20.000Z',
        dispatchedAt: '2019-05-04T20:13:05.000Z',
        expectedAmount: '300',
        paidAmount: '300',
        status: 'PAID',
      },
      {
        id: 'inventory-id-2',
        inventoryTypeId: '1',
        depositReceiptId: '2',
        dispatchReceiptId: 'dispatch-receipt-2',
        width: '5',
        height: '3',
        length: '10',
        weight: null,
        depositedAt: '2019-05-02T14:30:20.000Z',
        dispatchedAt: '2019-05-04T20:13:05.000Z',
        expectedAmount: '300',
        paidAmount: '300',
        status: 'PAID',
      },
    ];

    model.inventory.findAll = jest.fn(
      ({ where: { dispatchReceiptId } }) => [find({ dispatchReceiptId })(mockInventoriesResponse)]
      );

    const result = await serviceInventory.getByDispatchReceiptPk(mockDispatchReceiptId, mockModelOptions);

    expect(model.inventory.findAll).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          dispatchReceiptId: mockDispatchReceiptId,
        }),
        ...mockModelOptions,
      }),
    );

    // Return only index 0
    expect(model.inventory.findAll).toHaveReturnedWith(
      expect.arrayContaining([mockInventoriesResponse[0]]),
    );

    expect(model.inventory.findAll).toHaveBeenCalledTimes(1);

    expect(result).toHaveLength(1);
    expect(result).toEqual([mockInventoriesResponse[0]]);
  });
});

describe('/service/inventory/getByPk', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return invetory list by using id', async () => {
    const mockInvetoryId = 'inventory-id-1';

    const mockModelOptions = {
      transaction: 'transaction-id-12345',
    };

    const mockInvetoryResponse = {
      id: mockInvetoryId,
      inventoryTypeId: '1',
      depositReceiptId: '2',
      dispatchReceiptId: 'dispatch-receipt-2',
      width: '5',
      height: '3',
      length: '10',
      weight: null,
      depositedAt: '2019-05-02T14:30:20.000Z',
      dispatchedAt: '2019-05-04T20:13:05.000Z',
      expectedAmount: '300',
      paidAmount: '300',
      status: 'PAID',
    };

    const mockPricing = {
      id: mockInvetoryId,
      price: 200,
      dayCount: 3,
    };

    const expected = {
      ...mockInvetoryResponse,
      ...mockPricing,
    };

    model.inventory.findByPk = jest.fn(() => mockInvetoryResponse);
    service.pricing.calculateInventoryDeposited = jest.fn(() => mockPricing);

    const result = await serviceInventory.getByPk(mockInvetoryId, mockModelOptions);

    expect(model.inventory.findByPk).toHaveBeenCalledWith(
      mockInvetoryId,
      expect.objectContaining(mockModelOptions),
    );

    // Return only index 0
    expect(model.inventory.findByPk).toHaveReturnedWith(
      expect.objectContaining(mockInvetoryResponse),
    );

    expect(model.inventory.findByPk).toHaveBeenCalledTimes(1);

    expect(service.pricing.calculateInventoryDeposited).toHaveBeenCalledWith(
      mockInvetoryId,
      expect.objectContaining(mockModelOptions),
    );

    expect(service.pricing.calculateInventoryDeposited).toHaveReturnedWith(
      expect.objectContaining(mockPricing),
    );

    expect(service.pricing.calculateInventoryDeposited).toHaveBeenCalledTimes(1);

    expect(result).toEqual(expected);
  });
});
