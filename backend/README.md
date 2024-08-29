# Local database (postgres)

To setup the database you need docker installed

```
brew cask install docker
```

You also need a container management tool or container runtime environments that allow you to run containers on your
local machine.

If you have docker desktop you can use that.

Otherwise you can use Colima

```
brew install colima
```

after installation has finished start colima by running

```
colima start
```

once you have colima or docker desktop running run the following command

```
docker run --name regelrett-db -it -e POSTGRES_PASSWORD=pwd -e POSTGRES_USER=postgres -e POSTGRES_DB=regelrett -p 5432:5432 -d postgres:15.4
```

You should now have a working database up and running

Run `./gradlew flywayMigrate` to migrate the DB Schemas in resources/db.migration

# How to run locally

## Build with Gradle

gradle build

## Run in IntelliJ

Edit Configurations -> Set up Runtime Environment with KTOR, and point to the class Application.kt

Set up as follows:

Working directory: <root of project>/backend
Use classpath of module: spire-kk.backend.main

Set the environment variable `AIRTABLE_ACCESS_TOKEN` in `Run -> Edit Configurations...`. You can get the value from one
of your teammates.

## Run the application

To set up an IntelliJ project, New Project from existing sources -> <root directory
for spire-kk> -> Gradle project

# Recieve all metodeverk

http://localhost:8080/metodeverk

# curl.txt

Contains curl commands for querying Airtable

# Flyway

The Application uses a PostgresQl Database, and Flyway migration to modify the database schema.

Each file in the Flyway migration script has to have the following format:

<Version>__<Description>.sql

example:

`V1.1__initial.sql`

The database name is "regelrett", and right now it has to be setup locally on the developers PC outside of Flyway.

Run ./gradlew flywayMigrate to migrate the DB Schemas in resources/db.migration

# More documentation

For more documentation
about [Build and deployment](./docs/build-and-deployment.md) [code structure](./docs/code-structure.md) and
the [data model](./docs/data-model.md) check
out the /docs directory.


