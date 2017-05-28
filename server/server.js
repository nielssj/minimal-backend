const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const dbUtils = require('../db/dbUtils');
const logUtils = require('../lib/logUtils');
const handleError = require('./handleError');
const transactionRoutes = require('../routes/transactionRoutes');
const authRoutes = require('../routes/authRoutes');
const authService = require('../services/authService');

const log = logUtils.getLogger();

const app = express()
  .use(bodyParser.json());

const server = http.createServer(app);

function bindRoutes() {
  transactionRoutes(app);
  authRoutes(app);
  app.use(handleError);
}

function listen() {
  return new Promise((resolve, reject) => {
    server.listen(3000, () => {
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
    .then(() => {
      authService.init(app);
      bindRoutes();
      return listen();
    })
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
