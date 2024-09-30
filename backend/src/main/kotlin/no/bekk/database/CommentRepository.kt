package no.bekk.database

import no.bekk.configuration.getDatabaseConnection
import no.bekk.util.logger
import java.sql.Connection
import java.sql.SQLException

class CommentRepository {
    fun getCommentsByTeamIdFromDatabase(teamId: String): MutableList<DatabaseComment> {
        logger.debug("Fetching comments for team: $teamId")
        val connection = getDatabaseConnection()
        val comments = mutableListOf<DatabaseComment>()
        try {
            connection.use { conn ->
                val statement = conn.prepareStatement(
                    "SELECT id, actor, question_id, comment, updated, team FROM comments WHERE team = ?"
                )
                statement.setString(1, teamId)
                val resultSet = statement.executeQuery()
                while (resultSet.next()) {
                    val actor = resultSet.getString("actor")
                    val questionId = resultSet.getString("question_id")
                    val comment = resultSet.getString("comment")
                    val updated = resultSet.getObject("updated", java.time.LocalDateTime::class.java)
                    val team = resultSet.getString("team")
                    comments.add(
                        DatabaseComment(
                            actor = actor,
                            questionId = questionId,
                            comment = comment,
                            updated = updated?.toString() ?: "",
                            team = team,
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

    fun insertComment(comment: DatabaseComment): DatabaseComment  {
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

    private fun insertCommentRow(conn: Connection, comment: DatabaseComment): DatabaseComment {
        logger.debug("Inserting comment row into database: {}", comment)

        val sqlStatement =
            "INSERT INTO comments (actor, question_id, comment, team) VALUES (?, ?, ?, ?) returning *"

        conn.prepareStatement(sqlStatement).use { statement ->
            statement.setString(1, comment.actor)
            statement.setString(2, comment.questionId)
            statement.setString(3, comment.comment)
            statement.setString(4, comment.team)
            val result = statement.executeQuery()
            if (result.next()) {
                return DatabaseComment(
                    actor = result.getString("actor"),
                    questionId = result.getString("question_id"),
                    comment = result.getString("comment"),
                    team = result.getString("team"),
                    updated = result.getObject("updated", java.time.LocalDateTime::class.java).toString()
                )
            } else {
                throw RuntimeException("Error inserting comments from database")
            }
        }
    }

    fun deleteCommentFromDatabase(comment: DatabaseComment) {
        logger.debug("Deleting comment from database: {}", comment)
        val connection = getDatabaseConnection()
        try {
            connection.use { conn ->
                val statement = conn.prepareStatement(
                    "DELETE FROM comments WHERE question_id = ? AND team = ?"
                )
                statement.setString(1, comment.questionId)
                statement.setString(2, comment.team)
                statement.executeUpdate()
            }
        } catch (e: SQLException) {
            logger.error("Error deleting comment from database ${e.message}")
            throw RuntimeException("Error deleting comment from database", e)
        }
        logger.info("Successfully deleted comment from database: {}", comment)
    }
}