package no.bekk.database


import no.bekk.configuration.getDatabaseConnection
import no.bekk.util.logger
import java.sql.Connection
import java.sql.SQLException

class AnswerRepository {
    fun getAnswersFromDatabase(): MutableList<DatabaseAnswer> {
        logger.debug("Fetching answers from database...")

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
                            answer = answer,
                            updated = updated?.toString() ?: "",
                            team = team,
                        )
                    )
                }
            }

        } catch (e: SQLException) {
            logger.error("Error fetching answers from database: ${e.message}", e)
            throw RuntimeException("Error fetching answers from database", e)
        }
        logger.info("Successfully fetched ${answers.size} answers from database.")
        return answers
    }

    fun getAnswersByTeamIdFromDatabase(teamId: String): MutableList<DatabaseAnswer> {
        logger.debug("Fetching answers from database for teamId: $teamId")

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
                            answer = answer,
                            updated = updated?.toString() ?: "",
                            team = team,
                        )
                    )
                }
                logger.info("Successfully fetched team $teamId 's answers from database.")
            }
        } catch (e: SQLException) {
            logger.error("Error fetching answers from database for teamId: $teamId. ${e.message}", e)
            throw RuntimeException("Error fetching answers from database", e)
        }
        return answers
    }

    fun getAnswersByTeamAndQuestionIdFromDatabase(teamId: String, questionId: String): MutableList<DatabaseAnswer> {
        logger.debug("Fetching answers from database for teamId: $teamId with questionId: $questionId")

        val connection = getDatabaseConnection()
        val answers = mutableListOf<DatabaseAnswer>()
        try {
            connection.use { conn ->
                val statement = conn.prepareStatement(
                    "SELECT id, actor, question, question_id, answer, updated, team FROM answers WHERE team = ? AND question_id = ?"
                )
                statement.setString(1, teamId)
                statement.setString(2, questionId)
                val resultSet = statement.executeQuery()
                while (resultSet.next()) {
                    val actor = resultSet.getString("actor")
                    val question = resultSet.getString("question")
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
                logger.info("Successfully fetched team $teamId 's answers with question id $questionId from database.")
            }
        } catch (e: SQLException) {
            logger.error("Error fetching answers from database for teamId: $teamId with questionId $questionId. ${e.message}", e)
            throw RuntimeException("Error fetching answers from database", e)
        }
        return answers
    }


    fun insertAnswer(answer: DatabaseAnswer): DatabaseAnswer {
        logger.debug("Inserting answer into database: {}", answer)

        val connection = getDatabaseConnection()
        try {
            connection.use { conn ->

                val result = conn.prepareStatement(
                    "SELECT question_id, team FROM answers WHERE question_id = ? AND team = ? "
                )

                result.setString(1, answer.questionId)
                result.setString(2, answer.team)

                return insertAnswerRow(conn, answer)
            }

        } catch (e: SQLException) {
            logger.error("Error inserting answer row into database: ${e.message}")
            throw RuntimeException("Error fetching answers from database", e)
        }
    }

    private fun insertAnswerRow(conn: Connection, answer: DatabaseAnswer): DatabaseAnswer {
        val sqlStatement =
            "INSERT INTO answers (actor, question, question_id, answer, team) VALUES (?, ?, ?, ?, ?) returning *"

        conn.prepareStatement(sqlStatement).use { statement ->
            statement.setString(1, answer.actor)
            statement.setString(2, answer.question)
            statement.setString(3, answer.questionId)
            statement.setString(4, answer.answer)
            statement.setString(5, answer.team)
            val result = statement.executeQuery()
            if (result.next()) {
                return DatabaseAnswer(
                    actor = result.getString("actor"),
                    questionId = result.getString("question_id"),
                    question = result.getString("question"),
                    answer = result.getString("answer"),
                    updated = result.getObject("updated", java.time.LocalDateTime::class.java).toString(),
                    team = result.getString("team")
                )
            } else {
                throw RuntimeException("Error inserting comments from database")
            }
        }
    }
}
