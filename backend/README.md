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

You need to set the following environment variables:
```
AIRTABLE_ACCESS_TOKEN
CLIENT_ID
CLIENT_SECRET
TENANT_ID
```

To get access to the secrets ask someone on the team to give you access to the 1password vault.
`AIRTABLE_ACCESS_TOKEN` is stored under the name `AirTable` in the vault and `CLIENT_ID`, `CLIENT_SECRET`
and `TENANT_ID` is stored under `EntraId`.

You can do this in IntelliJ under `Run -> Edit configurations`. Most of the values can be found in 1Password. You should be given access by another team member.

## Build with Gradle

gradle build

## Run in IntelliJ

Edit Configurations -> Set up Runtime Environment with KTOR, and point to the class Application.kt

Set up as follows:

Working directory: <root of project>/backend
Use classpath of module: spire-kk.backend.main

## Run the application

To set up an IntelliJ project, New Project from existing sources -> <root directory
for spire-kk> -> Gradle project

# curl.txt

Contains curl commands for querying Airtable

# Flyway

The Application uses a PostgresQl Database, and Flyway migration to modify the database schema.

Each file in the Flyway migration script has to have the following format:

<Version>__<Description>.sql

example:

`V1.1__initial.sql`

The database name is "regelrett", and right now it has to be setup locally on the developers PC outside of Flyway.
Database migrations are run automatically on application startup. Or you can run them manually with `./gradlew flywayMigrate`

# More documentation

For more documentation
about [Build and deployment](./docs/build-and-deployment.md) [code structure](./docs/code-structure.md) and
the [data model](./docs/data-model.md) check
out the /docs directory.


