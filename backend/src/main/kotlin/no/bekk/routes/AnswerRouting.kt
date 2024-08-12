package no.bekk.routes

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import no.bekk.database.DatabaseAnswer
import no.bekk.database.DatabaseRepository
import java.sql.SQLException

fun Route.answerRouting() {
    val databaseRepository = DatabaseRepository()

    post("/answer") {
        val answerRequestJson = call.receiveText()
        val answerRequest = Json.decodeFromString<DatabaseAnswer>(answerRequestJson)
        val answer = DatabaseAnswer(
            question = answerRequest.question,
            questionId = answerRequest.questionId,
            Svar = answerRequest.Svar,
            actor = answerRequest.actor,
            updated = "",
            team = answerRequest.team,
        )
        databaseRepository.getAnswerFromDatabase(answer)
        call.respondText("Answer was successfully submitted.")
    }

    get("/answers") {
        try {
            val answers = databaseRepository.getAnswersFromDatabase()
            val answersJson = Json.encodeToString(answers)
            call.respondText(answersJson, contentType = ContentType.Application.Json)
        } catch (e: SQLException) {
            e.printStackTrace()
            call.respond(HttpStatusCode.InternalServerError, "Error fetching answers")
        }
    }

    get("/answers/{teamId}") {
        val teamId = call.parameters["teamId"]
        if (teamId != null) {
            val answers = databaseRepository.getAnswersByTeamIdFromDatabase(teamId)
            val answersJson = Json.encodeToString(answers)
            call.respondText(answersJson, contentType = ContentType.Application.Json)
        } else {
            call.respond(HttpStatusCode.BadRequest, "Team id not found")
        }
    }
}