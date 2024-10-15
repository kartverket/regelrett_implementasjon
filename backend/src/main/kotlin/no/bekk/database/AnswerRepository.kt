package no.bekk.database


import no.bekk.configuration.getDatabaseConnection
import no.bekk.util.logger
import java.sql.Connection
import java.sql.SQLException
import java.sql.Types
import java.util.*

class AnswerRepository {
    fun getAnswersFromDatabase(): MutableList<DatabaseAnswer> {
        logger.debug("Fetching answers from database...")

        val connection = getDatabaseConnection()
        val answers = mutableListOf<DatabaseAnswer>()
        try {
            connection.use { conn ->
                val statement = conn.prepareStatement(
                    "SELECT id, actor, record_id, question, question_id, answer, updated, team, function_id, answer_type, answer_unit FROM answers order by updated"
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
                    var functionId: Int? = resultSet.getInt("function_id")
                    if (resultSet.wasNull()) {
                        functionId = null
                    }
                    answers.add(
                        DatabaseAnswer(
                            actor = actor,
                            recordId = recordId,
                            question = question,
                            questionId = questionId,
                            answer = answer,
                            updated = updated?.toString() ?: "",
                            team = team,
                            functionId = functionId,
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
                    "SELECT id, actor, record_id, question, question_id, answer, updated, team, function_id, answer_type, answer_unit FROM answers WHERE team = ? order by updated"
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
                    var functionId: Int? = resultSet.getInt("function_id")
                    if (resultSet.wasNull()) {
                        functionId = null
                    }
                    answers.add(
                        DatabaseAnswer(
                            actor = actor,
                            recordId = recordId,
                            question = question,
                            questionId = questionId,
                            answer = answer,
                            updated = updated?.toString() ?: "",
                            team = team,
                            functionId = functionId,
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

    fun getAnswersByFunctionIdFromDatabase(functionId: Int): MutableList<DatabaseAnswer> {
        logger.debug("Fetching answers from database for functionId: $functionId")

        val connection = getDatabaseConnection()
        val answers = mutableListOf<DatabaseAnswer>()
        try {
            connection.use { conn ->
                val statement = conn.prepareStatement(
                    "SELECT id, actor, record_id, question, question_id, answer, updated, team, function_id, answer_type, answer_unit FROM answers WHERE function_id = ? order by updated"
                )
                statement.setInt(1, functionId)
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
                    var functionId: Int? = resultSet.getInt("function_id")
                    if (resultSet.wasNull()) {
                        functionId = null
                    }
                    answers.add(
                        DatabaseAnswer(
                            actor = actor,
                            recordId = recordId,
                            question = question,
                            questionId = questionId,
                            answer = answer,
                            updated = updated?.toString() ?: "",
                            team = team,
                            functionId = functionId,
                            answerType = answerType,
                            answerUnit = answerUnit
                        )
                    )
                }
                logger.info("Successfully fetched function $functionId 's answers from database.")
            }
        } catch (e: SQLException) {
            logger.error("Error fetching answers from database for functionId: $functionId. ${e.message}", e)
            throw RuntimeException("Error fetching answers from database", e)
        }
        return answers
    }

    fun getAnswersByContextIdFromDatabase(contextId: String): MutableList<DatabaseAnswer> {
        logger.debug("Fetching answers from database for contextId: $contextId")

        val connection = getDatabaseConnection()
        val answers = mutableListOf<DatabaseAnswer>()
        try {
            connection.use { conn ->
                val statement = conn.prepareStatement(
                    "SELECT id, actor, record_id, question, question_id, answer, updated, answer_type, answer_unit FROM answers WHERE context_id = ? order by updated"
                )
                statement.setObject(1, UUID.fromString(contextId))
                val resultSet = statement.executeQuery()
                while (resultSet.next()) {
                    val actor = resultSet.getString("actor")
                    val recordId = resultSet.getString("record_id")
                    val question = resultSet.getString("question")
                    val questionId = resultSet.getString("question_id")
                    val answer = resultSet.getString("answer")
                    val updated = resultSet.getObject("updated", java.time.LocalDateTime::class.java)
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

    fun getAnswersByTeamAndRecordIdFromDatabase(teamId: String, recordId: String): MutableList<DatabaseAnswer> {
        logger.debug("Fetching answers from database for teamId: $teamId with recordId: $recordId")

        val connection = getDatabaseConnection()
        val answers = mutableListOf<DatabaseAnswer>()
        try {
            connection.use { conn ->
                val statement = conn.prepareStatement(
                    "SELECT id, actor, record_id, question, question_id, answer, updated, team, function_id, answer_type, answer_unit FROM answers WHERE team = ? AND record_id = ? order by updated"
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
                    var functionId: Int? = resultSet.getInt("function_id")
                    if (resultSet.wasNull()) {
                        functionId = null
                    }
                    answers.add(
                        DatabaseAnswer(
                            actor = actor,
                            recordId = recordId,
                            question = question,
                            questionId = questionId,
                            answer = answer,
                            updated = updated.toString(),
                            team = team,
                            functionId = functionId,
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

    fun getAnswersByFunctionAndRecordIdFromDatabase(functionId: Int, recordId: String): MutableList<DatabaseAnswer> {
        logger.debug("Fetching answers from database for functionId: $functionId with recordId: $recordId")

        val connection = getDatabaseConnection()
        val answers = mutableListOf<DatabaseAnswer>()
        try {
            connection.use { conn ->
                val statement = conn.prepareStatement(
                    "SELECT id, actor, record_id, question, question_id, answer, updated, team, function_id, answer_type, answer_unit FROM answers WHERE function_id = ? AND record_id = ? order by updated"
                )
                statement.setInt(1, functionId)
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
                    var functionId: Int? = resultSet.getInt("function_id")
                    if (resultSet.wasNull()) {
                        functionId = null
                    }
                    answers.add(
                        DatabaseAnswer(
                            actor = actor,
                            recordId = recordId,
                            question = question,
                            questionId = questionId,
                            answer = answer,
                            updated = updated.toString(),
                            team = team,
                            functionId = functionId,
                            answerType = answerType,
                            answerUnit = answerUnit
                        )
                    )
                }
                logger.info("Successfully fetched function $functionId 's answers with record id $recordId from database.")
            }
        } catch (e: SQLException) {
            logger.error("Error fetching answers from database for functionId: $functionId with recordId $recordId. ${e.message}", e)
            throw RuntimeException("Error fetching answers from database", e)
        }
        return answers
    }

    fun getAnswersByContextAndRecordIdFromDatabase(contextId: String, recordId: String): MutableList<DatabaseAnswer> {
        logger.debug("Fetching answers from database for contextId: $contextId with recordId: $recordId")

        val connection = getDatabaseConnection()
        val answers = mutableListOf<DatabaseAnswer>()
        try {
            connection.use { conn ->
                val statement = conn.prepareStatement(
                    "SELECT id, actor, question, question_id, answer, updated, answer_type, answer_unit FROM answers WHERE context_id = ? AND record_id = ? order by updated"
                )
                statement.setObject(1, UUID.fromString(contextId))
                statement.setString(2, recordId)
                val resultSet = statement.executeQuery()
                while (resultSet.next()) {
                    val actor = resultSet.getString("actor")
                    val questionId = resultSet.getString("question_id")
                    val question = resultSet.getString("question")
                    val answer = resultSet.getString("answer")
                    val updated = resultSet.getObject("updated", java.time.LocalDateTime::class.java)
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
                            answerType = answerType,
                            answerUnit = answerUnit,
                            contextId = contextId
                        )
                    )
                }
                logger.info("Successfully fetched context's $contextId answers with record id $recordId from database.")
            }
        } catch (e: SQLException) {
            logger.error("Error fetching answers from database for contextId: $contextId with recordId $recordId. ${e.message}", e)
            throw RuntimeException("Error fetching answers from database", e)
        }
        return answers
    }


    fun insertAnswerOnTeam(answer: DatabaseAnswerRequest): DatabaseAnswer {
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

    fun insertAnswerOnFunction(answer: DatabaseAnswerRequest): DatabaseAnswer {
        require(answer.functionId != null) {
            "You have to supply a functionId"
        }

        logger.debug("Inserting answer into database: {}", answer)
        val connection = getDatabaseConnection()
        try {
            connection.use { conn ->
                val result = conn.prepareStatement(
                    "SELECT question_id, function_id FROM answers WHERE question_id = ? AND function_id = ?"
                )

                result.setString(1, answer.questionId)
                result.setInt(2, answer.functionId)

                return insertAnswerRow(conn, answer)
            }
        } catch (e: SQLException) {
            logger.error("Error inserting answer row into database: ${e.message}")
            throw RuntimeException("Error fetching answers from database", e)
        }
    }

    fun insertAnswerOnContext(answer: DatabaseAnswerRequest): DatabaseAnswer {
        require(answer.contextId != null) {
            "You have to supply a contextId"
        }

        logger.debug("Inserting answer into database: {}", answer)
        val connection = getDatabaseConnection()
        try {
            connection.use { conn ->
                val result = conn.prepareStatement(
                    "SELECT question_id, context_id FROM answers WHERE question_id = ? AND context_id = ?"
                )

                result.setString(1, answer.questionId)
                result.setObject(2, UUID.fromString(answer.contextId))

                return insertAnswerRow(conn, answer)
            }
        } catch (e: SQLException) {
            logger.error("Error inserting answer row into database: ${e.message}")
            throw RuntimeException("Error fetching answers from database", e)
        }
    }

    private fun insertAnswerRow(conn: Connection, answer: DatabaseAnswerRequest): DatabaseAnswer {
        val sqlStatement =
            "INSERT INTO answers (actor, record_id, question, question_id, answer, team, function_id, answer_type, answer_unit, context_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) returning *"

        conn.prepareStatement(sqlStatement).use { statement ->
            statement.setString(1, answer.actor)
            statement.setString(2, answer.recordId)
            statement.setString(3, answer.question)
            statement.setString(4, answer.questionId)
            statement.setString(5, answer.answer)
            statement.setString(6, answer.team)
            if (answer.functionId != null) {
                statement.setInt(7, answer.functionId)
            } else {
                statement.setNull(7, Types.INTEGER)
            }
            statement.setString(8, answer.answerType)
            statement.setString(9, answer.answerUnit)
            statement.setObject(10, UUID.fromString(answer.contextId))
            val result = statement.executeQuery()
            if (result.next()) {
                var functionId: Int? = result.getInt("function_id")
                if (result.wasNull()) {
                    functionId = null
                }
                return DatabaseAnswer(
                    actor = result.getString("actor"),
                    recordId = result.getString("record_id"),
                    questionId = result.getString("question_id"),
                    question = result.getString("question"),
                    answer = result.getString("answer"),
                    updated = result.getObject("updated", java.time.LocalDateTime::class.java).toString(),
                    team = result.getString("team"),
                    functionId = functionId,
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
