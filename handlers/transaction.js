const transactionService = require('../services/transactionService');

module.exports = {
  post: (req, res, next) => {
    const inTransaction = req.body;
    return transactionService.createTransaction(inTransaction, req.user)
      .then(outTransaction => res.json(outTransaction))
      .catch(next);
  },
  get: (req, res, next) =>
    transactionService.readAllTransactions(req.user)
    .then(transactions => res.json(transactions))
    .catch(next),
};
