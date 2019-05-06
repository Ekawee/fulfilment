import serviceInventory from '../../src/service/inventory';
import service from '../../src/service';
import model from '../../src/model';
import { INVENTORY_AUDIT } from '../../src/constants';

jest.mock('../../src/model', () => ({
  depositReceipt: {
    create: jest.fn(),
  },
}));

jest.mock('../../src/service', () => ({
  customer: {
    findByPkOrCreate: jest.fn(),
  },
  depositReceipt: {
    generateDepositReceiptNumber: jest.fn(),
  },
  inventoryAudit: {
    logAdded: jest.fn(),
  },
}));

describe('/service/inventory/deposit', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should deposited inventory with EXIST customer correctly', async () => {

    const mockCustomer = {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      identificationNumber: 'AA0000001',
      mobileNumber: '0900000001',
      email: 'john.doe@customer-test.com',
    };

    const mockInventory = [
      {
        width: 4,
        height: 5,
        length: 10,
        inventoryTypeId: '1',
        depositedAt: '2019-05-06T09:30:00',
        status: INVENTORY_AUDIT.STATUS.DEPOSITED,
      },
      {
        width: 3,
        height: 3,
        length: 5,
        inventoryTypeId: '1',
        depositedAt: '2019-05-06T09:30:00',
        status: INVENTORY_AUDIT.STATUS.DEPOSITED,
      },
    ];

    const mockPayloadRequest = {
      customer: mockCustomer,
      inventories: mockInventory,
    };

    const mockModelOptions = {
      transaction: 'transaction-id-12345',
    };

    const mockDepositReciptNumber = 'SK1K90PS1';

    const mockPayloadCreateDepositReceipt = {
      customerId: mockCustomer.id,
      depositReceiptNumber: mockDepositReciptNumber,
      inventories: mockInventory,
    };

    const mockDepositReceiptResponse = {
      id: 'deposit-receipt-id-new',
      customer: mockCustomer,
      depositReceiptNumber: mockDepositReciptNumber,
      inventories: mockInventory,
    };

    service.customer.findByPkOrCreate = jest.fn(({ id }) => {
      if (id) {
        return mockCustomer;
      }
      return null;
    });
    service.depositReceipt.generateDepositReceiptNumber = jest.fn(() => mockDepositReciptNumber);
    model.depositReceipt.create = jest.fn(() => mockDepositReceiptResponse);
    service.inventoryAudit.logAdded = jest.fn(() => true);

    const result = await serviceInventory.deposit(mockPayloadRequest, mockModelOptions);

    expect(service.customer.findByPkOrCreate).toHaveBeenCalledWith(
      expect.objectContaining(mockCustomer),
      expect.objectContaining(mockModelOptions),
    );

    expect(service.customer.findByPkOrCreate).toHaveReturnedWith(
      expect.objectContaining(mockCustomer),
    );

    expect(service.customer.findByPkOrCreate).toHaveBeenCalledTimes(1);

    expect(service.depositReceipt.generateDepositReceiptNumber).toHaveBeenCalledWith();
    expect(service.depositReceipt.generateDepositReceiptNumber).toHaveReturnedWith(mockDepositReciptNumber);
    expect(service.depositReceipt.generateDepositReceiptNumber).toHaveBeenCalledTimes(1);

    expect(model.depositReceipt.create).toHaveBeenCalledWith(
      expect.objectContaining(mockPayloadCreateDepositReceipt),
      expect.objectContaining({
        include: expect.arrayContaining([
          expect.objectContaining({
            as: 'inventories',
          }),
        ]),
        ...mockModelOptions,
      })
    );
    expect(model.depositReceipt.create).toHaveReturnedWith(
      expect.objectContaining(mockDepositReceiptResponse),
    );
    expect(model.depositReceipt.create).toHaveBeenCalledTimes(1);

    expect(service.inventoryAudit.logAdded).toHaveBeenCalledWith(
      expect.arrayContaining(mockDepositReceiptResponse.inventories),
      mockModelOptions
    );
    expect(service.inventoryAudit.logAdded).toHaveBeenCalledTimes(1);

    expect(result).toEqual(mockDepositReceiptResponse);
  });

  it('should deposited inventory with NEW customer correctly', async () => {

    const mockCustomer = {
      firstName: 'Alicia V.',
      lastName: 'Haynes',
      identificationNumber: 'AA0000026',
      mobileNumber: '816-368-4818',
      email: 'AliciaVHaynes@dayrep-test.com',
    };

    const mockInventory = [
      {
        weight: 4,
        inventoryTypeId: '1',
        depositedAt: '2019-05-06T09:30:00',
        status: INVENTORY_AUDIT.STATUS.DEPOSITED,
      },
    ];

    const mockPayloadRequest = {
      customer: mockCustomer,
      inventories: mockInventory,
    };

    const mockModelOptions = {
      transaction: 'transaction-id-12345',
    };

    const mockNewCustomer = {
      id: '2',
      ...mockCustomer,
    };

    const mockDepositReciptNumber = 'PS9UH1SS';

    const mockPayloadCreateDepositReceipt = {
      customerId: mockNewCustomer.id,
      depositReceiptNumber: mockDepositReciptNumber,
      inventories: mockInventory,
    };

    const mockDepositReceiptResponse = {
      id: 'deposit-receipt-id-new',
      customer: mockNewCustomer,
      depositReceiptNumber: mockDepositReciptNumber,
      inventories: mockInventory,
    };

    service.customer.findByPkOrCreate = jest.fn(({ id }) => {
      if (id) {
        return null;
      }
      return mockNewCustomer;
    });
    service.depositReceipt.generateDepositReceiptNumber = jest.fn(() => mockDepositReciptNumber);
    model.depositReceipt.create = jest.fn(() => mockDepositReceiptResponse);
    service.inventoryAudit.logAdded = jest.fn(() => true);

    const result = await serviceInventory.deposit(mockPayloadRequest, mockModelOptions);

    expect(service.customer.findByPkOrCreate).toHaveBeenCalledWith(
      expect.objectContaining(mockCustomer),
      expect.objectContaining(mockModelOptions),
    );

    expect(service.customer.findByPkOrCreate).toHaveReturnedWith(
      expect.objectContaining(mockCustomer),
    );

    expect(service.customer.findByPkOrCreate).toHaveBeenCalledTimes(1);

    expect(service.depositReceipt.generateDepositReceiptNumber).toHaveBeenCalledWith();
    expect(service.depositReceipt.generateDepositReceiptNumber).toHaveReturnedWith(mockDepositReciptNumber);
    expect(service.depositReceipt.generateDepositReceiptNumber).toHaveBeenCalledTimes(1);

    expect(model.depositReceipt.create).toHaveBeenCalledWith(
      expect.objectContaining(mockPayloadCreateDepositReceipt),
      expect.objectContaining({
        include: expect.arrayContaining([
          expect.objectContaining({
            as: 'inventories',
          }),
        ]),
        ...mockModelOptions,
      })
    );
    expect(model.depositReceipt.create).toHaveReturnedWith(
      expect.objectContaining(mockDepositReceiptResponse),
    );
    expect(model.depositReceipt.create).toHaveBeenCalledTimes(1);

    expect(service.inventoryAudit.logAdded).toHaveBeenCalledWith(
      expect.arrayContaining(mockDepositReceiptResponse.inventories),
      mockModelOptions
    );
    expect(service.inventoryAudit.logAdded).toHaveBeenCalledTimes(1);

    expect(result).toEqual(mockDepositReceiptResponse);
  });


});
