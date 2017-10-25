const dbUtils = require('../db/dbUtils');

module.exports = {
  init: (event, context, callback) => {
    dbUtils.init()
      .then((result) => {
        dbUtils.close();
        callback(null, result);
      })
      .catch((err) => {
        dbUtils.close();
        callback(err);
      });
  }
};
