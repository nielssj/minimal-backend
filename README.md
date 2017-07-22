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

### Tests
Run integration tests using the following terminal commands. Starts an isolated instance of database and services in a pair of docker containers, runs linting, testing, coverage analysis and shuts all down again afterwards.

```
docker-compose build
docker-compose up -d postgres
docker-compose run backend sh /app/test/run-tests.sh
docker-compose down
```
### Documentation
The API is documented in `/config/swagger.json`. For a fancy HTML rendering you can run the Swagger UI docker image as follows:
```
docker run -p 9090:8080 -e "SWAGGER_JSON=/minimal-backend/config/swagger.json" -v /local/path/to/repo/minimal-backend:/minimal-backend swaggerapi/swagger-ui
```
Or simply copy/paste the content of swagger.json to the online Swagger Editor (http://editor.swagger.io). These tools are not included in the Node.js dependencies of the repo for simplicity.
