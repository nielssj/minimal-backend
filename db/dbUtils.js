const fs = require('mz/fs');
const path = require('path');
const pgp = require('pg-promise')();
const config = require('../config');

const QueryFile = pgp.QueryFile;

const TABLE_DEFINITION_PATH = path.join(__dirname, '../db/tableDefinitions');
const DEFAULT_DATA_PATH = path.join(__dirname, '../db/defaultData.sql');

let db = null;

function getDb() {
  if (!db) {
    db = pgp(config.postgres);
  }
  return db;
}

function close() {
  if (db) {
    pgp.end();
  }
}

function createTables() {
  getDb();
  return fs.readdir(TABLE_DEFINITION_PATH)
    .then(files => Promise.all(files.map((file) => {
      const filePath = `${TABLE_DEFINITION_PATH}/${file}`;
      return fs.readFile(filePath, 'utf8');
    })))
    .then(queries => Promise.all(queries.map(query => db.query(query))));
}

function isAlreadyInitialized() {
  getDb();
  const query = `
    SELECT EXISTS (
      SELECT 1
      FROM   information_schema.tables
      WHERE  table_schema = 'public'
      AND    table_name = 'transaction'
    );
  `;
  return db.query(query).then(res => res[0].exists);
}

function insertDefaultData() {
  return db.query(new QueryFile(DEFAULT_DATA_PATH));
}

function init() {
  return isAlreadyInitialized()
    .then((isInitialized) => {
      if (!isInitialized) {
        return createTables().then(() => insertDefaultData());
      }
      return true;
    });
}

function clear() {
  return Promise.all([
    db.query('DROP TABLE IF EXISTS "transaction"'),
    db.query('DROP TABLE IF EXISTS "user"'),
  ]);
}

module.exports = { getDb, close, init, clear };
