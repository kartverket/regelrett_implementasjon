package no.bekk.routes

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.plugins.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import no.bekk.authentication.hasContextAccess
import no.bekk.database.DatabaseComment
import no.bekk.database.CommentRepository
import no.bekk.database.ContextRepository
import no.bekk.database.DatabaseCommentRequest
import no.bekk.services.MicrosoftService
import no.bekk.util.logger

fun Route.commentRouting(microsoftService: MicrosoftService, commentRepository: CommentRepository, contextRepository: ContextRepository) {

    post("/comments") {
        val commentRequestJson = call.receiveText()
        logger.debug("Received POST /comments with request body: $commentRequestJson")

        val databaseCommentRequest = Json.decodeFromString<DatabaseCommentRequest>(commentRequestJson)

        if (databaseCommentRequest.contextId == null) {
            call.respond(HttpStatusCode.BadRequest)
            return@post
        }

        if (!hasContextAccess(call, databaseCommentRequest.contextId, microsoftService, contextRepository)) {
            call.respond(HttpStatusCode.Forbidden)
            return@post
        }

        val insertedComment = commentRepository.insertCommentOnContext(databaseCommentRequest)
        call.respond(HttpStatusCode.OK, Json.encodeToString(insertedComment))
    }

    get("/comments") {
        val recordId = call.request.queryParameters["recordId"]
        val contextId = call.request.queryParameters["contextId"]
        logger.debug("Received GET /comments with id: $contextId")

        if (contextId == null) {
            call.respond(HttpStatusCode.BadRequest)
            return@get
        }

        if (!hasContextAccess(call, contextId, microsoftService, contextRepository)) {
            call.respond(HttpStatusCode.Forbidden)
            return@get
        }

        val databaseComments: List<DatabaseComment>
        if (recordId != null) {
            databaseComments =
                commentRepository.getCommentsByContextAndRecordIdFromDatabase(contextId, recordId)
        } else {
            databaseComments = commentRepository.getCommentsByContextIdFromDatabase(contextId)
        }

        val commentsJson = Json.encodeToString(databaseComments)
        call.respondText(commentsJson, contentType = ContentType.Application.Json)
    }

    delete("/comments") {
        logger.debug("Received DELETE /comments with recordId: ${call.request.queryParameters["recordId"]} and contextId: ${call.request.queryParameters["contextId"]}")
        val contextId = call.request.queryParameters["contextId"] ?: throw BadRequestException("Missing contextId")
        val recordId = call.request.queryParameters["recordId"] ?: throw BadRequestException("Missing recordId")

        if (!hasContextAccess(call, contextId, microsoftService, contextRepository)) {
            call.respond(HttpStatusCode.Forbidden)
            return@delete
        }
        commentRepository.deleteCommentFromDatabase(contextId, recordId)
        call.respondText("Comment was successfully deleted.")
    }
}
