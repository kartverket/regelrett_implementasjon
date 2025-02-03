package no.bekk.database

import io.ktor.server.plugins.*
import no.bekk.configuration.Database
import java.util.*
import java.sql.SQLException


object ContextRepository {
    fun insertContext(context: DatabaseContextRequest): DatabaseContext {
        val sqlStatement =
            "INSERT INTO contexts (team_id, table_id, name) VALUES(?, ?, ?) returning *"

        try {
            Database.getConnection().use { conn ->
                conn.prepareStatement(sqlStatement).use { statement ->
                    statement.setString(1, context.teamId)
                    statement.setString(2, context.formId)
                    statement.setString(3, context.name)

                    val result = statement.executeQuery()
                    if (result.next()) {
                        return DatabaseContext(
                            id = result.getString("id"),
                            teamId = result.getString("team_id"),
                            formId = result.getString("table_id"),
                            name = result.getString("name"),
                        )
                    } else {
                        throw RuntimeException("Error inserting context into database")
                    }
                }
            }
        } catch (e: SQLException) {
            if (e.sqlState == "23505") { // PostgreSQL unique_violation
                throw UniqueConstraintViolationException("A context with the same team_id, table_id and name already exists.")
            } else {
                throw e
            }
        }
    }



    fun getContextsByTeamId(teamId: String): List<DatabaseContext> {
        val sqlStatement = "SELECT * FROM contexts WHERE team_id = ?"

        Database.getConnection().use { conn ->
            conn.prepareStatement(sqlStatement).use { statement ->
                statement.setString(1, teamId)

                val result = statement.executeQuery()
                val contexts = mutableListOf<DatabaseContext>()

                while (result.next()) {
                    contexts.add(
                        DatabaseContext(
                            id = result.getString("id"),
                            teamId = result.getString("team_id"),
                            formId = result.getString("table_id"),
                            name = result.getString("name")
                        )
                    )
                }
                return contexts
            }
        }
    }

    fun getContextByTeamIdAndFormId(teamId: String, formId: String): List<DatabaseContext> {
        val sqlStatement = "SELECT * FROM contexts WHERE team_id = ? AND table_id = ?"

        Database.getConnection().use { conn ->
            conn.prepareStatement(sqlStatement).use { statement ->
                statement.setString(1, teamId)
                statement.setString(2, formId)

                val result = statement.executeQuery()
                val contexts = mutableListOf<DatabaseContext>()

                while (result.next()) {
                    contexts.add(
                        DatabaseContext(
                            id = result.getString("id"),
                            teamId = result.getString("team_id"),
                            formId = result.getString("table_id"),
                            name = result.getString("name"),
                        )
                    )
                }
                return contexts
            }
        }
    }

    fun getContext(id: String): DatabaseContext {
        val sqlStatement = "SELECT * FROM contexts WHERE id = ?"
        Database.getConnection().use { conn ->
            conn.prepareStatement(sqlStatement).use { statement ->
                statement.setObject(1, UUID.fromString(id))
                val result = statement.executeQuery()
                if (result.next()) {
                    return DatabaseContext(
                        id = result.getString("id"),
                        teamId = result.getString("team_id"),
                        formId = result.getString("table_id"),
                        name = result.getString("name")
                    )
                } else {
                    throw NotFoundException("Context with id $id not found")
                }
            }
        }
    }

    //This can be removed after schemas in frisk are migrated to new metadata
    fun getContextTableId(id: String): String {
        val sqlStatement = "SELECT table_id FROM contexts WHERE id = ?"
        Database.getConnection().use { conn ->
            conn.prepareStatement(sqlStatement).use { statement ->
                statement.setObject(1, UUID.fromString(id))
                val result = statement.executeQuery()
                if (result.next()) {
                    return result.getString("table_id")
                } else {
                    throw RuntimeException("Error getting table_id for this context")
                }
            }
        }
    }

    fun deleteContext(id: String): Boolean {
        val sqlStatementContext = "DELETE FROM contexts WHERE id = ?"
        Database.getConnection().use { conn ->
            conn.prepareStatement(sqlStatementContext).use { statement ->
                statement.setObject(1, UUID.fromString(id))
                return statement.executeUpdate() > 0
            }
        }
    }

    fun changeTeam(contextId: String, newTeamId: String): Boolean {
        val sqlStatement = "UPDATE contexts SET team_id = ? WHERE id = ?"
        Database.getConnection().use { conn ->
            conn.prepareStatement(sqlStatement).use { statement ->
                statement.setObject(1, UUID.fromString(newTeamId))
                statement.setObject(2, UUID.fromString(contextId))
                return statement.executeUpdate() > 0
            }
        }
    }
}

class UniqueConstraintViolationException(message: String) : RuntimeException(message)
