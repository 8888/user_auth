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
$ npm run watch
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
$ psql postgresql://localhost/user_auth
```

# Create a dump of the schema
```
$ pg_dump -s --clean --no-owner -h localhost user_auth > schema.sql
```

# Initial DB creation
For reference, below is the SQL used to create the intial db. The database is created by the `createdb` command above in setup
```sql
CREATE TABLE users(
  id serial PRIMARY KEY,
  username VARCHAR (50) UNIQUE NOT NULL,
  password VARCHAR (64) NOT NULL,
  salt VARCHAR (64) NOT NULL
);
CREATE TABLE sessions(
  id serial PRIMARY KEY,
  token VARCHAR (50) NOT NULL,
  user_id INTEGER REFERENCES users(id),
  created_at TIMESTAMPTZ default now() NOT NULL
);
```
