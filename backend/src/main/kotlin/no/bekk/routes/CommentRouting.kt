package no.bekk.routes

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import no.bekk.authentication.hasTeamAccess
import no.bekk.database.DatabaseComment
import no.bekk.database.CommentRepository
import no.bekk.database.DatabaseCommentRequest
import no.bekk.util.logger

fun Route.commentRouting() {
    val commentRepository = CommentRepository()

    post("/comments") {
        val commentRequestJson = call.receiveText()
        logger.debug("Request body: $commentRequestJson")

        val databaseCommentRequest = Json.decodeFromString<DatabaseCommentRequest>(commentRequestJson)

        if(!hasTeamAccess(call, databaseCommentRequest.team)){
            logger.warn("Unauthorized access when attempting to add comment to database")
            call.respond(HttpStatusCode.Unauthorized)
        }

        val insertedComment = commentRepository.insertComment(databaseCommentRequest)
        call.respond(HttpStatusCode.OK, Json.encodeToString(insertedComment))
    }

    get("/comments/{teamId}") {
        val teamId = call.parameters["teamId"]
        if(!hasTeamAccess(call, teamId)){
            logger.warn("Unauthorized access when attempting to fetch comments for team: $teamId")
            call.respond(HttpStatusCode.Unauthorized)
        }

        val databaseComments: MutableList<DatabaseComment>
        if (teamId != null) {
            databaseComments = commentRepository.getCommentsByTeamIdFromDatabase(teamId)
            val commentsJson = Json.encodeToString(databaseComments)
            call.respondText(commentsJson, contentType = ContentType.Application.Json)
        } else {
            logger.warn("GET /comments request with missing teamId")
            call.respond(HttpStatusCode.BadRequest, "Team id not found")
        }
    }

    get("/comments/{teamId}/{recordId}") {
        val teamId = call.parameters["teamId"]
        val recordId = call.parameters["recordId"]
        if(!hasTeamAccess(call, teamId)){
            logger.warn("Unauthorized access when attempting to fetch comments for team: $teamId")
            call.respond(HttpStatusCode.Unauthorized)
        }

        val databaseComments: MutableList<DatabaseComment>
        if (teamId != null && recordId != null) {
            databaseComments = commentRepository.getCommentsByTeamAndRecordIdFromDatabase(teamId, recordId)
            val commentsJson = Json.encodeToString(databaseComments)
            call.respondText(commentsJson, contentType = ContentType.Application.Json)
        } else {
            logger.warn("GET /comments request with missing teamId or recordId")
            call.respond(HttpStatusCode.BadRequest, "Team id or record id not found")
        }
    }

    delete("/comments") {
        val commentRequestJson = call.receiveText()
        val databaseCommentRequest = Json.decodeFromString<DatabaseComment>(commentRequestJson)
        commentRepository.deleteCommentFromDatabase(databaseCommentRequest)
        call.respondText("Comment was successfully deleted.")
    }
}
