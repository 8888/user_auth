# Setup
Run a docker image with postgres.
```
$ docker-compose up -d --remove-orphans
```

Restore the database
```
$ createdb -h localhost user_auth
$ psql -h localhost -f schema.sql user_auth
```

Start the server
```
$ npm run serve
```

# Cleanup
Stop the vm without deleting the database
```
$ docker-compose stop
```

Stop the vm and remove all data
```
$ docker-compose down
```

# Connect to psql
```
$ psql -h localhost -d postgres
```

# Create a dump of the schema
```
$ docker exec user_auth_postgres_1 pg_dump -s -U $USER user_auth > schema.sql
```

# Initial DB creation
For reference, below is the SQL used to create the intial db. The database is created by the `createdb` command above in setup
```sql
CREATE TABLE users(
  id serial PRIMARY KEY,
  username VARCHAR (50) UNIQUE NOT NULL,
  password VARCHAR (50) NOT NULL,
  salt VARCHAR (50) NOT NULL
);
CREATE TABLE sessions(
  id serial PRIMARY KEY,
  token VARCHAR (50) NOT NULL,
  user_id INTEGER REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL
);
```
