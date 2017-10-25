const uuid = require('uuid');
const dbUtils = require('../db/dbUtils');


function createTransaction(transaction, user) {
  const db = dbUtils.getDb();
  const id = uuid.v4();
  const query = `
    INSERT INTO "transaction" ("id", "authorUserId", "title", "amount", "description")
    VALUES ($[id], $[authorUserId], $[title], $[amount], $[description])
    RETURNING *;
  `;
  const values = {
    id,
    authorUserId: user.id,
    title: transaction.title,
    amount: transaction.amount,
    description: transaction.description,
  };
  return db.query(query, values).then(result => result[0]);
}

function readAllTransactions(user) {
  const db = dbUtils.getDb();
  const query = `
    SELECT *
    FROM public.transaction
    WHERE "authorUserId" = $[userId];
  `;
  return db.query(query, { userId: user.id });
}

function readTransactionById(id) {
  const db = dbUtils.getDb();
  const query = `
    SELECT *
    FROM "transaction"
    WHERE "id" = $[id];
  `;
  return db.query(query, { id })
    .then((result) => {
      if (result.length === 0) {
        throw new Error('NOT_FOUND');
      }
      return result[0];
    });
}

function isAuthorizedToEdit(id, user) {
  return readTransactionById(id)
    .then((transaction) => {
      if (transaction.authorUserId !== user.id) {
        throw new Error('UNAUTHORIZED');
      }
    });
}

function updateTransaction(id, transaction) {
  const db = dbUtils.getDb();
  const assignments = Object.keys(transaction).filter(field => field !== 'id')
    .map(field => `${field} = $[${field}]`);
  const query = `
    UPDATE "transaction"
    SET ${assignments.join(',')}
    WHERE "id" = $[id]
    RETURNING *
  `;
  const values = Object.assign({ id }, transaction);
  return db.query(query, values).then(result => result[0]);
}

function deleteTransaction(id) {
  const db = dbUtils.getDb();
  const query = `
    DELETE FROM "transaction"
    WHERE "id" = $[id]
    RETURNING *
  `;
  return db.query(query, { id }).then(result => result[0]);
}

module.exports = {
  createTransaction,
  readAllTransactions,
  readTransactionById,
  updateTransaction,
  deleteTransaction,
  isAuthorizedToEdit,
};
