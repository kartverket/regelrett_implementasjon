package no.bekk.database


import no.bekk.configuration.Database
import no.bekk.util.logger
import java.sql.SQLException
import java.util.*

object AnswerRepository {

    fun getAnswersByContextIdFromDatabase(contextId: String): MutableList<DatabaseAnswer> {
        logger.debug("Fetching answers from database for contextId: $contextId")

        val answers = mutableListOf<DatabaseAnswer>()
        try {
            Database.getConnection().use { conn ->
                val statement = conn.prepareStatement(
                    "SELECT id, actor, record_id, question_id, answer, updated, answer_type, answer_unit FROM answers WHERE context_id = ? order by updated"
                )
                statement.setObject(1, UUID.fromString(contextId))
                val resultSet = statement.executeQuery()
                while (resultSet.next()) {
                    val actor = resultSet.getString("actor")
                    val recordId = resultSet.getString("record_id")
                    val questionId = resultSet.getString("question_id")
                    val answer = resultSet.getString("answer")
                    val updated = resultSet.getObject("updated", java.time.LocalDateTime::class.java)
                    val answerType = resultSet.getString("answer_type")
                    val answerUnit = resultSet.getString("answer_unit")

                    answers.add(
                        DatabaseAnswer(
                            actor = actor,
                            recordId = recordId,
                            questionId = questionId,
                            answer = answer,
                            updated = updated?.toString() ?: "",
                            answerType = answerType,
                            answerUnit = answerUnit,
                            contextId = contextId
                        )
                    )
                }
                logger.info("Successfully fetched context's $contextId answers from database.")
            }
        } catch (e: SQLException) {
            logger.error("Error fetching answers from database for contextId: $contextId. ${e.message}", e)
            throw RuntimeException("Error fetching answers from database", e)
        }
        return answers
    }

    fun getAnswersByContextAndRecordIdFromDatabase(contextId: String, recordId: String): MutableList<DatabaseAnswer> {
        logger.debug("Fetching answers from database for contextId: $contextId with recordId: $recordId")

        val answers = mutableListOf<DatabaseAnswer>()
        try {
            Database.getConnection().use { conn ->
                val statement = conn.prepareStatement(
                    "SELECT id, actor, question_id, answer, updated, answer_type, answer_unit FROM answers WHERE context_id = ? AND record_id = ? order by updated"
                )
                statement.setObject(1, UUID.fromString(contextId))
                statement.setString(2, recordId)
                val resultSet = statement.executeQuery()
                while (resultSet.next()) {
                    val actor = resultSet.getString("actor")
                    val questionId = resultSet.getString("question_id")
                    val answer = resultSet.getString("answer")
                    val updated = resultSet.getObject("updated", java.time.LocalDateTime::class.java)
                    val answerType = resultSet.getString("answer_type")
                    val answerUnit = resultSet.getString("answer_unit")

                    answers.add(
                        DatabaseAnswer(
                            actor = actor,
                            recordId = recordId,
                            questionId = questionId,
                            answer = answer,
                            updated = updated.toString(),
                            answerType = answerType,
                            answerUnit = answerUnit,
                            contextId = contextId
                        )
                    )
                }
                logger.info("Successfully fetched context's $contextId answers with record id $recordId from database.")
            }
        } catch (e: SQLException) {
            logger.error(
                "Error fetching answers from database for contextId: $contextId with recordId $recordId. ${e.message}",
                e
            )
            throw RuntimeException("Error fetching answers from database", e)
        }
        return answers
    }


    fun insertAnswerOnContext(answer: DatabaseAnswerRequest): DatabaseAnswer {
        require(answer.contextId != null) {
            "You have to supply a contextId"
        }

        logger.debug("Inserting answer into database: {}", answer)
        try {
            return insertAnswerRow(answer)
        } catch (e: SQLException) {
            logger.error("Error inserting answer row into database: ${e.message}")
            throw RuntimeException("Error fetching answers from database", e)
        }
    }

    private fun insertAnswerRow(answer: DatabaseAnswerRequest): DatabaseAnswer {
        require(answer.contextId != null) {
            "You have to supply a contextId"
        }
        val sqlStatement =
            "INSERT INTO answers (actor, record_id, question_id, answer, answer_type, answer_unit, context_id) VALUES (?, ?, ?, ?, ?, ?, ?) returning *"

        Database.getConnection().use { conn ->
            conn.prepareStatement(sqlStatement).use { statement ->
                statement.setString(1, answer.actor)
                statement.setString(2, answer.recordId)
                statement.setString(3, answer.questionId)
                statement.setString(4, answer.answer)
                statement.setString(5, answer.answerType)
                statement.setString(6, answer.answerUnit)
                statement.setObject(7, UUID.fromString(answer.contextId))

                val result = statement.executeQuery()
                if (result.next()) {
                    return DatabaseAnswer(
                        actor = result.getString("actor"),
                        recordId = result.getString("record_id"),
                        questionId = result.getString("question_id"),
                        answer = result.getString("answer"),
                        updated = result.getObject("updated", java.time.LocalDateTime::class.java).toString(),
                        answerType = result.getString("answer_type"),
                        answerUnit = result.getString("answer_unit"),
                        contextId = result.getString("context_id")
                    )
                } else {
                    throw RuntimeException("Error inserting comments from database")
                }
            }
        }
    }
}
