import { last, size, find } from 'lodash/fp';
import serviceDispatchReceipt from '../../src/service/dispatchReceipt';
import service from '../../src/service';
import model from '../../src/model';

jest.mock('../../src/model', () => ({
  dispatchReceipt: {
    update: jest.fn(),
  },
  inventory: {
    findAll: jest.fn(),
    update: jest.fn(),
  },
}));

jest.mock('../../src/service', () => ({
  inventoryAudit: {
    logUpdated: jest.fn(),
  },
}));

const defaultModelAttributes = {
  createdAt: '2019-05-06T09:30:00',
  updatedAt: '2019-05-06T09:30:00',
  deletedAt: null,
};

describe('/service/depositReceipt/generateDispatchReceiptNumber', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return dispatch receipt number 10 digits', async () => {
    const result = serviceDispatchReceipt.generateDispatchReceiptNumber();
    expect(result).toHaveLength(10);
  });

  it('should return dispatch receipt number contain only character and number', async () => {
    const result = serviceDispatchReceipt.generateDispatchReceiptNumber();
    expect(result).toMatch(/[0-9A-Z]/g);
  });

  it('should return dispatch receipt number NOT contain any special character', async () => {
    const result = serviceDispatchReceipt.generateDispatchReceiptNumber();
    expect(result).not.toMatch(/[!@#$%^&*(),.?":{}|<>_]/g);
  });

  it('should return dispatch receipt number NOT contain lower character', async () => {
    const result = serviceDispatchReceipt.generateDispatchReceiptNumber();
    expect(result).not.toMatch(/[a-z]/g);
  });
});

describe('/service/depositReceipt/updatePaid', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return deposite receipt with payment reference', async () => {
    const mockRequest = {
      paymentReference: 'payment-reference-1',
      dispatchReceiptNumber: 'dispatch-receipt-number-1',
    };

    const mockModelOptions = {
      transaction: 'transaction-id-12345',
    };

    const mockDispatchReceiptId = 'dispatch-receipt-id-1';
    const mockDispatchReciptResponse = [
      1,
      {
        id: mockDispatchReceiptId,
        dispatchReceiptNumber: mockRequest.dispatchReceiptNumber,
        paymentReference: mockRequest.paymentReference,
        depositAmount: 1835,
        shipAmount: 20,
        netAmount: 1855,
        ...defaultModelAttributes,
      },
    ];

    const mockInventoryResponse = [
      {
        id: 'inventory-id-1',
      },
      {
        id: 'inventory-id-2',
      },
    ];

    model.dispatchReceipt.update = jest.fn(() => mockDispatchReciptResponse);
    model.inventory.findAll = jest.fn(() => mockInventoryResponse);
    model.inventory.update = jest.fn((_, { where: { id } }) => [null, find({ id })(mockInventoryResponse)]);
    service.inventoryAudit.logUpdated = jest.fn(() => true);

    const result = await serviceDispatchReceipt.updatePaid(mockRequest, mockModelOptions);
    expect(model.dispatchReceipt.update).toHaveBeenCalledWith(
      expect.objectContaining({
        paymentReference: mockRequest.paymentReference,
      }),
      expect.objectContaining({
        where: expect.objectContaining({
          dispatchReceiptNumber: mockRequest.dispatchReceiptNumber,
        }),
        returning: true,
        plain: true,
        ...mockModelOptions,
      }),
    );

    expect(model.dispatchReceipt.update).toHaveReturnedWith(
      expect.objectContaining(mockDispatchReciptResponse)
    );

    expect(model.dispatchReceipt.update).toHaveBeenCalledTimes(1);

    expect(model.inventory.findAll).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          dispatchReceiptId: mockDispatchReceiptId,
        }),
        ...mockModelOptions,
      }),
    );

    expect(model.inventory.findAll).toHaveReturnedWith(
      expect.objectContaining(mockInventoryResponse)
    );

    expect(model.inventory.findAll).toHaveBeenCalledTimes(1);

    const length = size(mockRequest.inventories);

    for (let i=0; i<length; i++) {
      expect(model.inventory.update).toHaveBeenNthCalledWith(i+1,
        mockInventoryResponse[i],
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
        expect.objectContaining([null, mockInventoryResponse[i]])
      );
    }

    expect(service.inventoryAudit.logUpdated).toHaveBeenCalledWith(
      expect.objectContaining(mockInventoryResponse),
      expect.objectContaining(mockModelOptions),
    );
    expect(service.inventoryAudit.logUpdated).toHaveBeenCalledTimes(1);

    expect(result).toEqual(last(mockDispatchReciptResponse));

  });

  it('should throw error when dispatch reciept number does not exist', async () => {
    const mockRequest = {
      paymentReference: 'payment-reference-1',
      dispatchReceiptNumber: 'dispatch-receipt-number-worng',
    };

    const mockModelOptions = {
      transaction: 'transaction-id-12345',
    };

    const mockDispatchReciptResponse = [0, {}];

    model.dispatchReceipt.update = jest.fn(() => mockDispatchReciptResponse);

    await expect(serviceDispatchReceipt.updatePaid(mockRequest, mockModelOptions)).rejects.toThrow();
  });

});
