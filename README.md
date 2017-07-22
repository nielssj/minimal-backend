# A minimal monolithic example backend
Implements a CRUD (create-read-update-delete) API of personal financial transactions. Includes the minimum features in order to represent a realistic production-grade backend. 

The features are the following (implementation in parentheis):

- [x] RESTful HTTP interface (`express`, `body-parser`, `swagger`)
- [x] Authentication (`express-jwt`, `jsonwebtoken`, `bcrypt`)
- [x] Authorization (custom code)
- [x] Input validation (`swaggerize-express`)
- [x] Persistent storage (Postgres with `pg-promise`)
- [x] Logging (`log`)
- [x] Uncaught error handling (custom code)
- [x] Integration testing (`mocha`, `unexpected`, `istanbul`)
- [x] Static analysis, "linting" (`eslint`, `eslint-config-airbnb-base`)
- [x] Deployment abstraction (Docker container)
- [x] Configuration (custom code)
- [ ] Continuous integration setup (*TO BE IMPLEMENTED*)
- [ ] Deployment pipeline (*TO BE IMPLEMENTED*)
- [x] Documentation (`swagger`)

## Usage

Run integration tests using the following terminal commands. Starts an isolated instance of database and services in a pair of docker containers, runs linting, testing, coverage analysis and shuts all down again afterwards.

```
docker-compose build
docker-compose up -d postgres
docker-compose run backend sh /app/test/run-tests.sh
docker-compose down
```
