import { DateTime } from 'luxon';
import { mapValues, snakeCase, reduce } from 'lodash/fp';

const mapValuesWithKey = mapValues.convert({ cap: false });
const reduceWithKey = reduce.convert({ cap: false });

const appendKeyField = (modelAttributes) => mapValuesWithKey(
    (value, key) => ({ ...value, field: value.field || snakeCase(key) })
  )(modelAttributes);

const transformKeyCamelToSnakeCase = (modelAttributes) => reduceWithKey(
  (result, value, key) => ({
    ...result,
    [snakeCase(key)]: value,
  }), {})(modelAttributes);

const withDefaultTableFields = (customizeFields, sequelize) => (
  appendKeyField({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: sequelize.BIGINT,
    },
    ...customizeFields,
    createdAt: { type: sequelize.DATE },
    updatedAt: { type: sequelize.DATE },
    deletedAt: { type: sequelize.DATE },
  })
);

const withForeignKey = ({ model, key = 'id' }, sequelize) => ({
  type: sequelize.BIGINT,
  references: {
    model,
    key,
  },
  onUpdate: 'CASCADE',
  onDelete: 'SET NULL',
});

const modelToObject = (modelDataValue) => JSON.parse(JSON.stringify(modelDataValue || {}));

const withInsertTimeStamp = (data) => (
  transformKeyCamelToSnakeCase({
    ...data,
    createdAt: DateTime.utc().toISO(),
    updatedAt: DateTime.utc().toISO(),
  })
);

export default {
  withDefaultTableFields,
  withForeignKey,
  withInsertTimeStamp,
  modelToObject,
  appendKeyField,
};
