# Setup
If you do not have the docker postgres image, it can be pulled from the docker container repo.
```
$ docker pull postgres
```

Run a docker image with postgres. You can run without the `-v` arg and value to prevent data from persisting and not need to create the directories.
```
$ docker run --rm --name pg-docker -e POSTGRES_PASSWORD=docker -d -p 5432:5432 -v $HOME/docker/volumes/userAuth:/var/lib/postgresql/data postgres
```

Restore the databse
```
$ cat schema.sql | docker exec -i pg-docker psql -U postgres
```

# Cleanup
Stop the container
```
$ docker stop pg-docker
```

# Connect to psql
```
$ psql -h localhost -U postgres -d postgres
```
The password should be `docker`.

# Create a dump of the schema
```
$ docker exec pg-docker pg_dump -s -U postgres user_auth > schema.sql
```

# Initial DB creation
For reference, below is the SQL used to create the intial db
```sql
CREATE DATABASE user_auth;
\c user_auth
CREATE SCHEMA user_auth;
CREATE TABLE user_auth.auth;
CREATE SEQUENCE user_auth.auth_id_seq
  START WITH 1
  INCREMENT BY 1
  NO MINVALUE
  NO MAXVALUE
  CACHE 1;
CREATE TABLE user_auth.auth (
  id integer DEFAULT nextval('user_auth.auth_id_seq'::regclass) NOT NULL,
  salt text NOT NULL,
  token text NOT NULL,
  username text NOT NULL,
  pass_hash text NOT NULL
);
```
