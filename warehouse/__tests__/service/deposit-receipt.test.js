import serviceDepositReceipt from '../../src/service/depositReceipt';

describe('/service/depositReceipt/generateDepositReceiptNumber', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return deposite receipt number 10 digits', async () => {
    const result = serviceDepositReceipt.generateDepositReceiptNumber();
    expect(result).toHaveLength(10);
  });

  it('should return deposite receipt number contain only character and number', async () => {
    const result = serviceDepositReceipt.generateDepositReceiptNumber();
    expect(result).toMatch(/[0-9A-Z]/g);
  });

  it('should return deposite receipt number NOT contain any special character', async () => {
    const result = serviceDepositReceipt.generateDepositReceiptNumber();
    expect(result).not.toMatch(/[!@#$%^&*(),.?":{}|<>_]/g);
  });

  it('should return deposite receipt number NOT contain lower character', async () => {
    const result = serviceDepositReceipt.generateDepositReceiptNumber();
    expect(result).not.toMatch(/[a-z]/g);
  });
});
