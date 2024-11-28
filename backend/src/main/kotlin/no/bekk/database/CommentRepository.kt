package no.bekk.database

import no.bekk.configuration.Database
import no.bekk.util.logger
import java.sql.SQLException
import java.util.*

object CommentRepository {
    fun getCommentsByContextIdFromDatabase(contextId: String): MutableList<DatabaseComment> {
        logger.debug("Fetching comments for context: $contextId")
        val comments = mutableListOf<DatabaseComment>()
        try {
            Database.getConnection().use { conn ->
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
                logger.debug("Successfully fetched context's $contextId comments from database.")
            }
        } catch (e: SQLException) {
            logger.error("Error fetching comments for context $contextId: ${e.message}")
            throw RuntimeException("Error fetching comments from database", e)
        }
        return comments
    }

    fun getCommentsByContextAndRecordIdFromDatabase(contextId: String, recordId: String): MutableList<DatabaseComment> {
        logger.debug("Fetching comments for context: $contextId with recordId: $recordId")

        val comments = mutableListOf<DatabaseComment>()
        try {
            Database.getConnection().use { conn ->
                val statement = conn.prepareStatement(
                    "SELECT id, actor, record_id, question_id, comment, updated FROM comments WHERE context_id = ? AND record_id = ? order by updated"
                )
                statement.setObject(1, UUID.fromString(contextId))
                statement.setString(2, recordId)
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
                logger.debug("Successfully fetched context's $contextId comments with recordId $recordId from database.")
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
        try {

            return insertCommentRow(comment)
        } catch (e: SQLException) {
            logger.error("Error inserting answer row into database: ${e.message}")
            throw RuntimeException("Error fetching answers from database", e)
        }
    }

    private fun insertCommentRow(comment: DatabaseCommentRequest): DatabaseComment {
        require(comment.contextId != null) {
            "You have to supply a contextId"
        }

        logger.debug("Inserting comment row into database: {}", comment)

        val sqlStatement =
            "INSERT INTO comments (actor, record_id, question_id, comment, context_id) VALUES (?, ?, ?, ?, ?) returning *"

        Database.getConnection().use { conn ->
            conn.prepareStatement(sqlStatement).use { statement ->
                statement.setString(1, comment.actor)
                statement.setString(2, comment.recordId)
                statement.setString(3, comment.questionId)
                statement.setString(4, comment.comment)
                statement.setObject(5, UUID.fromString(comment.contextId))

                val result = statement.executeQuery()
                if (result.next()) {
                    return DatabaseComment(
                        actor = result.getString("actor"),
                        recordId = result.getString("record_id"),
                        questionId = result.getString("question_id"),
                        comment = result.getString("comment"),
                        updated = result.getObject("updated", java.time.LocalDateTime::class.java).toString(),
                        contextId = result.getString("context_id")
                    )
                } else {
                    throw RuntimeException("Error inserting comments from database")
                }
            }
        }
    }

    fun deleteCommentFromDatabase(comment: DatabaseComment) {
        logger.debug("Deleting comment from database: {}", comment)
        insertCommentRow(
            DatabaseCommentRequest(
                comment.actor,
                comment.recordId,
                comment.questionId,
                "",
                comment.contextId
            )
        )
    }

    fun deleteCommentsByContextId(contextId: String): Boolean {
        val sqlStatementContext = "DELETE FROM comments WHERE context_id = ?"
        Database.getConnection().use { conn ->
            conn.prepareStatement(sqlStatementContext).use { statement ->
                statement.setObject(1, UUID.fromString(contextId))
                return statement.executeUpdate() > 0
            }
        }
    }
}