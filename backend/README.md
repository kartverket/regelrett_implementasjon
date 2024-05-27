# spire-kk
Spire: Kartverket - kontrollere

# Build with Gradle

gradle build

# Run in IntelliJ

Edit Configurations -> Set up Runtime Environment with KTOR, and point to the class Application.kt

# Recieve all metodeverk

http://localhost:8080/metodeverk

# curl.txt

Curl commands for querying Airtable

# Flyway

The Application uses a PostgresQl Database, and Flyway migration to modify the database schema.

Each file in the Flyway migration script has to have the following format:

<Version>__<Description>.sql

example:

`V1.1__initial.sql`

The database name is "kontrollere", and right now it has to be setup locally on the developers PC outside of Flyway.

Run ./gradlew flywayMigrate to migrate the DB Schemas in resources/db.migration