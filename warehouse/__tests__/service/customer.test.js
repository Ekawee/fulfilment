import serviceCustomer from '../../src/service/customer';
import model from '../../src/model';

jest.mock('../../src/model', () => ({
  customer: {
    create: jest.fn(),
    findById: jest.fn(),
  },
}));

const defaultModelAttributes = {
  createdAt: '2019-05-06T09:30:00',
  updatedAt: '2019-05-06T09:30:00',
  deletedAt: null,
};

describe('/service/customer/findByIdOrCreate', () => {
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

    model.customer.findById = jest.fn(() => mockCustomerResponse);
    const result = await serviceCustomer.findByIdOrCreate(mockRequest, mockModelOptions);

    expect(model.customer.findById).toHaveBeenCalledWith(
      mockRequest.id,
      expect.objectContaining(mockModelOptions),
    );

    expect(model.customer.findById).toHaveReturnedWith(
      expect.objectContaining(mockCustomerResponse),
    );

    expect(model.customer.findById).toHaveBeenCalledTimes(1);

    expect(model.customer.create).not.toHaveBeenCalled();

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

    model.customer.create = jest.fn(() => mockCustomerResponse);
    const result = await serviceCustomer.findByIdOrCreate(mockRequest, mockModelOptions);

    expect(model.customer.create).toHaveBeenCalledWith(
      expect.objectContaining(mockRequest),
      expect.objectContaining(mockModelOptions),
    );

    expect(model.customer.create).toHaveReturnedWith(
      expect.objectContaining(mockCustomerResponse),
    );

    expect(model.customer.create).toHaveBeenCalledTimes(1);

    expect(model.customer.findById).not.toHaveBeenCalled();

    expect(result).toEqual(mockCustomerResponse);

  });

});