package no.bekk.routes

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import no.bekk.authentication.hasFunctionAccess
import no.bekk.authentication.hasTeamAccess
import no.bekk.database.DatabaseComment
import no.bekk.database.CommentRepository
import no.bekk.database.DatabaseCommentRequest
import no.bekk.services.FriskService
import no.bekk.util.logger

fun Route.commentRouting() {
    val commentRepository = CommentRepository()
    val friskService = FriskService()

    post("/comments") {
        val commentRequestJson = call.receiveText()
        logger.debug("Request body: $commentRequestJson")

        val databaseCommentRequest = Json.decodeFromString<DatabaseCommentRequest>(commentRequestJson)

        if (databaseCommentRequest.team != null && databaseCommentRequest.functionId != null && databaseCommentRequest.contextId != null) {
            call.respond(HttpStatusCode.BadRequest)
            return@post
        }

        if (databaseCommentRequest.functionId != null) {
            if (!hasFunctionAccess(call, friskService, databaseCommentRequest.functionId)) {
                logger.warn("Unauthorized access when attempting to add comment to database")
                call.respond(HttpStatusCode.Forbidden)
                return@post
            }
        } else if (databaseCommentRequest.team != null) {
            if(!hasTeamAccess(call, databaseCommentRequest.team)){
                logger.warn("Unauthorized access when attempting to add comment to database")
                call.respond(HttpStatusCode.Forbidden)
                return@post
            }
        } else if (databaseCommentRequest.contextId == null) {
            call.respond(HttpStatusCode.BadRequest)
            return@post
        }

        val insertedComment: DatabaseComment
        if (databaseCommentRequest.functionId != null) {
            insertedComment = commentRepository.insertCommentOnFunction(databaseCommentRequest)
        } else if (databaseCommentRequest.team != null) {
            insertedComment = commentRepository.insertCommentOnTeam(databaseCommentRequest)
        } else {
            insertedComment = commentRepository.insertCommentOnContext(databaseCommentRequest)
        }
        call.respond(HttpStatusCode.OK, Json.encodeToString(insertedComment))
    }

    get("/comments") {
        val teamId = call.request.queryParameters["teamId"]
        val functionId = call.request.queryParameters["functionId"]?.toIntOrNull()
        val recordId = call.request.queryParameters["recordId"]
        val tableId = call.request.queryParameters["tableId"]
        val contextId = call.request.queryParameters["contextId"]

        if (teamId != null && functionId != null && contextId != null) {
            call.respond(HttpStatusCode.BadRequest)
            return@get
        }

        if (tableId == null) {
            call.respond(HttpStatusCode.BadRequest)
            return@get
        }

        if (functionId != null) {
            if (!hasFunctionAccess(call, friskService, functionId)) {
                logger.warn("Unauthorized access when attempting to fetch comments from database")
                call.respond(HttpStatusCode.Forbidden)
                return@get
            }
        } else if (teamId != null) {
            if(!hasTeamAccess(call, teamId)){
                logger.warn("Unauthorized access when attempting to fetch comments for team: $teamId")
                call.respond(HttpStatusCode.Unauthorized)
                return@get
            }
        }

        val databaseComments: MutableList<DatabaseComment>
        if (teamId != null) {
            if (recordId != null) {
                databaseComments = commentRepository.getCommentsByTeamAndRecordIdFromDatabase(teamId, tableId, recordId)
            } else {
                databaseComments = commentRepository.getCommentsByTeamIdFromDatabase(teamId, tableId)
            }
        } else if (functionId != null) {
            if (recordId != null) {
                databaseComments = commentRepository.getCommentsByFunctionAndRecordIdFromDatabase(functionId, tableId, recordId)
            } else {
                databaseComments = commentRepository.getCommentsByFunctionIdFromDatabase(functionId, tableId)
            }
        } else if (contextId != null) {
            if (recordId != null) {
                databaseComments = commentRepository.getCommentsByContextAndRecordIdFromDatabase(contextId, tableId, recordId)
            } else {
                databaseComments = commentRepository.getCommentsByContextIdFromDatabase(contextId, tableId)
            }
        } else {
            call.respond(HttpStatusCode.BadRequest)
            return@get
        }

        val commentsJson = Json.encodeToString(databaseComments)
        call.respondText(commentsJson, contentType = ContentType.Application.Json)
    }

    delete("/comments") {
        val commentRequestJson = call.receiveText()
        val databaseCommentRequest = Json.decodeFromString<DatabaseComment>(commentRequestJson)
        commentRepository.deleteCommentFromDatabase(databaseCommentRequest)
        call.respondText("Comment was successfully deleted.")
    }
}
