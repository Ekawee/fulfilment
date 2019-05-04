import dotenv from 'dotenv';
import 'universal-fetch';
dotenv.config();

const { env } = process;

const config = {
  bodyLimit: '50mb',
  port: env.PORT || 8080,
  dbHost: env.POSTGRES_HOST,
  dbScheme: env.POSTGRES_DB,
  dbUser: env.POSTGRES_USER,
  dbPassword: env.POSTGRES_PASSWORD,
  machineAuthenKey: env.MACHINE_AUTHEN_KEY,
  enableSwagger: env.ENABLE_SWAGGER,
};

export default config;
