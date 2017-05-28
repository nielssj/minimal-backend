const expect = require('../unexpected-with-plugins');
const dbUtils = require('../../db/dbUtils');
const server = require('../../server/server');

const MOCK_USER1 = require('../testdata/user1.json');

let app;
let db;

describe('User', () => {
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

  it('Creates a user', (done) => {
    expect(app,
      'to yield exchange',
      {
        request: {
          method: 'POST',
          url: '/user',
          body: JSON.parse(JSON.stringify(MOCK_USER1)),
        },
        response: {
          statusCode: 200,
        },
      })
      .then(() => {
        db.query('SELECT * FROM "user"')
          .then((result) => {
            expect(result, 'to have length', 2);

            const user = result.find(u => u.email === MOCK_USER1.email);
            expect(user, 'to have property', 'id');
            expect(user, 'to have property', 'password');
            expect(user.password, 'not to equal', MOCK_USER1.password);
            done();
          });
      });
  });

  it('Fails with validation error if user with invalid field posted', (done) => {
    const invalidUser = { invalidUserParameter: 42 };
    expect(app,
      'to yield exchange',
      {
        request: {
          method: 'POST',
          url: '/user',
          body: invalidUser,
        },
        response: {
          statusCode: 400,
        },
      })
      .then((context) => {
        const response = context.httpResponse;
        expect(response.body, 'to have properties', { message: 'INVALID_INPUT' });
        expect(response.body.errors, 'to be an array');
        expect(response.body.errors, 'to have length', 3);
        done();
      });
  });

  it('Logs in successfully', (done) => {
    const credentials = { email: 'jane@doe.com', password: '1234' };
    expect(app,
      'to yield exchange',
      {
        request: {
          method: 'POST',
          url: '/login',
          body: JSON.parse(JSON.stringify(credentials)),
        },
        response: {
          statusCode: 200,
        },
      })
      .then((context) => {
        const response = context.httpResponse;
        expect(response.body, 'to be an object');
        expect(response.body, 'to have property', 'token');
        done();
      });
  });

  it('Fails with validation error if login with unknown email attempted', (done) => {
    const unknownUser = { email: 'jack@doe.com', password: '1234' };
    expect(app,
      'to yield exchange',
      {
        request: {
          method: 'POST',
          url: '/login',
          body: unknownUser,
        },
        response: {
          statusCode: 404,
        },
      })
      .then(() => done());
  });

  it('Fails with validation error if login with wrong password attempted', (done) => {
    const unknownUser = { email: 'jane@doe.com', password: '4321' };
    expect(app,
      'to yield exchange',
      {
        request: {
          method: 'POST',
          url: '/login',
          body: unknownUser,
        },
        response: {
          statusCode: 404,
        },
      })
      .then(() => done());
  });

/*  it('Reads all transactions', (done) => {
    expect(app,
      'to yield exchange',
      {
        request: {
          method: 'GET',
          url: '/transaction',
        },
        response: {
          statusCode: 200,
        },
      })
      .then((context) => {
        const response = context.httpResponse;
        expect(response.body, 'to be an', 'array');
        expect(response.body, 'to have length', 1);
        expect(response.body[0], 'to have properties', MOCK_TRANSACTION1);
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
            expect(result, 'to have length', 1);

            const transaction = result[0];
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
            expect(result, 'to have length', 0);
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
          body: transaction,
        },
        response: {
          statusCode: 400,
        },
      })
      .then(() => done());
  });*/
});
