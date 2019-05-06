import { getOr } from 'lodash/fp';
import model from '../model';

const findByPkOrCreate = async (data, modelOptions) => {
  const id = getOr(null, 'id')(data);

  return id
  ? model.customer.findByPk(id, modelOptions)
  : model.customer.create(data, modelOptions);
};

export default {
  findByPkOrCreate,
};
