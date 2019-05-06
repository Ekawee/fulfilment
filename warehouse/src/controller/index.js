import express from 'express';
import inventory from './inventory';

const controllers = [
  inventory,
];

const controllerApi = express.Router();

controllerApi.use(controllers);

export default controllerApi;
