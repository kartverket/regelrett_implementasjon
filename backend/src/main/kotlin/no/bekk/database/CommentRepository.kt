package no.bekk.database

import no.bekk.configuration.getDatabaseConnection
import no.bekk.util.logger
import java.sql.Connection
import java.sql.SQLException
import java.sql.Types

class CommentRepository {
    fun getCommentsByTeamIdFromDatabase(teamId: String): MutableList<DatabaseComment> {
        logger.debug("Fetching comments for team: $teamId")
        val connection = getDatabaseConnection()
        val comments = mutableListOf<DatabaseComment>()
        try {
            connection.use { conn ->
                val statement = conn.prepareStatement(
                    "SELECT id, actor, record_id, question_id, comment, updated, team, function_id FROM comments WHERE team = ?"
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
                            functionId = functionId
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
                    "SELECT id, actor, record_id, question_id, comment, updated, team, function_id FROM comments WHERE function_id = ?"
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
                            functionId = functionId
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

    fun getCommentsByTeamAndRecordIdFromDatabase(teamId: String, recordId: String): MutableList<DatabaseComment> {
        logger.debug("Fetching comments for team: $teamId with recordId: $recordId")
        val connection = getDatabaseConnection()
        val comments = mutableListOf<DatabaseComment>()
        try {
            connection.use { conn ->
                val statement = conn.prepareStatement(
                    "SELECT id, actor, record_id, question_id, comment, updated, team, function_id FROM comments WHERE team = ? AND record_id = ?"
                )
                statement.setString(1, teamId)
                statement.setString(2, recordId)
                val resultSet = statement.executeQuery()
                while (resultSet.next()) {
                    val actor = resultSet.getString("actor")
                    val questionId = resultSet.getString("question_id")
                    val comment = resultSet.getString("comment")
                    val updated = resultSet.getObject("updated", java.time.LocalDateTime::class.java)
                    val team = resultSet.getString("team")
                    var functionId: Int? = resultSet.getInt("function_id")
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
                            functionId = functionId
                        )
                    )
                }
                logger.info("Successfully fetched team $teamId 's comments with recordId $recordId from database.")
            }
        } catch (e: SQLException) {
            logger.error("Error fetching comments for team $teamId with recordId $recordId: ${e.message}")
            throw RuntimeException("Error fetching comments from database", e)
        }
        return comments
    }

    fun getCommentsByFunctionAndRecordIdFromDatabase(functionId: Int, recordId: String): MutableList<DatabaseComment> {
        logger.debug("Fetching comments for function: $functionId with recordId: $recordId")
        val connection = getDatabaseConnection()
        val comments = mutableListOf<DatabaseComment>()
        try {
            connection.use { conn ->
                val statement = conn.prepareStatement(
                    "SELECT id, actor, record_id, question_id, comment, updated, team, function_id FROM comments WHERE function_id = ? AND record_id = ?"
                )
                statement.setInt(1, functionId)
                statement.setString(2, recordId)
                val resultSet = statement.executeQuery()
                while (resultSet.next()) {
                    val actor = resultSet.getString("actor")
                    val questionId = resultSet.getString("question_id")
                    val comment = resultSet.getString("comment")
                    val updated = resultSet.getObject("updated", java.time.LocalDateTime::class.java)
                    val team = resultSet.getString("team")
                    var functionId: Int? = resultSet.getInt("function_id")
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
                            functionId = functionId
                        )
                    )
                }
                logger.info("Successfully fetched function $functionId 's comments with recordId $recordId from database.")
            }
        } catch (e: SQLException) {
            logger.error("Error fetching comments for function $functionId with recordId $recordId: ${e.message}")
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
            logger.error("Error inserting answer row into database: ${e.message}")
            throw RuntimeException("Error fetching answers from database", e)
        }
    }

    private fun insertCommentRow(conn: Connection, comment: DatabaseCommentRequest): DatabaseComment {
        logger.debug("Inserting comment row into database: {}", comment)

        val sqlStatement =
            "INSERT INTO comments (actor, record_id, question_id, comment, team, function_id) VALUES (?, ?, ?, ?, ?, ?) returning *"

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
                if (comment.team != null) {
                    val statement = conn.prepareStatement(
                        "DELETE FROM comments WHERE question_id = ? AND team = ?"
                    )
                    statement.setString(1, comment.questionId)
                    statement.setString(2, comment.team)
                    statement.executeUpdate()
                } else if (comment.functionId != null) {
                    val statement = conn.prepareStatement(
                        "DELETE FROM comments WHERE question_id = ? AND function_id = ?"
                    )
                    statement.setString(1, comment.questionId)
                    statement.setInt(2, comment.functionId)
                    statement.executeUpdate()
                } else {
                    throw RuntimeException("Error deleting comment from database")
                }
            }
        } catch (e: SQLException) {
            logger.error("Error deleting comment from database ${e.message}")
            throw RuntimeException("Error deleting comment from database", e)
        }
        logger.info("Successfully deleted comment from database: {}", comment)
    }
}