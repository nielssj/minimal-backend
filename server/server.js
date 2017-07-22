const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const swaggerize = require('swaggerize-express');
const swaggerApi = require('../config/swagger.json');
const dbUtils = require('../db/dbUtils');
const logUtils = require('../lib/logUtils');
const handleError = require('./handleError');
const authService = require('../services/authService');

const log = logUtils.getLogger();

const app = express()
  .use(bodyParser.json())
  .use(authService.getMiddleware())
  .use(swaggerize({
    api: swaggerApi,
    docspath: '/api-docs',
    handlers: '../handlers',
  }))
  .use(handleError);

const server = http.createServer(app);

function listen() {
  return new Promise((resolve, reject) => {
    server.listen(3000, () => {
      app.swagger.api.host = server.address().address + server.address().port;
      log.info('Example app listening on port 3000!');
      if (process.env.JWT_SECRET) {
        const secretPreview = process.env.JWT_SECRET.substring(0, 5);
        log.info(`secret found: ${secretPreview}`);
      } else {
        log.warning('no jwt secret found, using default.');
      }
      resolve();
    });
    server.on('error', reject);
  });
}

function start() {
  return dbUtils.init()
    .then(() => listen())
    .then(() => app)
    .catch((err) => {
      log.error(`Failed to start server: ${err}`);
      process.exit(1);
    });
}

function stop() {
  server.close();
  dbUtils.close();
}

module.exports = { app, start, stop };
