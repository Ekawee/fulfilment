'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

require('universal-fetch');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config();

var _process = process,
    env = _process.env;


var config = {
  bodyLimit: '50mb',
  port: env.PORT || 8080,
  dbHost: env.POSTGRES_HOST,
  dbScheme: env.POSTGRES_DB,
  dbUser: env.POSTGRES_USER,
  dbPassword: env.POSTGRES_PASSWORD,
  machineAuthenKey: env.MACHINE_AUTHEN_KEY,
  enableSwagger: env.ENABLE_SWAGGER
};

exports.default = config;