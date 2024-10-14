package no.bekk.database

import no.bekk.configuration.getDatabaseConnection
import no.bekk.util.logger
import java.sql.Connection
import java.sql.SQLException
import java.sql.Types
import java.util.*

class CommentRepository {
    fun getCommentsByTeamIdFromDatabase(teamId: String): MutableList<DatabaseComment> {
        logger.debug("Fetching comments for team: $teamId")
        val connection = getDatabaseConnection()
        val comments = mutableListOf<DatabaseComment>()
        try {
            connection.use { conn ->
                val statement = conn.prepareStatement(
                    "SELECT id, actor, record_id, question_id, comment, updated, team, function_id, table_id FROM comments WHERE team = ? order by updated"
                )
                statement.setString(1, teamId)
                val resultSet = statement.executeQuery()
                while (resultSet.next()) {
                    val actor = resultSet.getString("actor")
                    val recordId = resultSet.getString("record_id")
                    val questionId = resultSet.getString("question_id")
                    val comment = resultSet.getString("comment")
                    val updated = resultSet.getObject("updated", java.time.LocalDateTime::class.java)
                    val team = resultSet.getString("team")
                    var functionId: Int? = resultSet.getInt("function_id")
                    val tableId = resultSet.getString("table_id")
                    if (resultSet.wasNull()) {
                        functionId = null
                    }
                    comments.add(
                        DatabaseComment(
                            actor = actor,
                            recordId = recordId,
                            questionId = questionId,
                            comment = comment,
                            updated = updated?.toString() ?: "",
                            team = team,
                            functionId = functionId,
                            tableId = tableId
                        )
                    )
                }
                logger.info("Successfully fetched team $teamId 's comments from database.")
            }
        } catch (e: SQLException) {
            logger.error("Error fetching comments for team $teamId: ${e.message}")
            throw RuntimeException("Error fetching comments from database", e)
        }
        return comments
    }

    fun getCommentsByFunctionIdFromDatabase(functionId: Int): MutableList<DatabaseComment> {
        logger.debug("Fetching comments for function: $functionId")
        val connection = getDatabaseConnection()
        val comments = mutableListOf<DatabaseComment>()
        try {
            connection.use { conn ->
                val statement = conn.prepareStatement(
                    "SELECT id, actor, record_id, question_id, comment, updated, team, function_id, table_id FROM comments WHERE function_id = ? order by updated"
                )
                statement.setInt(1, functionId)
                val resultSet = statement.executeQuery()
                while (resultSet.next()) {
                    val actor = resultSet.getString("actor")
                    val recordId = resultSet.getString("record_id")
                    val questionId = resultSet.getString("question_id")
                    val comment = resultSet.getString("comment")
                    val updated = resultSet.getObject("updated", java.time.LocalDateTime::class.java)
                    val team = resultSet.getString("team")
                    var functionId: Int? = resultSet.getInt("function_id")
                    val tableId = resultSet.getString("table_id")
                    if (resultSet.wasNull()) {
                        functionId = null
                    }
                    comments.add(
                        DatabaseComment(
                            actor = actor,
                            recordId = recordId,
                            questionId = questionId,
                            comment = comment,
                            updated = updated?.toString() ?: "",
                            team = team,
                            functionId = functionId,
                            tableId = tableId
                        )
                    )
                }
                logger.info("Successfully fetched function $functionId 's comments from database.")
            }
        } catch (e: SQLException) {
            logger.error("Error fetching comments for function $functionId: ${e.message}")
            throw RuntimeException("Error fetching comments from database", e)
        }
        return comments
    }

    fun getCommentsByContextIdFromDatabase(contextId: String, tableId: String): MutableList<DatabaseComment> {
        logger.debug("Fetching comments for context: $contextId")
        val connection = getDatabaseConnection()
        val comments = mutableListOf<DatabaseComment>()
        try {
            connection.use { conn ->
                val statement = conn.prepareStatement(
                    "SELECT id, actor, record_id, question_id, comment, updated FROM comments WHERE context_id = ? AND table_id = ? order by updated"
                )
                statement.setObject(1, UUID.fromString(contextId))
                statement.setString(2, tableId)
                val resultSet = statement.executeQuery()
                while (resultSet.next()) {
                    val actor = resultSet.getString("actor")
                    val recordId = resultSet.getString("record_id")
                    val questionId = resultSet.getString("question_id")
                    val comment = resultSet.getString("comment")
                    val updated = resultSet.getObject("updated", java.time.LocalDateTime::class.java)

                    comments.add(
                        DatabaseComment(
                            actor = actor,
                            recordId = recordId,
                            questionId = questionId,
                            comment = comment,
                            updated = updated?.toString() ?: "",
                            contextId = contextId,
                            tableId = tableId
                        )
                    )
                }
                logger.info("Successfully fetched context's $contextId comments from database.")
            }
        } catch (e: SQLException) {
            logger.error("Error fetching comments for context $contextId: ${e.message}")
            throw RuntimeException("Error fetching comments from database", e)
        }
        return comments
    }

