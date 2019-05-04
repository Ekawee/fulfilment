'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _fp = require('lodash/fp');

var _winston = require('../winston');

var _winston2 = _interopRequireDefault(_winston);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// NOTE: HERE is required to have next
exports.default = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(err, req, res, next) {
    var type, message, status, messageCode, code, errors, payloadError;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            //eslint-disable-line
            type = err.name, message = err.message, status = err.status, messageCode = err.messageCode;
            code = status || 500;
            errors = (0, _fp.getOr)(message, ['errors'], err);
            payloadError = {
              type: type,
              errors: errors,
              status: status,
              message: message,
              messageCode: messageCode
            };

            _winston2.default.error('Exception Middleware', { originalErr: err, payloadError: payloadError });
            res.status(code).json(payloadError);

          case 6:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function (_x, _x2, _x3, _x4) {
    return _ref.apply(this, arguments);
  };
}();