package no.bekk.database

import no.bekk.configuration.getDatabaseConnection
import no.bekk.util.logger
import java.sql.Connection
import java.sql.SQLException
import java.sql.Types
import java.util.*

class CommentRepository {
    fun getCommentsByContextIdFromDatabase(contextId: String): MutableList<DatabaseComment> {
        logger.debug("Fetching comments for context: $contextId")
        val connection = getDatabaseConnection()
        val comments = mutableListOf<DatabaseComment>()
        try {
            connection.use { conn ->
                val statement = conn.prepareStatement(
                    "SELECT id, actor, record_id, question_id, comment, updated FROM comments WHERE context_id = ? order by updated"
                )
                statement.setObject(1, UUID.fromString(contextId))
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

    fun getCommentsByContextAndRecordIdFromDatabase(contextId: String, recordId: String): MutableList<DatabaseComment> {
        logger.debug("Fetching comments for context: $contextId with recordId: $recordId")
        val connection = getDatabaseConnection()
        val comments = mutableListOf<DatabaseComment>()
        try {
            connection.use { conn ->
                val statement = conn.prepareStatement(
                    "SELECT id, actor, record_id, question_id, comment, updated FROM comments WHERE context_id = ? AND record_id = ? order by updated"
                )
                statement.setObject(1, UUID.fromString(contextId))
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
            "INSERT INTO comments (actor, record_id, question_id, comment, team, function_id, context_id) VALUES (?, ?, ?, ?, ?, ?, ?) returning *"

        conn.prepareStatement(sqlStatement).use { statement ->
            statement.setString(1, comment.actor)
            statement.setString(2, comment.recordId)
            statement.setString(3, comment.questionId)
            statement.setString(4, comment.comment)
            statement.setString(5, comment.team)
            if (comment.functionId != null) {
                statement.setInt(6, comment.functionId)
            } else {
                statement.setNull(6, Types.INTEGER)
            }
            if (comment.contextId != null) {
                statement.setObject(7, UUID.fromString(comment.contextId))
            } else {
                statement.setNull(7, Types.OTHER)
            }
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
                comment.contextId
            )
        )
    }
}