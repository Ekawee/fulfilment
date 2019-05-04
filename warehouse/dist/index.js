'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _compression = require('compression');

var _compression2 = _interopRequireDefault(_compression);

var _requestContext = require('request-context');

var _requestContext2 = _interopRequireDefault(_requestContext);

var _swaggerUiExpress = require('swagger-ui-express');

var _swaggerUiExpress2 = _interopRequireDefault(_swaggerUiExpress);

var _swaggerJsdoc = require('swagger-jsdoc');

var _swaggerJsdoc2 = _interopRequireDefault(_swaggerJsdoc);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _winston = require('./winston');

var _winston2 = _interopRequireDefault(_winston);

var _authenticate = require('./middleware/authenticate');

var _authenticate2 = _interopRequireDefault(_authenticate);

var _errorHandler = require('./middleware/error-handler');

var _errorHandler2 = _interopRequireDefault(_errorHandler);

var _bodyParser = require('./middleware/body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _package = require('../package.json');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import controller from './controller';
var app = (0, _express2.default)();
app.server = _http2.default.createServer(app);

app.get('/api/' + _package.version + '/health-check', function (_, res) {
  res.json({ version: _package.version });
});

app.use(_requestContext2.default.middleware('request'));
app.use((0, _compression2.default)());
app.use((0, _bodyParser2.default)(_config2.default));
app.use(_winston2.default.loggerExpress);
// app.use(authenticate);

if (_config2.default.enableSwagger) {
  // https://github.com/Surnet/swagger-jsdoc/blob/master/docs/GETTING-STARTED.md
  var swaggerJSDocOptions = {
    swaggerDefinition: {
      info: {
        title: 'Warehouse service',
        version: _package.version
      },
      basePath: '/api/' + _package.version
    },
    apis: ['./src/controller/*.js']
  };
  var swaggerSpec = (0, _swaggerJsdoc2.default)(swaggerJSDocOptions);
  app.use('/api/' + _package.version + '/api-docs', _swaggerUiExpress2.default.serve, _swaggerUiExpress2.default.setup(swaggerSpec));
}

// app.use(`/api/${version}`, controller);
// app.use(errorHandler);

app.server.listen(_config2.default.port, function () {
  _winston2.default.logger.info('Started warehouse service', {
    port: app.server.address().port
  });
});

exports.default = app;