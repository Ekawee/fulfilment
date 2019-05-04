import http from 'http';
import express from 'express';
import compression from 'compression';
import contextService from 'request-context';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
// import controller from './controller';
import config from './config';
import winston from './winston';
import authenticate from './middleware/authenticate';
import errorHandler from './middleware/error-handler';
import bodyParser from './middleware/body-parser';
import { version } from '../package.json';

const app = express();
app.server = http.createServer(app);

app.get(`/api/${version}/health-check`, (_, res) => {
  res.json({ version });
});

app.use(contextService.middleware('request'));
app.use(compression());
app.use(bodyParser(config));
app.use(winston.loggerExpress);
app.use(authenticate);

if (config.enableSwagger) {
  // https://github.com/Surnet/swagger-jsdoc/blob/master/docs/GETTING-STARTED.md
  const swaggerJSDocOptions = {
    swaggerDefinition: {
      info: {
        title: 'Warehouse service',
        version,
      },
      basePath: `/api/${version}`,
    },
    apis: ['./src/controller/*.js'],
  };
  const swaggerSpec = swaggerJSDoc(swaggerJSDocOptions);
  app.use(`/api/${version}/api-docs`, swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

// app.use(`/api/${version}`, controller);
app.use(errorHandler);

app.server.listen(config.port, () => {
  winston.logger.info('Started warehouse service', {
    port: app.server.address().port,
  });
});

export default app;
