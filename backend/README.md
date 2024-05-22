# spire-kk
Spire: Kartverket - kontrollere

Solution for recieving information from Airtable and present it in a GUI.

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
The database name is "kontrollere", and right now it has to be setup locally on the developers PC outside of Flyway.