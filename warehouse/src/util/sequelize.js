import { DateTime } from 'luxon';

const withDefaultTableFields = (customizeFields, sequelize) => ({
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
});

const withForeignKey = ({ model, key = 'id' }, sequelize) => ({
  type: sequelize.BIGINT,
  references: {
    model,
    key,
  },
  onUpdate: 'CASCADE',
  onDelete: 'SET NULL',
});

const withInsertTimeStamp = (data) => ({
  ...data,
  createdAt: DateTime.utc().toISO(),
  updatedAt: DateTime.utc().toISO(),
});

export default {
  withDefaultTableFields,
  withForeignKey,
  withInsertTimeStamp,
};
