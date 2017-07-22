const authService = require('../services/authService');

module.exports = {
  post: (req, res, next) =>
    authService.createUser(req.body)
      .then(() => res.end())
      .catch(next),
};
