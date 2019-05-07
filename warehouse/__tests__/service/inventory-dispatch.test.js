import { find, size } from 'lodash/fp';
import { DateTime } from 'luxon';
import serviceInventory from '../../src/service/inventory';
import service from '../../src/service';
import model from '../../src/model';
import { INVENTORY_AUDIT } from '../../src/constants';

jest.mock('../../src/model', () => ({
  dispatchReceipt: {
    create: jest.fn(),
  },
  inventory: {
    update: jest.fn(),
  },
}));

jest.mock('../../src/service', () => ({
  pricing: {
    calculateInventoryDeposited: jest.fn(),
    calculateShipment: jest.fn(),
  },
  inventory: {
    dispatchPrice: jest.fn(),
  },
  dispatchReceipt: {
    generateDispatchReceiptNumber: jest.fn(),
  },
  inventoryAudit: {
    logUpdated: jest.fn(),
  },
}));

describe('/service/inventory/dispatchPrice', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return deposited price for each item and shipment price', async () => {
    const mockRequest = {
      inventories: [
        {
          id: 'inventory-id-1',
        },
        {
          id: 'inventory-id-1',
        },
      ],
      shipment: {
        name: 'Kira',
        address: '223 United State',
        mobileNumber: '555-22134',
        email: 'kira@thisiskiramail-test.com',
      },
    };

    const mockModelOptions = {
      transaction: 'transaction-id-12345',
    };

    const mockDepositedPrice = [
      {
        id: mockRequest.inventories[0].id,
        dayCount: 3,
        price: 200,
      },
      {
        id: mockRequest.inventories[0].id,
        dayCount: 3,
        price: 200,
      },
    ];

    const mockShipmentPrice = 100;

    const expectedResult = {
      inventoriesDepositedPrice: mockDepositedPrice,
      shipmentPrice: mockShipmentPrice,
    };

    service.pricing.calculateInventoryDeposited = jest.fn((id) => find({ id })(mockDepositedPrice));
    service.pricing.calculateShipment = jest.fn(() => mockShipmentPrice);

    const result = await serviceInventory.dispatchPrice(mockRequest, mockModelOptions);

    const length = size(mockRequest.inventories);

    for (let i=0; i<length; i++) {
      expect(service.pricing.calculateInventoryDeposited).toHaveBeenNthCalledWith(i+1,
        mockRequest.inventories[i].id,
        expect.objectContaining(mockModelOptions),
      );

      expect(service.pricing.calculateInventoryDeposited).toHaveNthReturnedWith(i+1,
        expect.objectContaining(mockDepositedPrice[i])
      );
    }

    expect(service.pricing.calculateInventoryDeposited).toHaveBeenCalledTimes(length);

    expect(service.pricing.calculateShipment).toHaveBeenCalledWith(
      expect.objectContaining(mockRequest.shipment),
      expect.objectContaining(mockModelOptions),
    );

    expect(service.pricing.calculateShipment).toHaveReturnedWith(mockShipmentPrice);

    expect(service.pricing.calculateShipment).toHaveBeenCalledTimes(1);

    expect(result).toEqual(expectedResult);
  });

});

