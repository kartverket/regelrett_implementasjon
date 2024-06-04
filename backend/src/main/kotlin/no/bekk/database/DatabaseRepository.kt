package no.bekk.database


import no.bekk.configuration.getDatabaseConnection
import java.sql.Connection
import java.sql.SQLException
import no.bekk.plugins.Answer
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
                    "SELECT id, actor, question, question_id, answer, updated, team FROM questions"
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
                            answer = answer,
                            updated = updated?.toString() ?: "",
                            team = team
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
                    "SELECT id, actor, question, question_id, answer, updated, team FROM questions WHERE team = ?"
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
                            answer = answer,
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
                    "SELECT question_id FROM questions WHERE question_id = ? AND team = ? "
                )

                result.setString(1, answer.questionId)
                result.setString(2, answer.team)
                val resultSet = result.executeQuery()

                if (resultSet.next()) {
                    updateRow(conn, answer)
                } else {
                    insertRow(conn, answer)
                }

            }

        } catch (e: SQLException) {
            e.printStackTrace()
        }
    }

    private fun insertRow(conn: Connection, answer: Answer): Int {
        val sqlStatement =
            "INSERT INTO questions (actor, question, question_id, answer, team) VALUES (?, ?, ?, ?, ?)"

        conn.prepareStatement(sqlStatement).use { statement ->
            statement.setString(1, answer.actor)
            statement.setString(2, answer.question)
            statement.setString(3, answer.questionId)
            statement.setString(4, answer.answer)
            statement.setString(5, answer.team)
            return statement.executeUpdate()
        }
    }

    private fun updateRow(conn: Connection, answer: Answer): Int {
        val sqlStatement =
            "UPDATE questions SET actor = ?, question = ?, question_id = ?, answer = ?, team = ?, updated = CURRENT_TIMESTAMP WHERE question_id = ?"

        conn.prepareStatement(sqlStatement).use { statement ->
            statement.setString(1, answer.actor)
            statement.setString(2, answer.question)
            statement.setString(3, answer.questionId)
            statement.setString(4, answer.answer)
            statement.setString(5, answer.team)
            statement.setString(6, answer.questionId)

            return statement.executeUpdate()
        }
    }


}