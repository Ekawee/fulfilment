/* eslint-disable camelcase */
import serviceDispatchReceipt from '../../src/service/dispatchReceipt';
import model from '../../src/model';


jest.mock('../../src/model', () => ({
  sequelize: {
    query: jest.fn(),
    QueryTypes: {
      SELECT: jest.fn(),
    },
  },
}));

describe('/service/depositReceipt/getDashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return summary data from deposit receipt', async () => {
    const mockQuery = {};

    const queryResponseSnakeCase = [
      {
        id: '4',
        customer_id: null,
        shipment_id: null,
        dispatch_receipt_number: 'F9VCOLDIRW',
        payment_reference: null,
        deposit_amount: 1635,
        ship_amount: 20,
        net_amount: 1655,
        first_name: null,
        last_name: null,
        mobile_number: null,
        email: null,
        inventory_amount: 0,
      },
    ];

    const mockModelOptions = {
      transaction: 'transaction-id-12345',
    };

    const expectedResult = [
      {
        id: '4',
        customerId: null,
        shipmentId: null,
        dispatchReceiptNumber: 'F9VCOLDIRW',
        paymentReference: null,
        depositAmount: 1635,
        shipAmount: 20,
        netAmount: 1655,
        firstName: null,
        lastName: null,
        mobileNumber: null,
        email: null,
        inventoryAmount: 0,
      },
    ];
    model.sequelize.query = jest.fn(() => queryResponseSnakeCase);

    const result = await serviceDispatchReceipt.getDashboard(mockQuery, mockModelOptions);

    expect(model.sequelize.query).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        type: expect.anything(),
        raw: true,
        ...mockModelOptions,
      }),
    );
    expect(model.sequelize.query).toHaveReturnedWith(
      expect.arrayContaining(queryResponseSnakeCase),
    );

    expect(model.sequelize.query).toHaveBeenCalledTimes(1);

    expect(result).toEqual(expectedResult);
  });

});
