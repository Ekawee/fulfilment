exports.id = "main";
exports.modules = {

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _http = __webpack_require__(/*! http */ "http");

var _http2 = _interopRequireDefault(_http);

var _express = __webpack_require__(/*! express */ "express");

var _express2 = _interopRequireDefault(_express);

var _compression = __webpack_require__(/*! compression */ "compression");

var _compression2 = _interopRequireDefault(_compression);

var _requestContext = __webpack_require__(/*! request-context */ "request-context");

var _requestContext2 = _interopRequireDefault(_requestContext);

var _swaggerUiExpress = __webpack_require__(/*! swagger-ui-express */ "swagger-ui-express");

var _swaggerUiExpress2 = _interopRequireDefault(_swaggerUiExpress);

var _swaggerJsdoc = __webpack_require__(/*! swagger-jsdoc */ "swagger-jsdoc");

var _swaggerJsdoc2 = _interopRequireDefault(_swaggerJsdoc);

var _config = __webpack_require__(/*! ./config */ "./src/config.js");

var _config2 = _interopRequireDefault(_config);

var _winston = __webpack_require__(/*! ./winston */ "./src/winston.js");

var _winston2 = _interopRequireDefault(_winston);

var _authenticate = __webpack_require__(/*! ./middleware/authenticate */ "./src/middleware/authenticate.js");

var _authenticate2 = _interopRequireDefault(_authenticate);

var _errorHandler = __webpack_require__(/*! ./middleware/error-handler */ "./src/middleware/error-handler.js");

var _errorHandler2 = _interopRequireDefault(_errorHandler);

var _bodyParser = __webpack_require__(/*! ./middleware/body-parser */ "./src/middleware/body-parser.js");

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _package = __webpack_require__(/*! ../package.json */ "./package.json");

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
app.use(_authenticate2.default);

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
app.use(_errorHandler2.default);

app.server.listen(_config2.default.port, function () {
  _winston2.default.logger.info('Started warehouse service', {
    port: app.server.address().port
  });
});

exports.default = app;

/***/ })

};