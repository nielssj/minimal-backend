const transactionService = require('../../services/transactionService');

module.exports = {
  get: (req, res, next) =>
    transactionService.readTransactionById(req.params.id)
      .then(transaction => res.json(transaction))
      .catch(next),
  patch: (req, res, next) => {
    const inTransaction = req.body;
    return transactionService.isAuthorizedToEdit(req.params.id, req.user)
      .then(() => transactionService.updateTransaction(req.params.id, inTransaction))
      .then(outTransaction => res.json(outTransaction))
      .catch(next);
  },
  delete: (req, res, next) =>
    transactionService.isAuthorizedToEdit(req.params.id, req.user)
      .then(() => transactionService.deleteTransaction(req.params.id))
      .then(transaction => res.json(transaction))
      .catch(next),
};
