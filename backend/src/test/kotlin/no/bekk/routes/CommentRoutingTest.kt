package no.bekk.routes

import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.testing.*
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import no.bekk.MockAuthService
import no.bekk.TestUtils.generateTestToken
import no.bekk.TestUtils.testModule
import no.bekk.database.DatabaseComment
import no.bekk.database.DatabaseCommentRequest
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test

class CommentRoutingTest {
    @Test
    fun `add comment`() = testApplication {
        application {
            testModule(
                commentRepository = object : MockCommentRepository {
                    override fun insertCommentOnContext(comment: DatabaseCommentRequest): DatabaseComment {
                        return DatabaseComment(
                            actor = "actor",
                            recordId = "recordId",
                            questionId = "questionId",
                            comment = "comment",
                            updated = "updated",
                            contextId = "contextId",
                        )
                    }
                },
                authService = object : MockAuthService {
                    override suspend fun hasContextAccess(call: ApplicationCall, contextId: String): Boolean {
                        return true
                    }
                }
            )
        }
        val request = DatabaseCommentRequest(
            actor = "actor",
            recordId = "recordId",
            questionId = "questionId",
            comment = "comment",
            contextId = "contextId",
        )

        val response = client.post("/comments") {
            header(HttpHeaders.Authorization, "Bearer ${generateTestToken()}")
            contentType(ContentType.Application.Json)
            setBody(Json.encodeToString(request))
        }

        assertEquals(HttpStatusCode.OK, response.status)
        val addedComment: DatabaseComment = Json.decodeFromString(response.bodyAsText())
        assertEquals(request.actor, addedComment.actor)
        assertEquals(request.recordId, addedComment.recordId)
        assertEquals(request.questionId, addedComment.questionId)
        assertEquals(request.comment, addedComment.comment)
        assertEquals(request.contextId, addedComment.contextId)
    }

    @Test
    fun `add comment with contextId null returns BadRequest`() = testApplication {
        application {
            testModule()
        }
        val request = DatabaseCommentRequest(
            actor = "actor",
            recordId = "recordId",
            questionId = "questionId",
            comment = "comment",
            contextId = null,
        )

        val response = client.post("/comments") {
            header(HttpHeaders.Authorization, "Bearer ${generateTestToken()}")
            contentType(ContentType.Application.Json)
            setBody(Json.encodeToString(request))
        }

        assertEquals(HttpStatusCode.BadRequest, response.status)
    }

    @Test
    fun `add comment without access returns Forbidden`() = testApplication {
        application {
            testModule(
                authService = object : MockAuthService {
                    override suspend fun hasContextAccess(call: ApplicationCall, contextId: String): Boolean {
                        return false
                    }
                }
            )
        }
        val request = DatabaseCommentRequest(
            actor = "actor",
            recordId = "recordId",
            questionId = "questionId",
            comment = "comment",
            contextId = "contextId",
        )

        val response = client.post("/comments") {
            header(HttpHeaders.Authorization, "Bearer ${generateTestToken()}")
            contentType(ContentType.Application.Json)
            setBody(Json.encodeToString(request))
        }

        assertEquals(HttpStatusCode.Forbidden, response.status)
    }

    @Test
    fun `get comment by recordId and contextId`() = testApplication {
        val mockedComment = DatabaseComment(
            actor = "actor",
            recordId = "recordId",
            questionId = "questionId",
            comment = "comment",
            updated = "updated",
            contextId = "contextId",
        )

        application {
            testModule(
                commentRepository = object : MockCommentRepository {
                    override fun getCommentsByContextAndRecordIdFromDatabase(
                        contextId: String,
                        recordId: String
                    ): List<DatabaseComment> {
                        return listOf(mockedComment)
                    }
                },
                authService = object : MockAuthService {
                    override suspend fun hasContextAccess(call: ApplicationCall, contextId: String): Boolean {
                        return true
                    }
                }
            )
        }

        val response = client.get("/comments?recordId=${mockedComment.recordId}&contextId=${mockedComment.contextId}") {
            header(HttpHeaders.Authorization, "Bearer ${generateTestToken()}")
        }

        assertEquals(HttpStatusCode.OK, response.status)
        val fetchedCommentList: List<DatabaseComment> = Json.decodeFromString(response.bodyAsText())
        assertEquals(1, fetchedCommentList.size)
        assertEquals(mockedComment, fetchedCommentList.first())
    }

