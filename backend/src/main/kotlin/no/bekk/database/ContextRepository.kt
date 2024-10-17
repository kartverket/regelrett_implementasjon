package no.bekk.database;

import no.bekk.configuration.getDatabaseConnection
import java.util.*

class ContextRepository {
    fun insertContext(context: DatabaseContextRequest): DatabaseContext {
        val connection = getDatabaseConnection()
        val sqlStatement =
            "INSERT INTO contexts (team_id, table_id, name) VALUES(?, ?, ?) returning *"

        connection.prepareStatement(sqlStatement).use { statement ->
            statement.setString(1, context.teamId)
            statement.setString(2, context.tableId)
            statement.setString(3, context.name)

            val result = statement.executeQuery()
            if (result.next()) {
                return DatabaseContext(
                    id = result.getString("id"),
                    teamId = result.getString("team_id"),
                    tableId = result.getString("table_id"),
                    name = result.getString("name"),
                )
            } else {
                throw RuntimeException("Error inserting context into database")
            }
        }
    }

    fun getContextsByTeamId(teamId: String, tableId: String): List<DatabaseContext> {
        val connection = getDatabaseConnection()
        val sqlStatement = "SELECT * FROM contexts WHERE team_id = ? AND table_id = ?"

        connection.prepareStatement(sqlStatement).use { statement ->
            statement.setString(1, teamId)
            statement.setString(2, tableId)

            val result = statement.executeQuery()
            val contexts = mutableListOf<DatabaseContext>()

            while (result.next()) {
                contexts.add(
                    DatabaseContext(
                        id = result.getString("id"),
                        teamId = result.getString("team_id"),
                        tableId = result.getString("table_id"),
                        name = result.getString("name")
                    )
                )
            }
            return contexts
        }
    }

    fun getContext(id: String): DatabaseContext {
        val connection = getDatabaseConnection()
        val sqlStatement = "SELECT * FROM contexts WHERE id = ?"
        connection.prepareStatement(sqlStatement).use { statement ->
            statement.setObject(1, UUID.fromString(id))
            val result = statement.executeQuery()
            if (result.next()) {
                return DatabaseContext(
                    id = result.getString("id"),
                    teamId = result.getString("team_id"),
                    name = result.getString("name")
                )
            } else {
                throw RuntimeException("Error getting context")
            }
        }
    }
}
