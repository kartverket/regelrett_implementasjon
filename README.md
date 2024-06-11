# spire-kk

Spire: Kartverket - kontrollere*

Solution for receiving information from several views/tables in Airtable and present it in a GUI. 
Provides a user interface which allows the user to insert and update answers to the questions to a PostGresQl Database.

See README.md in backend and frontend directories for setup

## How to run using docker
1. Clone the github repository
2. Follow these steps in the backend reamde [Add airtable token](https://github.com/bekk/spire-kk/blob/main/backend/README.md#add-airtable-token) and [Local Postgres](https://github.com/bekk/spire-kk/tree/main/backend#local-postgres)
3. In compose.yaml change the environment variable `DB_USER` to the username that is given when initializing the database cluster in the previous step.
4. Run in the root folder `docker compose up`
5. To stop the docker container run `docker compose down`
