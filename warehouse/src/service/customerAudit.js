import { getOr } from 'lodash/fp';
import model from '../model';
import sequelizeUtil from '../util/sequelize';
import { BadRequestException } from '../exception';

const logAdded = async (customer, modelOptions) => {
  const id = getOr(null, 'id')(customer);
  if (!id) {
    throw new BadRequestException('there is no customer id');
  }

  const payload = {
    customerId: customer.id,
    currentInformation: JSON.stringify(sequelizeUtil.modelToObject(customer)),
  };
  return model.customerAudit.create(payload, modelOptions);
};

export default {
  logAdded,
};
