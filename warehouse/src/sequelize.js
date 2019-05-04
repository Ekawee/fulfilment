import config from './config';

const sequelizeConfig = {
  username: config.dbUser,
  password: config.dbPassword,
  database: config.dbScheme,
  host: config.dbHost,
  dialect: 'postgres',
  operatorsAliases: false,
};

export const development = sequelizeConfig;
export const test = sequelizeConfig;
export const production = sequelizeConfig;
export const staging = sequelizeConfig;
export const uat = sequelizeConfig;
