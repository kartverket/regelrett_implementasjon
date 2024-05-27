# spire-kk
Spire: Kartverket - kontrollere

Solution for receiving information from Airtable and present it in a GUI. 
Provides a user interface which allows the user to insert and update answers to the questions to a PostGresQl Database.

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

# Run the application

To set up an IntelliJ project, New Project from existing sources -> <root directory
for spire-kk> -> Gradle project

# Backend

Edit Configurations -> Set up Runtime Environment with KTOR, and point to the class Application.kt

Set up as follows:

Working directory: <root of project>/backend
Use classpath of module: spire-kk.backend.main

# Frontend

Move to the frontend directory and type `npm start run`

