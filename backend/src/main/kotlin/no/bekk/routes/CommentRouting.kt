package no.bekk.routes

import io.ktor.http.*
import io.ktor.server.plugins.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.SerializationException
import kotlinx.serialization.json.Json
import no.bekk.authentication.AuthService
import no.bekk.database.CommentRepository
import no.bekk.database.DatabaseComment
import no.bekk.database.DatabaseCommentRequest
import no.bekk.util.*

fun Route.commentRouting(authService: AuthService, commentRepository: CommentRepository) {

    post("/comments") {
        safeExecute(call, logger, "Failed to create comment") {
            val commentRequestJson = call.receiveText()
            logger.info("Received POST /comments")

            val databaseCommentRequest = try {
                Json.decodeFromString<DatabaseCommentRequest>(commentRequestJson)
            } catch (e: SerializationException) {
                throw ValidationException("Invalid comment request format", e)
            }

            val contextId = validateRequired(databaseCommentRequest.contextId, "contextId")

            validateAccess(
                authService.hasContextAccess(call, contextId),
                "context $contextId",
                "create comment in"
            )

            val insertedComment = logDatabaseOperation("insert_comment") {
                commentRepository.insertCommentOnContext(databaseCommentRequest)
            }
            
            logger.info("Comment created successfully for context $contextId")
            call.respond(HttpStatusCode.OK, Json.encodeToString(insertedComment))
        }
    }

    get("/comments") {
        safeExecute(call, logger, "Failed to get comments") {
            val recordId = call.request.queryParameters["recordId"]
            val contextId = validateRequired(call.request.queryParameters["contextId"], "contextId")
            logger.info("Received GET /comments with contextId: $contextId${recordId?.let { " and recordId: $it" } ?: ""}")

            validateAccess(
                authService.hasContextAccess(call, contextId),
                "context $contextId",
                "view comments for"
            )

            val databaseComments: List<DatabaseComment> = if (recordId != null) {
                logDatabaseOperation("get_comments_by_context_and_record") {
                    commentRepository.getCommentsByContextAndRecordIdFromDatabase(contextId, recordId)
                }
            } else {
                logDatabaseOperation("get_comments_by_context") {
                    commentRepository.getCommentsByContextIdFromDatabase(contextId)
                }
            }

            val commentsJson = Json.encodeToString(databaseComments)
            call.respondText(commentsJson, contentType = ContentType.Application.Json)
        }
    }

    delete("/comments") {
        safeExecute(call, logger, "Failed to delete comment") {
            val contextId = validateRequired(call.request.queryParameters["contextId"], "contextId")
            val recordId = validateRequired(call.request.queryParameters["recordId"], "recordId")
            logger.info("Received DELETE /comments with recordId: $recordId and contextId: $contextId")

            validateAccess(
                authService.hasContextAccess(call, contextId),
                "context $contextId",
                "delete comment from"
            )
            
            logDatabaseOperation("delete_comment") {
                commentRepository.deleteCommentFromDatabase(contextId, recordId)
            }
            
            logger.info("Comment deleted successfully from context $contextId")
            call.respondText("Comment was successfully deleted.")
        }
    }
}
