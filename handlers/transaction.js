const transactionService = require('../services/transactionService');
const dbUtils = require('../db/dbUtils');

module.exports = {
  post: (transaction, context, callback) => {
    // const user = { id: context.authorizer.principalId };
    const user = { id: 'bc79214b-3361-4f30-8411-d31b66e15873' }; // FIXME: When auth implemented get from context (see previous line)
    transactionService.createTransaction(transaction, user)
      .then((result) => {
        dbUtils.close();
        callback(null, result);
      })
      .catch((err) => {
        dbUtils.close();
        callback(err);
      });
  },
  get: (input, context, callback) => {
    // const user = { id: context.authorizer.principalId };
    const user = { id: 'bc79214b-3361-4f30-8411-d31b66e15873' }; // FIXME: When auth implemented get from context (see previous line)
    transactionService.readAllTransactions(user)
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
