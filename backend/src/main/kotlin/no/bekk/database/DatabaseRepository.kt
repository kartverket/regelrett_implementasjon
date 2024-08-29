package no.bekk.database


import no.bekk.configuration.getDatabaseConnection
import org.jetbrains.exposed.sql.Table
import java.sql.Connection
import java.sql.SQLException

class DatabaseRepository {
    object Users : Table() {
        val id = integer("id").autoIncrement()
        val name = varchar("name", length = 50)
        val email = varchar("email", length = 100)

        override val primaryKey = PrimaryKey(id)
    }

    fun getAnswersFromDatabase(): MutableList<DatabaseAnswer> {
        val connection = getDatabaseConnection()
        val answers = mutableListOf<DatabaseAnswer>()
        try {
            connection.use { conn ->
                val statement = conn.prepareStatement(
                    "SELECT id, actor, question, question_id, answer, updated, team FROM answers"
                )
                val resultSet = statement.executeQuery()
                while (resultSet.next()) {
                    val actor = resultSet.getString("actor")
                    val question = resultSet.getString("question")
                    val questionId = resultSet.getString("question_id")
                    val answer = resultSet.getString("answer")
                    val updated = resultSet.getObject("updated", java.time.LocalDateTime::class.java)
                    val team = resultSet.getString("team")
                    answers.add(
                        DatabaseAnswer(
                            actor = actor,
                            question = question,
                            questionId = questionId,
                            Svar = answer,
                            updated = updated?.toString() ?: "",
                            team = team,
                        )
                    )
                }
            }
        } catch (e: SQLException) {
            e.printStackTrace()
            throw RuntimeException("Error fetching answers from database", e)
        }
        return answers
    }

    fun getAnswersByTeamIdFromDatabase(teamId: String): MutableList<DatabaseAnswer> {
        val connection = getDatabaseConnection()
        val answers = mutableListOf<DatabaseAnswer>()
        try {
            connection.use { conn ->
                val statement = conn.prepareStatement(
                    "SELECT id, actor, question, question_id, answer, updated, team FROM answers WHERE team = ?"
                )
                statement.setString(1, teamId)
                val resultSet = statement.executeQuery()
                while (resultSet.next()) {
                    val actor = resultSet.getString("actor")
                    val question = resultSet.getString("question")
                    val questionId = resultSet.getString("question_id")
                    val answer = resultSet.getString("answer")
                    val updated = resultSet.getObject("updated", java.time.LocalDateTime::class.java)
                    val team = resultSet.getString("team")
                    answers.add(
                        DatabaseAnswer(
                            actor = actor,
                            question = question,
                            questionId = questionId,
                            Svar = answer,
                            updated = updated?.toString() ?: "",
                            team = team,
                        )
                    )
                }
            }
        } catch (e: SQLException) {
            e.printStackTrace()
            throw RuntimeException("Error fetching answers from database", e)
        }
        return answers
    }


    fun getAnswerFromDatabase(answer: DatabaseAnswer) {
        val connection = getDatabaseConnection()
        try {
            connection.use { conn ->

                val result = conn.prepareStatement(
                    "SELECT question_id, team FROM answers WHERE question_id = ? AND team = ? "
                )

                result.setString(1, answer.questionId)
                result.setString(2, answer.team)
                val resultSet = result.executeQuery()

                if (resultSet.next()) insertAnswerRow(conn, answer)
            }

        } catch (e: SQLException) {
            e.printStackTrace()
        }
    }

    private fun insertAnswerRow(conn: Connection, answer: DatabaseAnswer): Int {
        val sqlStatement =
            "INSERT INTO answers (actor, question, question_id, answer, team) VALUES (?, ?, ?, ?, ?)"

        conn.prepareStatement(sqlStatement).use { statement ->
            statement.setString(1, answer.actor)
            statement.setString(2, answer.question)
            statement.setString(3, answer.questionId)
            statement.setString(4, answer.Svar)
            statement.setString(5, answer.team)
            return statement.executeUpdate()
        }
    }

    private fun updateAnswerRow(conn: Connection, answer: DatabaseAnswer): Int {
        val sqlStatement =
            "UPDATE answers SET actor = ?, question = ?, question_id = ?, answer = ?, team = ?, updated = CURRENT_TIMESTAMP WHERE question_id = ? AND team = ?"

        conn.prepareStatement(sqlStatement).use { statement ->
            statement.setString(1, answer.actor)
            statement.setString(2, answer.question)
            statement.setString(3, answer.questionId)
            statement.setString(4, answer.Svar)
            statement.setString(5, answer.team)
            statement.setString(6, answer.questionId)
            statement.setString(7, answer.team)


            return statement.executeUpdate()
        }
    }

    fun getCommentsByTeamIdFromDatabase(teamId: String): MutableList<DatabaseComment> {
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
            }
        } catch (e: SQLException) {
            e.printStackTrace()
            throw RuntimeException("Error fetching comments from database", e)
        }
        return comments
    }

    fun getCommentFromDatabase(comment: DatabaseComment) {
        val connection = getDatabaseConnection()
        try {
            connection.use { conn ->

                val result = conn.prepareStatement(
                    "SELECT question_id, team FROM comments WHERE question_id = ? AND team = ? "
                )

                result.setString(1, comment.questionId)
                result.setString(2, comment.team)
                val resultSet = result.executeQuery()

                if (resultSet.next()) insertCommentRow(conn, comment)
            }

        } catch (e: SQLException) {
            e.printStackTrace()
        }
    }

    private fun insertCommentRow(conn: Connection, comment: DatabaseComment): Int {
        val sqlStatement =
            "INSERT INTO comments (actor, question_id, comment, team) VALUES (?, ?, ?, ?)"

        conn.prepareStatement(sqlStatement).use { statement ->
            statement.setString(1, comment.actor)
            statement.setString(2, comment.questionId)
            statement.setString(3, comment.comment)
            statement.setString(4, comment.team)
            return statement.executeUpdate()
        }
    }

    private fun updateCommentRow(conn: Connection, comment: DatabaseComment): Int {
        val sqlStatement =
            "UPDATE comments SET actor = ?, question_id = ?, team = ?, comment = ?, updated = CURRENT_TIMESTAMP WHERE question_id = ? AND team = ?"

        conn.prepareStatement(sqlStatement).use { statement ->
            statement.setString(1, comment.actor)
            statement.setString(2, comment.questionId)
            statement.setString(3, comment.team)
            statement.setString(4, comment.comment)
            statement.setString(5, comment.questionId)
            statement.setString(6, comment.team)


            return statement.executeUpdate()
        }
    }

    fun deleteCommentFromDatabase(comment: DatabaseComment) {
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
            e.printStackTrace()
            throw RuntimeException("Error deleting comment from database", e)
        }
    }
}
