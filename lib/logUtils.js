const Log = require('log');

const LOG_LEVEL = process.env.LOG_LEVEL || 'DEBUG';
let log = null;

function getLogger() {
  if (log) {
    return log;
  }
  log = new Log(LOG_LEVEL);
  log.on('line', line => console.log(line)); // eslint-disable-line no-console
  return log;
}

module.exports = { getLogger };
