'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (config) {
  return function (req, res, next) {
    _bodyParser2.default.json({
      limit: config.bodyLimit
    })(req, res, function (err) {
      if (err) {
        var type = err.name,
            message = err.message,
            status = err.status;

        return res.status(status).send({ type: type, message: message });
      }
      next();
    });
  };
};