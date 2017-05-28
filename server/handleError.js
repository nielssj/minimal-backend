const logUtils = require('../lib/logUtils');

const log = logUtils.getLogger();

function handleError(err, req, res, next) {
  log.error(err);

  switch (err.message) {
    case 'NOT_FOUND':
    case 'INVALID_CREDENTIALS':
      return res.status(404).send();
    case 'INVALID_INPUT':
      return res.status(400).json(err);
    case 'No authorization token was found':
    case 'UNAUTHORIZED':
      return res.status(403).send();
    default:
  }

  res.status(500).json({ message: err.message });
  return next();
}

module.exports = handleError;
