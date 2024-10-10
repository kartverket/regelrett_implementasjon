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
                    "SELECT id, actor, record_id, question, question_id, answer, updated, team, answer_type, answer_unit FROM answers order by updated"
                )
                val resultSet = statement.executeQuery()
                while (resultSet.next()) {
                    val actor = resultSet.getString("actor")
                    val recordId = resultSet.getString("record_id")
                    val question = resultSet.getString("question")
                    val questionId = resultSet.getString("question_id")
                    val answer = resultSet.getString("answer")
                    val updated = resultSet.getObject("updated", java.time.LocalDateTime::class.java)
                    val team = resultSet.getString("team")
                    val answerType = resultSet.getString("answer_type")
                    val answerUnit = resultSet.getString("answer_unit")
                    answers.add(
                        DatabaseAnswer(
                            actor = actor,
                            recordId = recordId,
                            question = question,
                            questionId = questionId,
                            answer = answer,
                            updated = updated?.toString() ?: "",
                            team = team,
                            answerType = answerType,
                            answerUnit = answerUnit,
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
                    "SELECT id, actor, record_id, question, question_id, answer, updated, team, answer_type, answer_unit FROM answers WHERE team = ? order by updated"
                )
                statement.setString(1, teamId)
                val resultSet = statement.executeQuery()
                while (resultSet.next()) {
                    val actor = resultSet.getString("actor")
                    val recordId = resultSet.getString("record_id")
                    val question = resultSet.getString("question")
                    val questionId = resultSet.getString("question_id")
                    val answer = resultSet.getString("answer")
                    val updated = resultSet.getObject("updated", java.time.LocalDateTime::class.java)
                    val team = resultSet.getString("team")
                    val answerType = resultSet.getString("answer_type")
                    val answerUnit = resultSet.getString("answer_unit")
                    answers.add(
                        DatabaseAnswer(
                            actor = actor,
                            recordId = recordId,
                            question = question,
                            questionId = questionId,
                            answer = answer,
                            updated = updated?.toString() ?: "",
                            team = team,
                            answerType = answerType,
                            answerUnit = answerUnit
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

    fun getAnswersByTeamAndRecordIdFromDatabase(teamId: String, recordId: String): MutableList<DatabaseAnswer> {
        logger.debug("Fetching answers from database for teamId: $teamId with recordId: $recordId")

        val connection = getDatabaseConnection()
        val answers = mutableListOf<DatabaseAnswer>()
        try {
            connection.use { conn ->
                val statement = conn.prepareStatement(
                    "SELECT id, actor, record_id, question, question_id, answer, updated, team, answer_type, answer_unit FROM answers WHERE team = ? AND record_id = ? order by updated"
                )
                statement.setString(1, teamId)
                statement.setString(2, recordId)
                val resultSet = statement.executeQuery()
                while (resultSet.next()) {
                    val actor = resultSet.getString("actor")
                    val questionId = resultSet.getString("question_id")
                    val question = resultSet.getString("question")
                    val answer = resultSet.getString("answer")
                    val updated = resultSet.getObject("updated", java.time.LocalDateTime::class.java)
                    val team = resultSet.getString("team")
                    val answerType = resultSet.getString("answer_type")
                    val answerUnit = resultSet.getString("answer_unit")
                    answers.add(
                        DatabaseAnswer(
                            actor = actor,
                            recordId = recordId,
                            question = question,
                            questionId = questionId,
                            answer = answer,
                            updated = updated.toString(),
                            team = team,
                            answerType = answerType,
                            answerUnit = answerUnit
                        )
                    )
                }
                logger.info("Successfully fetched team $teamId 's answers with record id $recordId from database.")
            }
        } catch (e: SQLException) {
            logger.error("Error fetching answers from database for teamId: $teamId with recordId $recordId. ${e.message}", e)
            throw RuntimeException("Error fetching answers from database", e)
        }
        return answers
    }


    fun insertAnswer(answer: DatabaseAnswerRequest): DatabaseAnswer {
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

    private fun insertAnswerRow(conn: Connection, answer: DatabaseAnswerRequest): DatabaseAnswer {
        val sqlStatement =
            "INSERT INTO answers (actor, record_id, question, question_id, answer, team, answer_type, answer_unit) VALUES (?, ?, ?, ?, ?, ?, ?, ?) returning *"

        conn.prepareStatement(sqlStatement).use { statement ->
            statement.setString(1, answer.actor)
            statement.setString(2, answer.recordId)
            statement.setString(3, answer.question)
            statement.setString(4, answer.questionId)
            statement.setString(5, answer.answer)
            statement.setString(6, answer.team)
            statement.setString(7, answer.answerType)
            statement.setString(8, answer.answerUnit)
            val result = statement.executeQuery()
            if (result.next()) {
                return DatabaseAnswer(
                    actor = result.getString("actor"),
                    recordId = result.getString("record_id"),
                    questionId = result.getString("question_id"),
                    question = result.getString("question"),
                    answer = result.getString("answer"),
                    updated = result.getObject("updated", java.time.LocalDateTime::class.java).toString(),
                    team = result.getString("team"),
                    answerType = result.getString("answer_type"),
                    answerUnit = result.getString("answer_unit")
                )
            } else {
                throw RuntimeException("Error inserting comments from database")
            }
        }
    }
}
