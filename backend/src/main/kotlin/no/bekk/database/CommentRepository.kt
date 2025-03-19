package no.bekk.database

import no.bekk.configuration.Database
import no.bekk.util.logger
import java.sql.ResultSet
import java.sql.SQLException
import java.util.*

object CommentRepository {
    lateinit var database: Database

    fun getCommentsByContextIdFromDatabase(contextId: String): MutableList<DatabaseComment> {
        logger.debug("Fetching comments for context: $contextId")
        val comments = mutableListOf<DatabaseComment>()
        try {
            database.getConnection().use { conn ->
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
            database.getConnection().use { conn ->
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

        logger.debug("Inserting comment into database: {}", comment)
        return try {
            insertCommentRow(comment)
        } catch (e: SQLException) {
            logger.error("Error inserting answer row into database: ${e.message}")
            throw RuntimeException("Error fetching answers from database", e)
        }
    }

    private fun insertCommentRow(comment: DatabaseCommentRequest): DatabaseComment {
        require(comment.contextId != null) {
            "You have to supply a contextId"
        }

        logger.debug("Inserting or updating comment for recordId={} and contextId={}", comment.recordId, comment.contextId)

        val upsertQuery = """
        INSERT INTO comments (actor, record_id, question_id, comment, context_id) 
        VALUES (?, ?, ?, ?, ?) 
        ON CONFLICT (context_id, record_id) DO UPDATE SET updated = NOW(), comment = ?
        RETURNING *
    """

        database.getConnection().use { conn ->
            logger.debug("Inserting or updating comment row into database: {}", comment)
            conn.prepareStatement(upsertQuery).use { statement ->
                statement.setString(1, comment.actor)
                statement.setString(2, comment.recordId)
                statement.setString(3, comment.questionId)
                statement.setString(4, comment.comment)
                statement.setObject(5, UUID.fromString(comment.contextId))
                statement.setString(6, comment.comment)

                val insertedResult = statement.executeQuery()
                if (insertedResult.next()) {
                    return mapResultSetToDatabaseComment(insertedResult)
                }
                throw RuntimeException("Error inserting comment into database")
            }
        }
    }

    private fun mapResultSetToDatabaseComment(resultSet: ResultSet): DatabaseComment {
        return DatabaseComment(
            actor = resultSet.getString("actor"),
            recordId = resultSet.getString("record_id"),
            questionId = resultSet.getString("question_id"),
            comment = resultSet.getString("comment"),
            updated = resultSet.getObject("updated", java.time.LocalDateTime::class.java).toString(),
            contextId = resultSet.getString("context_id")
        )
    }

    fun deleteCommentFromDatabase(contextId: String, recordId: String): Boolean {
        logger.debug("Deleting comment from database with recordId: $recordId and contextId: $contextId")
        val query = "DELETE FROM comments WHERE context_id = ? AND record_id = ?"
        database.getConnection().use { conn ->
            conn.prepareStatement(query).use { statement ->
                statement.setObject(1, UUID.fromString(contextId))
                statement.setString(2, recordId)
                return statement.executeUpdate() > 0
            }
        }
    }
}