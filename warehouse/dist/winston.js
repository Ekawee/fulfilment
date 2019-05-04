'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

var _expressWinston = require('express-winston');

var _expressWinston2 = _interopRequireDefault(_expressWinston);

var _luxon = require('luxon');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var format = _winston2.default.format;
var combine = format.combine,
    timestamp = format.timestamp,
    json = format.json,
    splat = format.splat;


var winstonDefaultOption = {
  level: 'info',
  format: combine(json(), splat()),
  transports: [new _winston2.default.transports.Console({
    timestamp: _luxon.DateTime.utc().toString()
  })]
};

var logger = _winston2.default.createLogger((0, _extends3.default)({}, winstonDefaultOption, {
  format: combine(timestamp(), json())
}));

var loggerExpress = _expressWinston2.default.logger((0, _extends3.default)({
  expressFormat: true,
  meta: true
}, winstonDefaultOption));

exports.default = {
  logger: logger,
  loggerExpress: loggerExpress
};