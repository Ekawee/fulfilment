import { DateTime } from 'luxon';
import { mapValues, snakeCase, reduce, camelCase, map } from 'lodash/fp';

const mapValuesWithKey = mapValues.convert({ cap: false });
const reduceWithKey = reduce.convert({ cap: false });

/*
 * append key "field" with snake caes into model object when define in '../model'
 * @param1 object. e.g. [ { firstName: 'this is value' } ]
 * @return object. e.g. [ { firstName: 'this is value', field: 'first_name' } ]
 */
const appendKeyField = (modelAttributes) => mapValuesWithKey(
    (value, key) => ({ ...value, field: value.field || snakeCase(key) })
  )(modelAttributes);

/*
 * transform key object from camel case to snake case
 * @param1 object. e.g. { firstName: 'John', lastName: 'Doe' }
 * @return object. e.g. { first_name: 'John', last_name: 'Doe' }
 */
const transformKeyCamelToSnakeCase = (modelAttributes) => reduceWithKey(
  (result, value, key) => ({
    ...result,
    [snakeCase(key)]: value,
  }), {})(modelAttributes);

/*
 * trasnsform key object from snake case to camel case
 * @param1 array to contain object. e.g. [ { hello_world: 'this is value' } ]
 * @return array to contain object. e.g. [ { helloWorld: 'this is value' } ]
 */
const transformKeySnakeToCamelCase = (modelAttributes) => map(
  attribute => reduceWithKey(
      (result, value, key) => ({
        ...result,
        [camelCase(key)]: value,
      }), {})(attribute)
)(modelAttributes);

/*
 * append default attributes table
 * @param1 object. e.g. { firstName: type: sequelize.STRING }
 * @param2 object from sequelize lib.
 * @return object. e.g. { id: { allowNull: false .... }, firstName: type: sequelize.STRING, ... }
 */
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

/*
 * append references key properties when define FK in '../model'
 * @param1 object.
 * @param2 object from sequelize lib.
 * @return object to appended with these keys
 */
const withForeignKey = ({ model, key = 'id' }, sequelize) => ({
  type: sequelize.BIGINT,
  references: {
    model,
    key,
  },
  onUpdate: 'CASCADE',
  onDelete: 'SET NULL',
});

/*
 * transform sequelize model object to palin object.
 * @param1 sequelize model object. to contain dataValues
 * @return object.
 */
const modelToObject = (modelDataValue) => JSON.parse(JSON.stringify(modelDataValue || {}));

/*
 * append default time stamp when seeding and transform object key name from camel case to snake case.
 * @param1 object contain camel key. e.g. { firstName: 'John' }
 * @return object. e.g. { first_name: 'John', created_at: '2019-05-05 20:19:17', ... }
 */
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
  transformKeySnakeToCamelCase,
  transformKeyCamelToSnakeCase,
};
