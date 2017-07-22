const expressJWT = require('express-jwt');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const dbUtils = require('../db/dbUtils');

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const PUBLIC_PATHS = {
  path: [
    { url: '/health-check', methods: ['GET'] },
    { url: '/login', methods: ['POST'] },
    { url: '/user', methods: ['POST'] },
  ],
};

function getMiddleware() {
  return expressJWT({ secret: JWT_SECRET }).unless(PUBLIC_PATHS);
}

function hashPassword(password) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        return reject(err);
      }
      return resolve(hash);
    });
  });
}

function insertUserRecord(user, hash) {
  const db = dbUtils.getDb();
  const id = uuid.v4();
  const query = `
    INSERT INTO "user" ("id", "email", "password")
    VALUES ($[id], $[email], $[password])
    RETURNING *;
  `;
  const values = Object.assign({ id }, user, { id, password: hash });
  return db.query(query, values);
}

function selectUserRecord(email) {
  const db = dbUtils.getDb();
  const query = `
    SELECT * 
    FROM "user"
    WHERE "email" = $[email];
  `;
  return db.query(query, { email })
    .then((result) => {
      if (result.length === 0) {
        return null;
      }
      return result[0];
    });
}

function createUser(user) {
  return hashPassword(user.password).then(hash => insertUserRecord(user, hash));
}


function logIn(credentials) {
  let user = null;
  return selectUserRecord(credentials.email)
    .then((result) => {
      user = result;
      if (!user) {
        throw new Error('INVALID_CREDENTIALS');
      }
      return new Promise((resolve, reject) => {
        const strPassword = String(credentials.password);
        bcrypt.compare(strPassword, user.password, (err, isMatch) => {
          if (err) {
            return reject(err);
          }
          return resolve(isMatch);
        });
      });
    })
    .then((isMatch) => {
      if (!isMatch) {
        throw new Error('INVALID_CREDENTIALS');
      }
      return jwt.sign({ id: user.id }, JWT_SECRET);
    });
}

module.exports = {
  getMiddleware,
  createUser,
  logIn,
};
