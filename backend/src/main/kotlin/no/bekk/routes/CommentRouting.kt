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
import no.bekk.util.logger

fun Route.commentRouting() {
    val commentRepository = CommentRepository()

    post("/comments") {
        val commentRequestJson = call.receiveText()
        logger.debug("Request body: $commentRequestJson")

        val databaseCommentRequest = Json.decodeFromString<DatabaseComment>(commentRequestJson)

        if(!hasTeamAccess(call, databaseCommentRequest.team)){
            logger.warn("Unauthorized access when attempting to add comment to database")
            call.respond(HttpStatusCode.Unauthorized)
        }

        val databaseComment = DatabaseComment(
            questionId = databaseCommentRequest.questionId,
            comment = databaseCommentRequest.comment,
            team = databaseCommentRequest.team,
            updated = "",
            actor = databaseCommentRequest.actor,
        )
        val insertedComment = commentRepository.insertComment(databaseComment)
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

    get("/comments/{teamId}/{questionId}") {
        val teamId = call.parameters["teamId"]
        val questionId = call.parameters["questionId"]
        if(!hasTeamAccess(call, teamId)){
            logger.warn("Unauthorized access when attempting to fetch comments for team: $teamId")
            call.respond(HttpStatusCode.Unauthorized)
        }

        val databaseComments: MutableList<DatabaseComment>
        if (teamId != null && questionId != null) {
            databaseComments = databaseRepository.getCommentsByTeamAndQuestionIdFromDatabase(teamId, questionId)
            val commentsJson = Json.encodeToString(databaseComments)
            call.respondText(commentsJson, contentType = ContentType.Application.Json)
        } else {
            logger.warn("GET /comments request with missing teamId or questionId")
            call.respond(HttpStatusCode.BadRequest, "Team id or question id not found")
        }
    }

    delete("/comments") {
        val commentRequestJson = call.receiveText()
        val databaseCommentRequest = Json.decodeFromString<DatabaseComment>(commentRequestJson)
        commentRepository.deleteCommentFromDatabase(databaseCommentRequest)
        call.respondText("Comment was successfully deleted.")
    }
}
