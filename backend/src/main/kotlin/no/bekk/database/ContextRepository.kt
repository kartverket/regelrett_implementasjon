package no.bekk.database;

import no.bekk.configuration.getDatabaseConnection

class ContextRepository {
    fun insertContext(context: DatabaseContextRequest): DatabaseContext {
        val connection = getDatabaseConnection()
        val sqlStatement =
            "INSERT INTO contexts (team_id, name) VALUES(?, ?) returning *"

        connection.prepareStatement(sqlStatement).use { statement ->
            statement.setString(1, context.teamId)
            statement.setString(2, context.name)

            val result = statement.executeQuery()
            if (result.next()) {
                return DatabaseContext(
                    id = result.getString("id"),
                    teamId = result.getString("team_id"),
                    name = result.getString("name"),
                )
            } else {
                throw RuntimeException("Error inserting context into database")
            }
        }
    }

    fun getContextsByTeamId(teamId: String): List<DatabaseContext> {
        val connection = getDatabaseConnection()
        val sqlStatement = "SELECT * FROM contexts WHERE team_id = ?"

        connection.prepareStatement(sqlStatement).use { statement ->
            statement.setString(1, teamId)

            val result = statement.executeQuery()
            val contexts = mutableListOf<DatabaseContext>()

            while (result.next()) {
                contexts.add(
                    DatabaseContext(
                        id = result.getString("id"),
                        teamId = result.getString("team_id"),
                        name = result.getString("name")
                    )
                )
            }
            return contexts
        }
    }
}
