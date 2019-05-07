/* eslint-disable camelcase */
import { find, size, sum, map, compose } from 'lodash/fp';
import serviceReport from '../../src/service/report';
import model from '../../src/model';
import service from '../../src/service';

jest.mock('../../src/model', () => ({
  sequelize: {
    query: jest.fn(),
    QueryTypes: {
      SELECT: jest.fn(),
    },
  },
}));

jest.mock('../../src/service', () => ({
  pricing: {
    calculateInventoryDeposited: jest.fn(),
  },
  report: {
    depositForcast: jest.fn(),
    dispatchExpected: jest.fn(),
    paidProfit: jest.fn(),
  },
}));

describe('/service/report/depositForcast', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return summary data for deposit forcast', async () => {
    const mockModelOptions = {
      transaction: 'transaction-id-12345',
    };

    const mockDepositResponseSnakeCase = [
      {
        id: 'inventory-id-1',
      },
      {
        id: 'inventory-id-2',
      },
    ];

    const mockPricingResponce = [
      {
        id: 'inventory-id-1',
        price: 100,
      },
      {
        id: 'inventory-id-2',
        price: 200,
      },
    ];

    const expected = {
      amount: size(mockDepositResponseSnakeCase),
      forcastAmount: compose(
        sum,
        map(({ price }) => price)
      )(mockPricingResponce),
    };

    model.sequelize.query = jest.fn(() => mockDepositResponseSnakeCase);
    service.pricing.calculateInventoryDeposited = jest.fn((id) => find({ id })(mockPricingResponce));

    const result = await serviceReport.depositForcast(mockModelOptions);

    expect(model.sequelize.query).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        type: expect.anything(),
        raw: true,
        ...mockModelOptions,
      }),
    );
    expect(model.sequelize.query).toHaveReturnedWith(
      expect.arrayContaining(mockDepositResponseSnakeCase),
    );

    expect(model.sequelize.query).toHaveBeenCalledTimes(1);

    expect(result).toEqual(expected);
  });

});

describe('/service/report/dispatchExpected', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return summary data for dispatch expected', async () => {
    const mockModelOptions = {
      transaction: 'transaction-id-12345',
    };

    const mockDispatchResponseSnakeCase = [
      {
        expected_amount: 400,
        ship_amount: 200,
        net_amount: 600,
        amount: 20,
      },
    ];

    const expected = {
      expectedAmount: 400,
      shipAmount: 200,
      netAmount: 600,
      amount: 20,
    };

    model.sequelize.query = jest.fn(() => mockDispatchResponseSnakeCase);

    const result = await serviceReport.depositForcast(mockModelOptions);

    expect(model.sequelize.query).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        type: expect.anything(),
        raw: true,
        ...mockModelOptions,
      }),
    );
    expect(model.sequelize.query).toHaveReturnedWith(
      expect.arrayContaining(mockDispatchResponseSnakeCase),
    );

    expect(model.sequelize.query).toHaveBeenCalledTimes(1);

    expect(result).toEqual(expected);
  });

});

describe('/service/report/paidProfit', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return summary data for paid profit', async () => {
    const mockModelOptions = {
      transaction: 'transaction-id-12345',
    };

    const mockPaidResponseSnakeCase = [
      {
        profit_amount: 700,
        ship_amount: 350,
        net_amount: 1050,
        amount: 15,
      },
    ];

    const expected = {
      profitAmount: 700,
      shipAmount: 350,
      netAmount: 1050,
      amount: 15,
    };

    model.sequelize.query = jest.fn(() => mockPaidResponseSnakeCase);

    const result = await serviceReport.depositForcast(mockModelOptions);

    expect(model.sequelize.query).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        type: expect.anything(),
        raw: true,
        ...mockModelOptions,
      }),
    );
    expect(model.sequelize.query).toHaveReturnedWith(
      expect.arrayContaining(mockPaidResponseSnakeCase),
    );

    expect(model.sequelize.query).toHaveBeenCalledTimes(1);

    expect(result).toEqual(expected);
  });

});

describe('/service/report/profit', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return summary data for profit and forcast', async () => {
    const mockModelOptions = {
      transaction: 'transaction-id-12345',
    };

    const mockDepositInventoryResponse = {
      expectedAmount: 400,
      shipAmount: 200,
      netAmount: 600,
      amount: 20,
    };

    const mockDipatchInventoryResponse = {
      expectedAmount: 400,
      shipAmount: 200,
      netAmount: 600,
      amount: 20,
    };

    const mockPaidInventoryResponse = {
      profitAmount: 700,
      shipAmount: 350,
      netAmount: 1050,
      amount: 15,
    };


    const expected = {
      depositInventory: mockDepositInventoryResponse,
      dispatchInventory: mockDipatchInventoryResponse,
      paidInventory: mockPaidInventoryResponse,
    };

    service.report.depositForcast = jest.fn(() => mockDepositInventoryResponse);
    service.report.dispatchExpected = jest.fn(() => mockDipatchInventoryResponse);
    service.report.paidProfit = jest.fn(() => mockPaidInventoryResponse);

    const result = await serviceReport.depositForcast(mockModelOptions);

    expect(service.report.depositForcast).toHaveBeenCalledTimes(
      expect.objectContaining(mockModelOptions),
    );
    expect(service.report.depositForcast).toHaveReturnedWith(
      expect.objectContaining(mockDepositInventoryResponse),
    );
    expect(service.report.depositForcast).toHaveBeenCalledTimes(1);

    expect(service.report.dispatchExpected).toHaveBeenCalledTimes(
      expect.objectContaining(mockModelOptions),
    );
    expect(service.report.dispatchExpected).toHaveReturnedWith(
      expect.objectContaining(mockDepositInventoryResponse),
    );
    expect(service.report.dispatchExpected).toHaveBeenCalledTimes(1);

    expect(service.report.paidProfit).toHaveBeenCalledTimes(
      expect.objectContaining(mockModelOptions),
    );
    expect(service.report.paidProfit).toHaveReturnedWith(
      expect.objectContaining(mockDepositInventoryResponse),
    );
    expect(service.report.paidProfit).toHaveBeenCalledTimes(1);

    expect(result).toEqual(expected);
  });

});
