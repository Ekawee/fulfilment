import { find, size } from 'lodash/fp';
import serviceInventory from '../../src/service/inventory';
import service from '../../src/service';

jest.mock('../../src/service', () => ({
  pricing: {
    calculateInventoryDeposited: jest.fn(),
    calculateShipment: jest.fn(),
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
