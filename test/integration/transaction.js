const expect = require('../unexpected-with-plugins');
const dbUtils = require('../../db/dbUtils');
const server = require('../../server/server');

const MOCK_TRANSACTION1 = require('../testdata/transaction1.json');

let app;
let db;

describe('Transaction', () => {
  const transactionId = '13911f34-d626-489b-be38-a68a63f3cf25';
  const authHeaderJane = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImQ1MDBhMWE3LWU0YTMtNDQ3MS1hZWJjLWQwOTAzMjA4YzQxOSIsImlhdCI6MTQ5NTk3NDk5NX0.uY_RWus_JjaT2UMpaIAT3N_xzpVi57StfLHnreD9dZ0';
  const userIdJane = 'd500a1a7-e4a3-4471-aebc-d0903208c419';
  const authHeaderOther = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRiZWJiZmI2LWVjNTMtNDlkNi04MzgzLWVkZmQwYzE2ZDM0NiJ9.WX9957xXfcHL_EWG_j3Jd5ELLNopZL42xkseQebcuwc';

  beforeEach((done) => {
    db = dbUtils.getDb();
    dbUtils.clear()
      .then(() => server.start())
      .then((startedApp) => {
        app = startedApp;
      })
      .then(() => {
        db = dbUtils.getDb();
        done();
      })
      .catch(done);
  });

  afterEach(() => {
    server.stop();
  });

  it('Creates a transaction', (done) => {
    expect(app,
      'to yield exchange',
      {
        request: {
          method: 'POST',
          url: '/transaction',
          body: JSON.parse(JSON.stringify(MOCK_TRANSACTION1)),
          headers: { Authorization: authHeaderJane },
        },
        response: {
          statusCode: 200,
        },
      })
      .then((context) => {
        const response = context.httpResponse;

        expect(response.body, 'to have property', 'id');
        expect(response.body, 'to have properties', MOCK_TRANSACTION1);

        db.query('SELECT * FROM "transaction"')
          .then((result) => {
            expect(result, 'to have length', 3);

            const transaction = result[0];
            expect(transaction, 'to have property', 'id');
            expect(transaction, 'to have properties', MOCK_TRANSACTION1);
            expect(transaction, 'to have property', 'authorUserId');
            expect(transaction.authorUserId, 'to equal', userIdJane);
            done();
          });
      });
  });

  it('Reads all transactions', (done) => {
    expect(app,
      'to yield exchange',
      {
        request: {
          method: 'GET',
          url: '/transaction',
          headers: { Authorization: authHeaderJane },
        },
        response: {
          statusCode: 200,
        },
      })
      .then((context) => {
        const response = context.httpResponse;
        expect(response.body, 'to be an', 'array');
        expect(response.body, 'to have length', 1);
        expect(response.body, 'to have items satisfying', { authorUserId: userIdJane });
        done();
      });
  });

  it('Reads a specific transaction based on id', (done) => {
    expect(app,
      'to yield exchange',
      {
        request: {
          method: 'GET',
          url: `/transaction/${transactionId}`,
          headers: { Authorization: authHeaderJane },
        },
        response: {
          statusCode: 200,
        },
      })
      .then((context) => {
        const response = context.httpResponse;
        expect(response.body, 'to be an', 'object');
        expect(response.body.id, 'to equal', transactionId);
        expect(response.body, 'to have properties', MOCK_TRANSACTION1);
        done();
      });
  });

  it('Updates an existing transaction', (done) => {
    const changes = { title: 'Bike insurance' };
    expect(app,
      'to yield exchange',
      {
        request: {
          method: 'PATCH',
          url: `/transaction/${transactionId}`,
          headers: { Authorization: authHeaderJane },
          body: changes,
        },
        response: {
          statusCode: 200,
        },
      })
      .then((context) => {
        const response = context.httpResponse;
        expect(response.body, 'to be an', 'object');
        expect(response.body.id, 'to equal', transactionId);
        expect(response.body, 'to have properties', changes);


        db.query('SELECT * FROM "transaction"')
          .then((result) => {
            expect(result, 'to have length', 2);

            const transaction = result.find(t => t.id === transactionId);
            expect(transaction, 'to have properties', changes);
            done();
          });
      });
  });

  it('Deletes an existing transaction', (done) => {
    expect(app,
      'to yield exchange',
      {
        request: {
          method: 'DELETE',
          url: `/transaction/${transactionId}`,
          headers: { Authorization: authHeaderJane },
        },
        response: {
          statusCode: 200,
        },
      })
      .then((context) => {
        const response = context.httpResponse;
        expect(response.body, 'to be an', 'object');
        expect(response.body.id, 'to equal', transactionId);
        expect(response.body, 'to have properties', MOCK_TRANSACTION1);

        db.query('SELECT * FROM "transaction"')
          .then((result) => {
            expect(result, 'to have length', 1);
            done();
          });
      });
  });

  it('Fails with appropriate error if unknown id attempted read', (done) => {
    const unknownId = '3ac50697-5205-4d3d-8c2a-289dce15aee4';
    expect(app,
      'to yield exchange',
      {
        request: {
          method: 'GET',
          url: `/transaction/${unknownId}`,
          headers: { Authorization: authHeaderJane },
        },
        response: {
          statusCode: 404,
        },
      })
      .then(() => done());
  });

  it('Fails with appropriate error if invalid transaction submitted for creation', (done) => {
    const transaction = JSON.parse(JSON.stringify(MOCK_TRANSACTION1));
    transaction.myInvalidParamter = 42;
    expect(app,
      'to yield exchange',
      {
        request: {
          method: 'POST',
          url: '/transaction',
          headers: { Authorization: authHeaderJane },
          body: transaction,
        },
        response: {
          statusCode: 400,
        },
      })
      .then(() => done());
  });

  it('Fails with validation error if patching invalid field attempted', (done) => {
    const patch = { myInvalidParamter: 42 };
    expect(app,
      'to yield exchange',
      {
        request: {
          method: 'PATCH',
          url: `/transaction/${transactionId}`,
          headers: { Authorization: authHeaderJane },
          body: patch,
        },
        response: {
          statusCode: 400,
        },
      })
      .then((context) => {
        const response = context.httpResponse;
        expect(response.body, 'to have properties', { name: 'ValidationError' });
        expect(response.body.details, 'to be an array');
        expect(response.body.details, 'to have length', 1);
        done();
      });
  });

  it('Fails with appropriate error if create without auth token attempted', (done) => {
    expect(app,
      'to yield exchange',
      {
        request: {
          method: 'POST',
          url: '/transaction',
          body: JSON.parse(JSON.stringify(MOCK_TRANSACTION1)),
        },
        response: {
          statusCode: 403,
        },
      })
      .then(() => done());
  });

  it('Fails with appropriate error if update of other author\'s transaction attempted', (done) => {
    const changes = { title: 'Bike insurance' };
    expect(app,
      'to yield exchange',
      {
        request: {
          method: 'PATCH',
          url: `/transaction/${transactionId}`,
          headers: { Authorization: authHeaderOther },
          body: changes,
        },
        response: {
          statusCode: 403,
        },
      })
      .then(() => done());
  });

  it('Fails with appropriate error if delete of other author\'s transaction attempted', (done) => {
    expect(app,
      'to yield exchange',
      {
        request: {
          method: 'DELETE',
          url: `/transaction/${transactionId}`,
          headers: { Authorization: authHeaderOther },
        },
        response: {
          statusCode: 403,
        },
      })
      .then(() => done());
  });
});
