import servicePayment from '../../src/service/payment';
import model from '../../src/model';
import service from '../../src/service';


jest.mock('../../src/model', () => ({
  payment: {
    create: jest.fn(),
  },
}));

jest.mock('../../src/service', () => ({
  payment: {
    generatePaymentReference: jest.fn(),
  },
}));

describe('/service/payment/submit', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return payment reference', async () => {
    const mockAmount = 300;
    const mockStatus = 'COMPLETED';
    const mockRequest = {
      creditCardNumber: 'xxx1-xxx2-xxx3-xxx4',
      name: 'John Doe',
      expiryDate: '2020-05-01',
      cvv: 123,
      amount: mockAmount,
    };

    const mockModelOptions = {
      transaction: 'transaction-id-12345',
    };

    const mockPaymentReference = 'X2KL4POA7';

    const mockPaymentResponse = {
      id: 'payment-id-1',
      amount: mockAmount,
      paymentReference: mockPaymentReference,
      status: mockStatus,
    };

    const mockCreatePayload = {
      amount: mockAmount,
      paymentReference: mockPaymentReference,
      status: mockStatus,
    };

    service.payment.generatePaymentReference = jest.fn(() => mockPaymentReference);
    model.payment.create = jest.fn(() => mockPaymentResponse);

    const result = await servicePayment.submit(mockRequest, mockModelOptions);

    expect(service.payment.generatePaymentReference).toHaveBeenCalledWith();

    expect(service.payment.generatePaymentReference).toHaveReturnedWith(mockPaymentReference);

    expect(service.payment.generatePaymentReference).toHaveBeenCalledTimes(1);

    expect(model.payment.create ).toHaveBeenCalledWith(
      expect.objectContaining(mockCreatePayload),
      expect.objectContaining(mockModelOptions),
    );

    expect(model.payment.create ).toHaveReturnedWith(mockPaymentResponse);

    expect(model.payment.create ).toHaveBeenCalledTimes(1);

    expect(result).toEqual(mockPaymentResponse);

  });

});
