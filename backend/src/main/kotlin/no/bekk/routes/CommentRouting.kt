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
import no.bekk.database.DatabaseRepository

fun Route.commentRouting() {
    val databaseRepository = DatabaseRepository()

    post("/comments") {
        val commentRequestJson = call.receiveText()
        val databaseCommentRequest = Json.decodeFromString<DatabaseComment>(commentRequestJson)

        if(!hasTeamAccess(call, databaseCommentRequest.team)){
            call.respond(HttpStatusCode.Unauthorized)
        }

        val databaseComment = DatabaseComment(
            questionId = databaseCommentRequest.questionId,
            comment = databaseCommentRequest.comment,
            team = databaseCommentRequest.team,
            updated = "",
            actor = databaseCommentRequest.actor,
        )
        databaseRepository.getCommentFromDatabase(databaseComment)
        call.respondText("Comment was successfully submitted.")
    }

    get("/comments/{teamId}") {
        val teamId = call.parameters["teamId"]
        if(!hasTeamAccess(call, teamId)){
            call.respond(HttpStatusCode.Unauthorized)
        }

        val databaseComments: MutableList<DatabaseComment>
        if (teamId != null) {
            databaseComments = databaseRepository.getCommentsByTeamIdFromDatabase(teamId)
            val commentsJson = Json.encodeToString(databaseComments)
            call.respondText(commentsJson, contentType = ContentType.Application.Json)
        } else {
            call.respond(HttpStatusCode.BadRequest, "Team id not found")
        }
    }

    delete("/comments") {
        val commentRequestJson = call.receiveText()
        val databaseCommentRequest = Json.decodeFromString<DatabaseComment>(commentRequestJson)
        databaseRepository.deleteCommentFromDatabase(databaseCommentRequest)
        call.respondText("Comment was successfully deleted.")
    }
}