    @Test
    fun `get comment by contextId`() = testApplication {
        val mockedComment = DatabaseComment(
            actor = "actor",
            recordId = "recordId",
            questionId = "questionId",
            comment = "comment",
            updated = "updated",
            contextId = "contextId",
        )

        application {
            testModule(
                commentRepository = object : MockCommentRepository {
                    override fun getCommentsByContextIdFromDatabase(
                        contextId: String,
                    ): List<DatabaseComment> {
                        return listOf(mockedComment)
                    }
                },
                authService = object : MockAuthService {
                    override suspend fun hasContextAccess(call: ApplicationCall, contextId: String): Boolean {
                        return true
                    }
                }
            )
        }

        val response = client.get("/comments?contextId=${mockedComment.contextId}") {
            header(HttpHeaders.Authorization, "Bearer ${generateTestToken()}")
        }

        assertEquals(HttpStatusCode.OK, response.status)
        val fetchedCommentList: List<DatabaseComment> = Json.decodeFromString(response.bodyAsText())
        assertEquals(1, fetchedCommentList.size)
        assertEquals(mockedComment, fetchedCommentList.first())
    }

    @Test
    fun `get comment with contextId null returns BadRequest`() = testApplication {
        application {
            testModule()
        }

        val response = client.get("/comments") {
            header(HttpHeaders.Authorization, "Bearer ${generateTestToken()}")
        }
        assertEquals(HttpStatusCode.BadRequest, response.status)
    }

    @Test
    fun `get comment without access returns Forbidden`() = testApplication {
        application {
            testModule(
                authService = object : MockAuthService {
                    override suspend fun hasContextAccess(call: ApplicationCall, contextId: String): Boolean {
                        return false
                    }
                }
            )
        }

        val response = client.get("/comments?contextId=contextId") {
            header(HttpHeaders.Authorization, "Bearer ${generateTestToken()}")
        }

        assertEquals(HttpStatusCode.Forbidden, response.status)
    }

    @Test
    fun `delete comment`() = testApplication {
        var deletedContextId: String? = null
        application {
            testModule(
                commentRepository = object : MockCommentRepository {
                    override fun deleteCommentFromDatabase(contextId: String, recordId: String): Boolean {
                        deletedContextId = contextId
                        return true
                    }
                },
                authService = object : MockAuthService {
                    override suspend fun hasContextAccess(call: ApplicationCall, contextId: String): Boolean {
                        return true
                    }
                }
            )
        }

        val response = client.delete("/comments?contextId=1&recordId=2") {
            header(HttpHeaders.Authorization, "Bearer ${generateTestToken()}")
        }

        assertEquals(HttpStatusCode.OK, response.status)
        assertEquals("1", deletedContextId)
        assertEquals("Comment was successfully deleted.", response.bodyAsText())
    }

    @Test
    fun `delete comment missing contextId returns BadRequest`() = testApplication {
        application {
            testModule()
        }

        val response = client.delete("/comments?recordId=2") {
            header(HttpHeaders.Authorization, "Bearer ${generateTestToken()}")
        }
        assertEquals(HttpStatusCode.BadRequest, response.status)
    }

    @Test
    fun `delete comment missing recordId returns BadRequest`() = testApplication {
        application {
            testModule()
        }

        val response = client.delete("/comments?contextId=2") {
            header(HttpHeaders.Authorization, "Bearer ${generateTestToken()}")
        }
        assertEquals(HttpStatusCode.BadRequest, response.status)
    }

    @Test
    fun `delete comment without access returns Forbidden`() = testApplication {
        application {
            testModule(
                authService = object : MockAuthService {
                    override suspend fun hasContextAccess(call: ApplicationCall, contextId: String): Boolean {
                        return false
                    }
                }
            )
        }

        val response = client.delete("/comments?contextId=1&recordId=2") {
            header(HttpHeaders.Authorization, "Bearer ${generateTestToken()}")
        }
        assertEquals(HttpStatusCode.Forbidden, response.status)
    }
}