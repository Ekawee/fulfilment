/* eslint-disable camelcase */
import { DateTime } from 'luxon';
import sequelizeUtil from '../../src/util/sequelize';
import { sequelize } from '../../src/model';

jest.mock('../../src/model', () => ({
  sequelize: {
    BIGINT: jest.fn(),
    DATE: jest.fn(),
  },
}));

describe('/util/sequelize/appendKeyField', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return object with append key "field"', async () => {
    const mockModelAttribute = {
      firstName: {
        attribute: 'string',
      },
      lastName: {
        attribute: 'string',
      },
    };

    const expectedResult = {
      firstName: {
        attribute: 'string',
        field: 'first_name',
      },
      lastName: {
        attribute: 'string',
        field: 'last_name',
      },
    };

    const result = sequelizeUtil.appendKeyField(mockModelAttribute);

    expect(result).toEqual(expectedResult);
  });
});

describe('/util/sequelize/transformKeyCamelToSnakeCase', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return transform object keys from camel to snake', async () => {
    const mockModelAttribute = {
      firstName: 'John',
      lastName: 'Doe',
    };

    const expectedResult = {
      first_name: 'John',
      last_name: 'Doe',
    };

    const result = sequelizeUtil.transformKeyCamelToSnakeCase(mockModelAttribute);

    expect(result).toEqual(expectedResult);
  });
});

describe('/util/sequelize/transformKeySnakeToCamelCase', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return transform object keys in array from snake to camel', async () => {
    const mockModelAttribute = [
      {
        first_name: 'John',
        last_name: 'Doe',
      },
    ];

    const expectedResult = [
      {
        firstName: 'John',
        lastName: 'Doe',
      },
    ];

    const result = sequelizeUtil.transformKeySnakeToCamelCase(mockModelAttribute);

    expect(result).toEqual(expectedResult);
  });
});

describe('/util/sequelize/withDefaultTableFields', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return object with append key "field" and append fields', async () => {
    const mockModelAttribute = {
      firstName: {
        attribute: 'string',
      },
      lastName: {
        attribute: 'string',
      },
    };

    const expectedResult = {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: sequelize.BIGINT,
        field: 'id',
      },
      firstName: {
        attribute: 'string',
        field: 'first_name',
      },
      lastName: {
        attribute: 'string',
        field: 'last_name',
      },
      createdAt: {
        type: sequelize.DATE,
        field: 'created_at',
      },
      updatedAt: {
        type: sequelize.DATE,
        field: 'updated_at',
      },
      deletedAt: {
        type: sequelize.DATE,
        field: 'deleted_at',
      },
    };

    const result = sequelizeUtil.withDefaultTableFields(mockModelAttribute, sequelize);

    expect(result).toEqual(expectedResult);
  });
});

describe('/util/sequelize/withForeignKey', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return object to append references key properties for define FK', async () => {
    const mockModelAttribute = {
      model: 'customer',
    };

    const expectedResult = {
      type: sequelize.BIGINT,
      references: {
        model: mockModelAttribute.model,
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    };

    const result = sequelizeUtil.withForeignKey(mockModelAttribute, sequelize);

    expect(result).toEqual(expectedResult);
  });
});

describe('/util/sequelize/withInsertTimeStamp', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return palin object append default time stamp and transform object key name from camel case to snake case', async () => {
    const mockModelAttribute = {
      firstName: 'John',
      lastName: 'Doe',
    };

    const mockToday = DateTime.fromISO('2019-05-05T14:00:21');
    DateTime.utc = jest.fn(() => mockToday);

    const expectedResult = {
      first_name: 'John',
      last_name: 'Doe',
      created_at: mockToday.toISO(),
      updated_at: mockToday.toISO(),
    };

    const result = sequelizeUtil.withInsertTimeStamp(mockModelAttribute);

    expect(result).toEqual(expectedResult);
  });
});

