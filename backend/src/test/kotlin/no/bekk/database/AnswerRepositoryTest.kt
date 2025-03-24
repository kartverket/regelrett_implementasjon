package no.bekk.database

import no.bekk.TestDatabase
import no.bekk.configuration.Database
import no.bekk.configuration.JDBCDatabase
import org.junit.jupiter.api.AfterAll
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.Test

class AnswerRepositoryTest {
    @Test
    fun `insert and get answers by contextId`() {
        val (answerRepository, _, context) = defaultSetup()

        val insertedAnswer = answerRepository.insertAnswerOnContext(
            DatabaseAnswerRequest(
                actor = "actor",
                recordId = "recordId",
                questionId = "questionId",
                answer = "answer",
                answerType = "answerType",
                contextId = context.id
            )
        )

        val fetchedAnswers = answerRepository.getAnswersByContextIdFromDatabase(context.id)
        assertEquals(1, fetchedAnswers.size)
        assertEquals(insertedAnswer, fetchedAnswers.first())
    }

    @Test
    fun `insert and get answers by contextId and recordId`() {
        val (answerRepository, _, context) = defaultSetup()

        val insertedAnswer = answerRepository.insertAnswerOnContext(
            DatabaseAnswerRequest(
                actor = "actor",
                recordId = "recordId",
                questionId = "questionId",
                answer = "answer",
                answerType = "answerType",
                contextId = context.id
            )
        )

        val fetchedAnswers =
            answerRepository.getAnswersByContextAndRecordIdFromDatabase(context.id, insertedAnswer.recordId)
        assertEquals(1, fetchedAnswers.size)
        assertEquals(insertedAnswer, fetchedAnswers.first())
    }

    @Test
    fun `copy answers from other context`() {
        val (answerRepository, contextRepository, sourceContext) = defaultSetup()

        val destinationContext = contextRepository.insertContext(DatabaseContextRequest("teamId2", "formId2", "name2"))

        answerRepository.insertAnswerOnContext(
            DatabaseAnswerRequest(
                actor = "actor",
                recordId = "recordId",
                questionId = "questionId",
                answer = "answer",
                answerType = "answerType",
                contextId = sourceContext.id
            )
        )

        answerRepository.copyAnswersFromOtherContext(destinationContext.id, sourceContext.id)

        val destinationContextAnswers = answerRepository.getAnswersByContextIdFromDatabase(destinationContext.id)
        assertEquals(1, destinationContextAnswers.size)
    }

    private fun defaultSetup(
        teamId: String = "teamId",
        formId: String = "formId",
        name: String = "name"
    ): Triple<AnswerRepositoryImpl, ContextRepository, DatabaseContext> {
        val contextRepository = ContextRepositoryImpl(database)
        val answerRepository = AnswerRepositoryImpl(database)

        val context = contextRepository.insertContext(DatabaseContextRequest(teamId, formId, name))
        return Triple(answerRepository, contextRepository, context)
    }

    @AfterEach
    fun cleanup() {
        database.getConnection().use { connection ->
            connection.createStatement().use { statement ->
                statement.executeUpdate("DELETE FROM answers")
                statement.executeUpdate("DELETE FROM contexts")
            }
        }
    }

    companion object {

        private lateinit var testDatabase: TestDatabase
        private lateinit var database: Database

        @JvmStatic
        @BeforeAll
        fun setup() {
            testDatabase = TestDatabase()
            database = JDBCDatabase.create(testDatabase.getTestdatabaseConfig())
        }

        @JvmStatic
        @AfterAll
        fun stopDatabase() {
            testDatabase.stopTestDatabase()
        }
    }
}