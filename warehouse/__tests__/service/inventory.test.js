import { find } from 'lodash/fp';
import serviceInventory from '../../src/service/inventory';
import model from '../../src/model';

jest.mock('../../src/model', () => ({
  inventory: {
    findAll: jest.fn(),
  },
}));

describe('/service/inventory/getByDepositeReceiptPk', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockInventoriesResponse = [
    {
      id: '1',
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
    },
    {
      id: '2',
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
    },
  ];

  it('should return invetories list by using depositReceiptId (found)', async () => {
    const mockDepositReceiptId = 'deposit-receipt-id-1';

    const mockModelOptions = {
      transaction: 'transaction-id-12345',
    };

    model.inventory.findAll = jest.fn(
      ({ where: { depositReceiptId } }) => [find({ depositReceiptId })(mockInventoriesResponse)]
      );

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
