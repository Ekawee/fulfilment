import serviceCustomerAudit from '../../src/service/customerAudit';
import model from '../../src/model';

jest.mock('../../src/model', () => ({
  customerAudit: {
    create: jest.fn(),
  },
}));

const defaultModelAttributes = {
  createdAt: '2019-05-06T09:30:00',
  updatedAt: '2019-05-06T09:30:00',
  deletedAt: null,
};

describe('/service/customerAudit/logAdded', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return inserted data with currentInformation', async () => {
    const mockCustomer = {
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

    const mockCustomerAuditPayload = {
      customerId: mockCustomer.id,
      currentInformation: JSON.stringify(mockCustomer),
    };

    const mockCustomerAuditResponse = {
      id: 'customer-audit-id-1',
      ...mockCustomerAuditPayload,
      ...defaultModelAttributes,
    };

    model.customerAudit.create = jest.fn(() => mockCustomerAuditResponse);

    const result = await serviceCustomerAudit.logAdded(mockCustomer, mockModelOptions);

    expect(model.customerAudit.create).toHaveBeenCalledWith(
      expect.objectContaining(mockCustomerAuditPayload),
      expect.objectContaining(mockModelOptions),
    );

    expect(model.customerAudit.create).toHaveReturnedWith(
      expect.objectContaining(mockCustomerAuditResponse)
    );

    expect(model.customerAudit.create).toHaveBeenCalledTimes(1);

    expect(result).toEqual(mockCustomerAuditResponse);
  });

  it('should throw error when there is no customer id', async () => {
    const mockCustomer = {
      firstName: 'John',
      lastName: 'Doe',
      identificationNumber: 'AA0000001',
      mobileNumber: '0900000001',
      email: 'john.doe@customer-test.com',
    };

    const mockModelOptions = {
      transaction: 'transaction-id-12345',
    };

    await expect(serviceCustomerAudit.logAdded(mockCustomer, mockModelOptions)).rejects.toThrow();

  });

});