describe('/service/inventory/dispatch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return dispatch receipt number and net amount', async () => {
    const mockRequest = {
      inventories: [
        {
          id: 'inventory-id-1',
        },
        {
          id: 'inventory-id-1',
        },
      ],
      shipment: {
        name: 'Kira',
        address: '223 United State',
        mobileNumber: '555-22134',
        email: 'kira@thisiskiramail-test.com',
      },
    };

    const mockModelOptions = {
      transaction: 'transaction-id-12345',
    };

    const mockPricing = {
      inventoriesDepositedPrice: [
        {
          id: mockRequest.inventories[0].id,
          dayCount: 3,
          price: 200,
        },
        {
          id: mockRequest.inventories[0].id,
          dayCount: 3,
          price: 200,
        },
      ],
      shipmentPrice: 100,
    };

    const mockDispathReceiptNumber = 'dispatch-receipt-number-1';


    const mockDispatchReceiptPayload = {
      dispatchReceiptNumber: mockDispathReceiptNumber,
      depositAmount: 400,
      shipAmount: 100,
      netAmount: 500,
    };

    const mockDispatchReceiptResponse = {
      id: 'dispatch-receipt-id-1',
    };

    const mockToday = DateTime.fromISO('2019-05-07');
    const mockInventoriesUpdatedPayload = [
      {
        dispatchReceiptId: mockDispatchReceiptResponse.id,
        status: INVENTORY_AUDIT.STATUS.DISPATCHED,
        dispatchedAt: mockToday.toSQL(),
        expectedAmount: mockPricing.inventoriesDepositedPrice[0].price,
      },
      {
        dispatchReceiptId: mockDispatchReceiptResponse.id,
        status: INVENTORY_AUDIT.STATUS.DISPATCHED,
        dispatchedAt: mockToday.toSQL(),
        expectedAmount: mockPricing.inventoriesDepositedPrice[1].price,
      },
    ];

    const mockInventoriesUpdatedResponse = [
      {
        id: mockRequest.inventories[0].id,
        ...mockInventoriesUpdatedPayload[0],
      },
      {
        id: mockRequest.inventories[1].id,
        ...mockInventoriesUpdatedPayload[1],
      },
    ];

    const expecctedResult = {
      dispatchReceiptNumber: mockDispatchReceiptPayload.dispatchReceiptNumber,
      netAmount: mockDispatchReceiptPayload.netAmount,
    };

    DateTime.utc = jest.fn(() => mockToday);
    service.inventory.dispatchPrice = jest.fn(() => mockPricing);
    service.dispatchReceipt.generateDispatchReceiptNumber = jest.fn(() => mockDispathReceiptNumber);
    model.dispatchReceipt.create = jest.fn(() => mockDispatchReceiptResponse);
    model.inventory.update = jest.fn((_, { where: { id } }) => [null, find({ id })(mockInventoriesUpdatedResponse)]);
    service.inventoryAudit.logUpdated = jest.fn(() => true);

    const result = await serviceInventory.dispatch(mockRequest, mockModelOptions);

    expect(service.inventory.dispatchPrice).toHaveBeenCalledWith(
      expect.objectContaining(mockRequest),
      expect.objectContaining(mockModelOptions),
    );

    expect(service.inventory.dispatchPrice).toHaveReturnedWith(mockPricing);

    expect(service.inventory.dispatchPrice).toHaveBeenCalledTimes(1);

    expect(service.dispatchReceipt.generateDispatchReceiptNumber).toHaveBeenCalledWith();

    expect(service.dispatchReceipt.generateDispatchReceiptNumber).toHaveReturnedWith(mockDispathReceiptNumber);

    expect(service.dispatchReceipt.generateDispatchReceiptNumber).toHaveBeenCalledTimes(1);

    expect(model.dispatchReceipt.create).toHaveBeenCalledWith(
      expect.objectContaining(mockDispatchReceiptPayload),
      expect.objectContaining(mockModelOptions),
    );

    expect(model.dispatchReceipt.create).toHaveReturnedWith(mockDispatchReceiptResponse);

    expect(model.dispatchReceipt.create).toHaveBeenCalledTimes(1);

    const length = size(mockRequest.inventories);

    for (let i=0; i<length; i++) {
      expect(model.inventory.update).toHaveBeenNthCalledWith(i+1,
        mockInventoriesUpdatedPayload[i],
        expect.objectContaining({
          where: expect.objectContaining({
            id: mockRequest.inventories[i].id,
          }),
          returning: true,
          plain: true,
          ...mockModelOptions,
        }),
      );

      expect(model.inventory.update).toHaveNthReturnedWith(i+1,
        expect.objectContaining([null, mockInventoriesUpdatedResponse[i]])
      );
    }

    expect(model.inventory.update).toHaveBeenCalledTimes(length);

    expect(service.inventoryAudit.logUpdated).toHaveBeenCalledWith(
      expect.objectContaining(mockInventoriesUpdatedResponse),
      expect.objectContaining(mockModelOptions),
    );
    expect(service.inventoryAudit.logUpdated).toHaveBeenCalledTimes(1);

    expect(result).toEqual(expecctedResult);
  });
});
