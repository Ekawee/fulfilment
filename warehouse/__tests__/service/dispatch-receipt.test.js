import serviceDispatchReceipt from '../../src/service/dispatchReceipt';

describe('/service/depositReceipt/generateDispatchReceiptNumber', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return deposite receipt number 10 digits', async () => {
    const result = serviceDispatchReceipt.generateDispatchReceiptNumber();
    expect(result).toHaveLength(10);
  });

  it('should return deposite receipt number contain only character and number', async () => {
    const result = serviceDispatchReceipt.generateDispatchReceiptNumber();
    expect(result).toMatch(/[0-9A-Z]/g);
  });

  it('should return deposite receipt number NOT contain any special character', async () => {
    const result = serviceDispatchReceipt.generateDispatchReceiptNumber();
    expect(result).not.toMatch(/[!@#$%^&*(),.?":{}|<>_]/g);
  });

  it('should return deposite receipt number NOT contain lower character', async () => {
    const result = serviceDispatchReceipt.generateDispatchReceiptNumber();
    expect(result).not.toMatch(/[a-z]/g);
  });
});
