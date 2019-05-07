import { map, find, size, omit } from 'lodash/fp';
import serviceInventoryAudit from '../../src/service/inventoryAudit';
import model from '../../src/model';
import { INVENTORY_AUDIT } from '../../src/constants';

jest.mock('../../src/model', () => ({
  inventoryAudit: {
    create: jest.fn(),
  },
}));

const defaultModelAttributes = {
  createdAt: '2019-05-06T09:30:00',
  updatedAt: '2019-05-06T09:30:00',
  deletedAt: null,
};

describe('/service/inventoryAudit/logAdded', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return insert audit log with action ADDED', async () => {
    const mockId = ['1', '2'];
    const mockInventories = map(
      id => ({
        id: `inventory-id-${id}`,
        status: INVENTORY_AUDIT.STATUS.DEPOSITED,
        action: INVENTORY_AUDIT.ACTION.ADDED,
      })
    )(mockId);

    const mockModelOptions = {
      transaction: 'transaction-id-12345',
    };

    const mockPayloadInventoryAudit = map(
      inventory => ({
        inventoryId: inventory.id,
        ...omit(['id'])(inventory),
      })
    )(mockInventories);

    const mockInventionAuditResponse = map(
      inventory => ({
        ...defaultModelAttributes,
        ...inventory,
      })
    )(mockPayloadInventoryAudit);


    model.inventoryAudit.create = jest.fn(({ inventoryId }) => find({ inventoryId })(mockInventionAuditResponse));

    const result = await serviceInventoryAudit.logAdded(mockInventories, mockModelOptions);

    const length = size(mockInventories);
    for (let i=0; i<length; i++) {
      expect(model.inventoryAudit.create).toHaveBeenNthCalledWith(i+1,
        expect.objectContaining(mockPayloadInventoryAudit[i]),
        expect.objectContaining(mockModelOptions),
      );

      expect(model.inventoryAudit.create).toHaveNthReturnedWith(i+1,
        expect.objectContaining(mockInventionAuditResponse[i])
      );
    }

    expect(model.inventoryAudit.create).toHaveBeenCalledTimes(length);
    expect(result).toEqual(mockInventionAuditResponse);
  });

  it('should do nothing when there is no inventory data', async () => {

    const mockInventories = [];
    const mockModelOptions = {
      transaction: 'transaction-id-12345',
    };

    const expectedResult = [];

    const result = await serviceInventoryAudit.logAdded(mockInventories, mockModelOptions);

    expect(model.inventoryAudit.create).not.toHaveBeenCalled();
    expect(result).toEqual(expectedResult);
  });

});

describe('/service/inventoryAudit/logUpdated', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return insert audit log with action UPDATED, status DISPATCHED', async () => {
    const mockId = ['1', '2'];
    const mockInventories = map(
      id => ({
        id: `inventory-id-${id}`,
        status: INVENTORY_AUDIT.STATUS.DISPATCHED,
        action: INVENTORY_AUDIT.ACTION.UPDATED,
      })
    )(mockId);

    const mockModelOptions = {
      transaction: 'transaction-id-12345',
    };

    const mockPayloadInventoryAudit = map(
      inventory => ({
        inventoryId: inventory.id,
        ...omit(['id'])(inventory),
      })
    )(mockInventories);

    const mockInventionAuditResponse = map(
      inventory => ({
        ...defaultModelAttributes,
        ...inventory,
      })
    )(mockPayloadInventoryAudit);


    model.inventoryAudit.create = jest.fn(({ inventoryId }) => find({ inventoryId })(mockInventionAuditResponse));

    const result = await serviceInventoryAudit.logUpdated(mockInventories, mockModelOptions);

    const length = size(mockInventories);
    for (let i=0; i<length; i++) {
      expect(model.inventoryAudit.create).toHaveBeenNthCalledWith(i+1,
        expect.objectContaining(mockPayloadInventoryAudit[i]),
        expect.objectContaining(mockModelOptions),
      );

      expect(model.inventoryAudit.create).toHaveNthReturnedWith(i+1,
        expect.objectContaining(mockInventionAuditResponse[i])
      );
    }

    expect(model.inventoryAudit.create).toHaveBeenCalledTimes(length);
    expect(result).toEqual(mockInventionAuditResponse);
  });

  it('should do nothing when there is no inventory data', async () => {

    const mockInventories = [];
    const mockModelOptions = {
      transaction: 'transaction-id-12345',
    };

    const expectedResult = [];

    const result = await serviceInventoryAudit.logUpdated(mockInventories, mockModelOptions);

    expect(model.inventoryAudit.create).not.toHaveBeenCalled();
    expect(result).toEqual(expectedResult);
  });

});
