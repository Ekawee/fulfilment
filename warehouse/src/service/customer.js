import { getOr } from 'lodash/fp';
import model from '../model';

const findByIdOrCreate = async (data, modelOptions) => {
  const id = getOr(null, 'id')(data);

  return id
  ? model.customer.findById(id, modelOptions)
  : model.customer.create(data, modelOptions);
};

export default {
  findByIdOrCreate,
};
