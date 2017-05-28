# A minimal monolithic example backend
Implements a CRUD (create-read-update-delete) API of personal financial transactions. Includes the minimum features in order to represent a realistic production-grade backend. 

The features are the following (implementation in parentheis):

- [x] RESTful HTTP interface (`express`, `body-parser`)
- [x] Authentication (`express-jwt`, `jsonwebtoken`, `bcrypt`)
- [x] Authorization (custom code)
- [x] Input validation (`json-schema`)
- [x] Persistent storage (Postgres with `pg-promise`)
- [x] Logging (`log`)
- [x] Uncaught error handling (custom code)
- [x] Integration testing (`mocha`, `unexpected`, `instabul`)
- [x] Static analysis, "linting" (`eslint`, `eslint-config-airbnb-base`)
- [x] Deployment abstraction (Docker container)
- [x] Configuration (custom code)
- [ ] Continuous integration setup (*TO BE IMPLEMENTED*)
- [ ] Deployment pipeline (*TO BE IMPLEMENTED*)
- [ ] Documentation (*TO BE IMPLEMENTED*)

## Usage

Run integration tests

```
docker-compose build
docker-compose up -d rethinkdb
docker-compose run backend sh /app/test/run-tests.sh
docker-compose down
```
