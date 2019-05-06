import serviceCustomer from '../../src/service/customer';
import model from '../../src/model';
import service from '../../src/service';


jest.mock('../../src/model', () => ({
  customer: {
    create: jest.fn(),
    findByPk: jest.fn(),
  },
}));

jest.mock('../../src/service', () => ({
  customerAudit: {
    logAdded: jest.fn(),
  },
  customer: {
    create: jest.fn(),
  },
}));

const defaultModelAttributes = {
  createdAt: '2019-05-06T09:30:00',
  updatedAt: '2019-05-06T09:30:00',
  deletedAt: null,
};

describe('/service/customer/findByPkOrCreate', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return EXIST customer', async () => {
    const mockRequest = {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      identificationNumber: 'AA0000001',
      mobileNumber: '0900000001',
      email: 'john.doe@customer-test.com',
    };

    const mockModelOptions = {
      transaction: 'transaction-id-12345',
    };

    const mockCustomerResponse = {
      ...mockRequest,
      ...defaultModelAttributes,
    };

    model.customer.findByPk = jest.fn(() => mockCustomerResponse);
    const result = await serviceCustomer.findByPkOrCreate(mockRequest, mockModelOptions);

    expect(model.customer.findByPk).toHaveBeenCalledWith(
      mockRequest.id,
      expect.objectContaining(mockModelOptions),
    );

    expect(model.customer.findByPk).toHaveReturnedWith(
      expect.objectContaining(mockCustomerResponse),
    );

    expect(model.customer.findByPk).toHaveBeenCalledTimes(1);

    expect(service.customer.create).not.toHaveBeenCalled();

    expect(result).toEqual(mockCustomerResponse);

  });

  it('should return NEW customer', async () => {
    const mockRequest = {
      firstName: 'Alicia V.',
      lastName: 'Haynes',
      identificationNumber: 'AA0000026',
      mobileNumber: '816-368-4818',
      email: 'AliciaVHaynes@dayrep-test.com',
    };

    const mockModelOptions = {
      transaction: 'transaction-id-12345',
    };

    const mockCustomerResponse = {
      id: '2',
      ...mockRequest,
      ...defaultModelAttributes,
    };

    service.customer.create = jest.fn(() => mockCustomerResponse);
    const result = await serviceCustomer.findByPkOrCreate(mockRequest, mockModelOptions);

    expect(service.customer.create).toHaveBeenCalledWith(
      expect.objectContaining(mockRequest),
      expect.objectContaining(mockModelOptions),
    );

    expect(service.customer.create).toHaveReturnedWith(
      expect.objectContaining(mockCustomerResponse),
    );

    expect(service.customer.create).toHaveBeenCalledTimes(1);

    expect(model.customer.findByPk).not.toHaveBeenCalled();

    expect(result).toEqual(mockCustomerResponse);

  });

});

describe('/service/customer/create', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return NEW customer', async () => {
    const mockRequest = {
      firstName: 'Alicia V.',
      lastName: 'Haynes',
      identificationNumber: 'AA0000026',
      mobileNumber: '816-368-4818',
      email: 'AliciaVHaynes@dayrep-test.com',
    };

    const mockModelOptions = {
      transaction: 'transaction-id-12345',
    };

    const mockCustomerResponse = {
      id: '2',
      ...mockRequest,
      ...defaultModelAttributes,
    };

    model.customer.create = jest.fn(() => mockCustomerResponse);
    service.customerAudit.logAdded = jest.fn(() => true);
    const result = await serviceCustomer.create(mockRequest, mockModelOptions);

    expect(model.customer.create).toHaveBeenCalledWith(
      expect.objectContaining(mockRequest),
      expect.objectContaining(mockModelOptions),
    );

    expect(model.customer.create).toHaveReturnedWith(
      expect.objectContaining(mockCustomerResponse),
    );

    expect(model.customer.create).toHaveBeenCalledTimes(1);

    expect(service.customerAudit.logAdded).toHaveBeenCalledWith(
      expect.objectContaining(mockCustomerResponse),
      expect.objectContaining(mockModelOptions),
    );

    expect(service.customerAudit.logAdded).toHaveBeenCalledTimes(1);

    expect(model.customer.findByPk).not.toHaveBeenCalled();

    expect(result).toEqual(mockCustomerResponse);

  });

});
