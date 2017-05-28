const transactionService = require('../services/transactionService');
const validate = require('json-schema/lib/validate').validate;
const routeUtils = require('./routeUtils');

const transactionSchema = require('../schemas/transaction.json');
const transactionPatchSchema = require('../schemas/transactionPatch.json');

function register(app) {
  app.post('/transaction', (req, res, next) => {
    // Validate input
    const validationResult = validate(req.body, transactionSchema);
    if (!validationResult.valid) {
      return next(routeUtils.makeValidationError(validationResult));
    }
    // Execute request
    const inTransaction = req.body;
    return transactionService.createTransaction(inTransaction, req.user)
      .then(outTransaction => res.json(outTransaction))
      .catch(next);
  });

  app.get('/transaction', (req, res, next) => {
    transactionService.readAllTransactions(req.user)
      .then(transactions => res.json(transactions))
      .catch(next);
  });

  app.get('/transaction/:id', (req, res, next) => {
    const id = req.params.id;
    transactionService.readTransactionById(id)
      .then(transaction => res.json(transaction))
      .catch(next);
  });

  app.patch('/transaction/:id', (req, res, next) => {
    // Validate input
    const validationResult = validate(req.body, transactionPatchSchema);
    if (!validationResult.valid) {
      return next(routeUtils.makeValidationError(validationResult));
    }
    // Execute request
    const id = req.params.id;
    const inTransaction = req.body;
    return transactionService.isAuthorizedToEdit(id, req.user)
      .then(() => transactionService.updateTransaction(id, inTransaction))
      .then(outTransaction => res.json(outTransaction))
      .catch(next);
  });

  app.delete('/transaction/:id', (req, res, next) => {
    const id = req.params.id;
    return transactionService.isAuthorizedToEdit(id, req.user)
      .then(() => transactionService.deleteTransaction(id))
      .then(transaction => res.json(transaction))
      .catch(next);
  });
}

module.exports = register;
