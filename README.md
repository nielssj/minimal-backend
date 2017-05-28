# A minimal monolithic example backend


## Usage

Run integration tests

```
docker-compose build
docker-compose up -d rethinkdb
docker-compose run backend sh /app/test/run-tests.sh
docker-compose down
```
