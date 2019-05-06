import { getOr } from 'lodash/fp';
import model from '../model';
import service from '../service';

const findByPkOrCreate = async (data, modelOptions) => {
  const id = getOr(null, 'id')(data);

  return id
  ? model.customer.findByPk(id, modelOptions)
  : service.customer.create(data, modelOptions);
};

const create = async (data, modelOptions) => {
  const customer = await model.customer.create(data, modelOptions);
  await service.customerAudit.logAdded(customer, modelOptions);
  return customer;
};

export default {
  findByPkOrCreate,
  create,
};
