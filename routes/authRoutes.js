const authService = require('../services/authService');
const validate = require('json-schema/lib/validate').validate;
const routeUtils = require('./routeUtils');

const userSchema = require('../schemas/user.json');

function register(app) {
  app.post('/user', (req, res, next) => {
    // Validate input
    const validationResult = validate(req.body, userSchema);
    if (!validationResult.valid) {
      return next(routeUtils.makeValidationError(validationResult));
    }
    // Execute request
    return authService.createUser(req.body)
      .then(() => res.end())
      .catch(next);
  });
  app.post('/login', (req, res, next) => {
    // Validate input
    const validationResult = validate(req.body, userSchema);
    if (!validationResult.valid) {
      return next(routeUtils.makeValidationError(validationResult));
    }
    // Execute request
    return authService.logIn(req.body)
      .then(token => res.json({ token }))
      .catch(next);
  });
}

module.exports = register;
