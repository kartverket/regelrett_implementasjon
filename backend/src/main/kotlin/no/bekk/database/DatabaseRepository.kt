package no.bekk.database


import no.bekk.configuration.getDatabaseConnection
import java.sql.Connection
import java.sql.SQLException
import no.bekk.plugins.Answer
import no.bekk.plugins.Comment
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.Table

class DatabaseRepository {
    fun connectToDatabase() {
        Database.connect(
            url = "jdbc:postgresql://localhost:5432/kontrollere",
            driver = "org.postgresql.Driver",
            user = "username",
            password = "password"
        )
    }

    object Users : Table() {
        val id = integer("id").autoIncrement()
        val name = varchar("name", length = 50)
        val email = varchar("email", length = 100)

        override val primaryKey = PrimaryKey(id)
    }

    fun getAnswersFromDatabase(): MutableList<Answer> {
        val connection = getDatabaseConnection()
        val answers = mutableListOf<Answer>()
        try {
            connection.use { conn ->
                val statement = conn.prepareStatement(
                    "SELECT id, actor, question, question_id, answer, updated, team, comment FROM questions"
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
                        Answer(
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

    fun getAnswersByTeamIdFromDatabase(teamId: String): MutableList<Answer> {
        val connection = getDatabaseConnection()
        val answers = mutableListOf<Answer>()
        try {
            connection.use { conn ->
                val statement = conn.prepareStatement(
                    "SELECT id, actor, question, question_id, answer, updated, team, comment FROM questions WHERE team = ?"
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
                        Answer(
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


    fun getAnswerFromDatabase(answer: Answer) {
        val connection = getDatabaseConnection()
        try {
            connection.use { conn ->

                val result = conn.prepareStatement(
                    "SELECT question_id, team FROM questions WHERE question_id = ? AND team = ? "
                )

                result.setString(1, answer.questionId)
                result.setString(2, answer.team)
                val resultSet = result.executeQuery()

                if (resultSet.next()) {
                    updateAnswerRow(conn, answer)
                } else {
                    insertAnswerRow(conn, answer)
                }

            }

        } catch (e: SQLException) {
            e.printStackTrace()
        }
    }

    private fun insertAnswerRow(conn: Connection, answer: Answer): Int {
        val sqlStatement =
            "INSERT INTO questions (actor, question, question_id, answer, team, comment) VALUES (?, ?, ?, ?, ?, ?)"

        conn.prepareStatement(sqlStatement).use { statement ->
            statement.setString(1, answer.actor)
            statement.setString(2, answer.question)
            statement.setString(3, answer.questionId)
            statement.setString(4, answer.Svar)
            statement.setString(5, answer.team)
            return statement.executeUpdate()
        }
    }

    private fun updateAnswerRow(conn: Connection, answer: Answer): Int {
        val sqlStatement =
            "UPDATE questions SET actor = ?, question = ?, question_id = ?, answer = ?, team = ?, updated = CURRENT_TIMESTAMP WHERE question_id = ? AND team = ?"

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

    fun getCommentFromDatabase(comment: Comment) {
        val connection = getDatabaseConnection()
        try {
            connection.use { conn ->

                val result = conn.prepareStatement(
                    "SELECT question_id, team FROM comments WHERE question_id = ? AND team = ? "
                )

                result.setString(1, comment.questionId)
                result.setString(2, comment.team)
                val resultSet = result.executeQuery()

                if (resultSet.next()) {
                    updateCommentRow(conn, comment)
                } else {
                    insertCommentRow(conn, comment)
                }

            }

        } catch (e: SQLException) {
            e.printStackTrace()
        }
    }

    private fun insertCommentRow(conn: Connection, comment: Comment): Int {
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

    private fun updateCommentRow(conn: Connection, comment: Comment): Int {
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
}