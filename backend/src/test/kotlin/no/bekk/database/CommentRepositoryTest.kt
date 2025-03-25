package no.bekk.database

import no.bekk.TestDatabase
import no.bekk.configuration.Database
import no.bekk.configuration.JDBCDatabase
import org.junit.jupiter.api.AfterAll
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.Test

class CommentRepositoryTest {
    @Test
    fun `insert and get comment by contextId`() {
        val (commentRepository, context) = defaultSetup()
        val request = DatabaseCommentRequest(
            actor = "actor",
            recordId = "recordId",
            questionId = "questionId",
            comment = "comment",
            contextId = context.id
        )
        commentRepository.insertCommentOnContext(request)

        val fetchedComments = commentRepository.getCommentsByContextIdFromDatabase(context.id)
        assertEquals(1, fetchedComments.size)
        assertEquals(request.actor, fetchedComments.first().actor)
        assertEquals(request.recordId, fetchedComments.first().recordId)
        assertEquals(request.questionId, fetchedComments.first().questionId)
        assertEquals(request.comment, fetchedComments.first().comment)
        assertEquals(request.contextId, fetchedComments.first().contextId)
    }

    @Test
    fun `insert and get comment by contextId and recordId`() {
        val (commentRepository, context) = defaultSetup()

        val request = DatabaseCommentRequest(
            actor = "actor",
            recordId = "recordId",
            questionId = "questionId",
            comment = "comment",
            contextId = context.id
        )
        commentRepository.insertCommentOnContext(request)

        val fetchedComments =
            commentRepository.getCommentsByContextAndRecordIdFromDatabase(context.id, request.recordId)
        assertEquals(1, fetchedComments.size)
        assertEquals(request.actor, fetchedComments.first().actor)
        assertEquals(request.recordId, fetchedComments.first().recordId)
        assertEquals(request.questionId, fetchedComments.first().questionId)
        assertEquals(request.comment, fetchedComments.first().comment)
        assertEquals(request.contextId, fetchedComments.first().contextId)
    }

    @Test
    fun `insert and delete comment`() {
        val (commentRepository, context) = defaultSetup()

        val insertedComment = commentRepository.insertCommentOnContext(
            DatabaseCommentRequest(
                actor = "actor",
                recordId = "recordId",
                questionId = "questionId",
                comment = "comment",
                contextId = context.id
            )
        )
        assertTrue(commentRepository.deleteCommentFromDatabase(context.id, insertedComment.recordId))
        assertTrue(commentRepository.getCommentsByContextIdFromDatabase(context.id).isEmpty())
    }

    private fun defaultSetup(
        teamId: String = "teamId",
        formId: String = "formId",
        name: String = "name"
    ): Pair<CommentRepositoryImpl, DatabaseContext> {
        val contextRepository = ContextRepositoryImpl(database)
        val commentRepository = CommentRepositoryImpl(database)

        val context = contextRepository.insertContext(DatabaseContextRequest(teamId, formId, name))
        return Pair(commentRepository, context)
    }

    @AfterEach
    fun cleanup() {
        database.getConnection().use { connection ->
            connection.createStatement().use { statement ->
                statement.executeUpdate("DELETE FROM comments")
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