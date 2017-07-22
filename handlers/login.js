const authService = require('../services/authService');

module.exports = {
  post: (req, res, next) =>
    authService.logIn(req.body)
      .then(token => res.json({ token }))
      .catch(next),
};