    fun getCommentsByTeamAndRecordIdFromDatabase(teamId: String, tableId: String, recordId: String): MutableList<DatabaseComment> {
        logger.debug("Fetching comments for team: $teamId with recordId: $recordId")
        val connection = getDatabaseConnection()
        val comments = mutableListOf<DatabaseComment>()
        try {
            connection.use { conn ->
                val statement = conn.prepareStatement(
                    "SELECT id, actor, record_id, question_id, comment, updated, team, function_id, table_id FROM comments WHERE team = ? AND table_id = ? AND record_id = ? order by updated"
                )
                statement.setString(1, teamId)
                statement.setString(2, tableId)
                statement.setString(3, recordId)

                val resultSet = statement.executeQuery()
                while (resultSet.next()) {
                    val actor = resultSet.getString("actor")
                    val questionId = resultSet.getString("question_id")
                    val comment = resultSet.getString("comment")
                    val updated = resultSet.getObject("updated", java.time.LocalDateTime::class.java)
                    val team = resultSet.getString("team")
                    var functionId: Int? = resultSet.getInt("function_id")
                    val tableId = resultSet.getString("table_id")
                    if (resultSet.wasNull()) {
                        functionId = null
                    }
                    comments.add(
                        DatabaseComment(
                            actor = actor,
                            recordId = recordId,
                            questionId = questionId,
                            comment = comment,
                            updated = updated.toString(),
                            team = team,
                            functionId = functionId,
                            tableId = tableId
                        )
                    )
                }
                logger.info("Successfully fetched team $teamId 's comments with recordId $recordId and tableId $tableId from database.")
            }
        } catch (e: SQLException) {
            logger.error("Error fetching comments for team $teamId with recordId $recordId: ${e.message}")
            throw RuntimeException("Error fetching comments from database", e)
        }
        return comments
    }

    fun getCommentsByFunctionAndRecordIdFromDatabase(functionId: Int, tableId: String, recordId: String): MutableList<DatabaseComment> {
        logger.debug("Fetching comments for function: $functionId with recordId: $recordId")
        val connection = getDatabaseConnection()
        val comments = mutableListOf<DatabaseComment>()
        try {
            connection.use { conn ->
                val statement = conn.prepareStatement(
                    "SELECT id, actor, record_id, question_id, comment, updated, team, function_id, table_id FROM comments WHERE function_id = ? AND table_id = ? AND record_id = ? order by updated"
                )
                statement.setInt(1, functionId)
                statement.setString(2, tableId)
                statement.setString(3, recordId)

                val resultSet = statement.executeQuery()
                while (resultSet.next()) {
                    val actor = resultSet.getString("actor")
                    val questionId = resultSet.getString("question_id")
                    val comment = resultSet.getString("comment")
                    val updated = resultSet.getObject("updated", java.time.LocalDateTime::class.java)
                    val team = resultSet.getString("team")
                    var functionId: Int? = resultSet.getInt("function_id")
                    val tableId = resultSet.getString("table_id")
                    if (resultSet.wasNull()) {
                        functionId = null
                    }
                    comments.add(
                        DatabaseComment(
                            actor = actor,
                            recordId = recordId,
                            questionId = questionId,
                            comment = comment,
                            updated = updated.toString(),
                            team = team,
                            functionId = functionId,
                            tableId = tableId
                        )
                    )
                }
                logger.info("Successfully fetched function $functionId 's comments with recordId $recordId and tableId $tableId from database.")
            }
        } catch (e: SQLException) {
            logger.error("Error fetching comments for function $functionId with recordId $recordId: ${e.message}")
            throw RuntimeException("Error fetching comments from database", e)
        }
        return comments
    }

    fun getCommentsByContextAndRecordIdFromDatabase(contextId: String, tableId: String, recordId: String): MutableList<DatabaseComment> {
        logger.debug("Fetching comments for context: $contextId with recordId: $recordId")
        val connection = getDatabaseConnection()
        val comments = mutableListOf<DatabaseComment>()
        try {
            connection.use { conn ->
                val statement = conn.prepareStatement(
                    "SELECT id, actor, record_id, question_id, comment, updated FROM comments WHERE context_id = ? AND table_id = ? AND record_id = ? order by updated"
                )
                statement.setObject(1, UUID.fromString(contextId))
                statement.setString(2, tableId)
                statement.setString(3, recordId)
                val resultSet = statement.executeQuery()
                while (resultSet.next()) {
                    val actor = resultSet.getString("actor")
                    val questionId = resultSet.getString("question_id")
                    val comment = resultSet.getString("comment")
                    val updated = resultSet.getObject("updated", java.time.LocalDateTime::class.java)

                    comments.add(
                        DatabaseComment(
                            actor = actor,
                            recordId = recordId,
                            questionId = questionId,
                            comment = comment,
                            updated = updated.toString(),
                            contextId = contextId,
                            tableId = tableId
                        )
                    )
                }
                logger.info("Successfully fetched context's $contextId comments with recordId $recordId from database.")
            }
        } catch (e: SQLException) {
            logger.error("Error fetching comments for context $contextId with recordId $recordId: ${e.message}")
            throw RuntimeException("Error fetching comments from database", e)
        }
        return comments
    }

