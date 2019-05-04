'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uat = exports.staging = exports.production = exports.test = exports.development = undefined;

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var sequelizeConfig = {
  username: _config2.default.dbUser,
  password: _config2.default.dbPassword,
  database: _config2.default.dbScheme,
  host: _config2.default.dbHost,
  dialect: 'postgres',
  operatorsAliases: false
};

var development = exports.development = sequelizeConfig;
var test = exports.test = sequelizeConfig;
var production = exports.production = sequelizeConfig;
var staging = exports.staging = sequelizeConfig;
var uat = exports.uat = sequelizeConfig;