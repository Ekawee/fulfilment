/* eslint-disable camelcase */
import serviceDepositReceipt from '../../src/service/depositReceipt';
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
        id: '2',
        deposit_receipt_number: 'HU09KK1',
        created_at: '2019-05-06T11:52:01.560Z',
        first_name: 'John',
        last_name: 'Doe',
        mobile_number: '0900000001',
        email: 'john.doe@customer-test.com',
        deposit_amount: 0,
        store_amount: 0,
        dispatch_amount: 0,
        paid_amount: 1,
      },
      {
        id: '3',
        deposit_receipt_number: 'ZU9DK01',
        created_at: '2019-05-06T11:52:01.560Z',
        first_name: 'Marie',
        last_name: 'Perry',
        mobile_number: '0900000002',
        email: 'marie.perry@mycompany-test.com',
        deposit_amount: 1,
        store_amount: 0,
        dispatch_amount: 0,
        paid_amount: 2,
      },
    ];

    const mockModelOptions = {
      transaction: 'transaction-id-12345',
    };

    const expectedResult = [
      {
        id: '2',
        depositReceiptNumber: 'HU09KK1',
        createdAt: '2019-05-06T11:52:01.560Z',
        firstName: 'John',
        lastName: 'Doe',
        mobileNumber: '0900000001',
        email: 'john.doe@customer-test.com',
        depositAmount: 0,
        storeAmount: 0,
        dispatchAmount: 0,
        paidAmount: 1,
      },
      {
        id: '3',
        depositReceiptNumber: 'ZU9DK01',
        createdAt: '2019-05-06T11:52:01.560Z',
        firstName: 'Marie',
        lastName: 'Perry',
        mobileNumber: '0900000002',
        email: 'marie.perry@mycompany-test.com',
        depositAmount: 1,
        storeAmount: 0,
        dispatchAmount: 0,
        paidAmount: 2,
      },
    ];
    model.sequelize.query = jest.fn(() => queryResponseSnakeCase);

    const result = await serviceDepositReceipt.getDashboard(mockQuery, mockModelOptions);

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
