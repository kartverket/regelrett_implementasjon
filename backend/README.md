# Add Airtable token
In config.properties add the airtable token `accessToken=your_token`

# Local Postgres

Install Postgres on your local machine.
If you do not have Postgres, you can use

`brew install postgresql`

To initalize the database instance

`initdb -D kontrollere`

Start PostgreSQL Server: Once the database cluster is initialized, you can start the PostgreSQL server. Run the following command:

`pg_ctl -D kontrollere start`

Create a new database:
`createdb kontrollere`

Copy the application.conf.template file and rename the copied file to application.conf.
Edit application.conf:
`ktor.database` to `"your_postgresql_username"`

Run `./gradlew flywayMigrate` to migrate the DB Schemas in resources/db.migration

# How to run locally

## Build with Gradle

gradle build

## Run in IntelliJ

Edit Configurations -> Set up Runtime Environment with KTOR, and point to the class Application.kt

Set up as follows:

Working directory: <root of project>/backend
Use classpath of module: spire-kk.backend.main

Set the environment variable `AIRTABLE_ACCESS_TOKEN` in `Run -> Edit Configurations...`. You can get the value from one of your teammates.

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

The database name is "kontrollere", and right now it has to be setup locally on the developers PC outside of Flyway.

Run ./gradlew flywayMigrate to migrate the DB Schemas in resources/db.migration

