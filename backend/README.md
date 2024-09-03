# Local Postgres

Install Postgres on your local machine.
If you do not have Postgres, you can use

`brew install postgresql`

To initalize the database instance

`initdb -D regelrett`

Start PostgreSQL Server: Once the database cluster is initialized, you can start the PostgreSQL server. Run the
following command:

`pg_ctl -D regelrett start`

Create a new database:
`createdb regelrett`

Copy the application.conf.template file and rename the copied file to application.conf.
Edit application.conf:
`ktor.database` to `"your_postgresql_username"`

Run `./gradlew flywayMigrate` to migrate the DB Schemas in resources/db.migration

# How to run locally

You need to set the following environment variables:
```
AIRTABLE_ACCESS_TOKEN
CLIENT_ID
CLIENT_SECRET
TENANT_ID
```
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