    fun insertCommentOnTeam(comment: DatabaseCommentRequest): DatabaseComment  {
        logger.debug("Inserting comment into database...")
        val connection = getDatabaseConnection()
        try {
            connection.use { conn ->

                val result = conn.prepareStatement(
                    "SELECT question_id, team FROM comments WHERE question_id = ? AND team = ? "
                )

                result.setString(1, comment.questionId)
                result.setString(2, comment.team)

                return insertCommentRow(conn, comment)
            }

        } catch (e: SQLException) {
            logger.error("Error inserting comments into database: ${e.message}")
            throw RuntimeException("Error fetching comments from database", e)
        }
    }

    fun insertCommentOnFunction(comment: DatabaseCommentRequest): DatabaseComment {
        require(comment.functionId != null) {
            "You have to supply a functionId"
        }
        println(comment)

        logger.debug("Inserting answer into database: {}", comment)
        val connection = getDatabaseConnection()
        try {
            connection.use { conn ->
                val result = conn.prepareStatement(
                    "SELECT question_id, function_id FROM comments WHERE question_id = ? AND function_id = ?"
                )

                result.setString(1, comment.questionId)
                result.setInt(2, comment.functionId)

                return insertCommentRow(conn, comment)
            }
        } catch (e: SQLException) {
            logger.error("Error inserting comment into database: ${e.message}")
            throw RuntimeException("Error inserting comment into database", e)
        }
    }

    fun insertCommentOnContext(comment: DatabaseCommentRequest): DatabaseComment {
        require(comment.contextId != null) {
            "You have to supply a contextId"
        }

        logger.debug("Inserting answer into database: {}", comment)
        val connection = getDatabaseConnection()
        try {
            connection.use { conn ->
                val result = conn.prepareStatement(
                    "SELECT question_id, context_id FROM comments WHERE question_id = ? AND context_id = ?"
                )

                result.setString(1, comment.questionId)
                result.setObject(2, UUID.fromString(comment.contextId))

                return insertCommentRow(conn, comment)
            }
        } catch (e: SQLException) {
            logger.error("Error inserting answer row into database: ${e.message}")
            throw RuntimeException("Error fetching answers from database", e)
        }
    }

    private fun insertCommentRow(conn: Connection, comment: DatabaseCommentRequest): DatabaseComment {
        logger.debug("Inserting comment row into database: {}", comment)

        val sqlStatement =
            "INSERT INTO comments (actor, record_id, question_id, comment, team, function_id, table_id, context_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?) returning *"

        conn.prepareStatement(sqlStatement).use { statement ->
            statement.setString(1, comment.actor)
            statement.setString(2, comment.recordId)
            statement.setString(3, comment.questionId)
            statement.setString(4, comment.comment)
            statement.setString(5, comment.team)
            statement.setString(6, comment.tableId)
            if (comment.functionId != null) {
                statement.setInt(7, comment.functionId)
            } else {
                statement.setNull(7, Types.INTEGER)
            }
            statement.setObject(8, UUID.fromString(comment.contextId))
            val result = statement.executeQuery()
            if (result.next()) {
                var functionId: Int? = result.getInt("function_id")
                if (result.wasNull()) {
                    functionId = null
                }
                return DatabaseComment(
                    actor = result.getString("actor"),
                    recordId = result.getString("record_id"),
                    questionId = result.getString("question_id"),
                    comment = result.getString("comment"),
                    team = result.getString("team"),
                    functionId = functionId,
                    tableId = result.getString("table_id"),
                    updated = result.getObject("updated", java.time.LocalDateTime::class.java).toString(),
                    contextId = result.getString("context_id")
                )
            } else {
                throw RuntimeException("Error inserting comments from database")
            }
        }
    }

    fun deleteCommentFromDatabase(comment: DatabaseComment) {
        logger.debug("Deleting comment from database: {}", comment)
        val connection = getDatabaseConnection()
        insertCommentRow(
            connection,
            DatabaseCommentRequest(
                comment.actor,
                comment.recordId,
                comment.questionId,
                "",
                comment.team,
                comment.functionId,
                comment.tableId,
                comment.contextId
            )
        )
    }
}