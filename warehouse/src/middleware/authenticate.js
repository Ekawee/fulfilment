import asyncWrapper from './async-wrapper';
export default asyncWrapper(async (req, res, next) => {
  next();
});
