package no.bekk.plugins

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.Serializable
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.JsonElement
import kotlinx.serialization.json.encodeToJsonElement
import no.bekk.AirTableController
import no.bekk.database.DatabaseRepository
import java.sql.SQLException

val airTableController = AirTableController()
val databaseRepository = DatabaseRepository()

fun Application.configureRouting() {

    @Serializable
    data class CombinedData(
        val metodeverkData: JsonElement,
        val metaData: JsonElement
    )

    routing {
        get("/") {
            call.respondText("Velkommen til Kartverket Kontrollere!")
        }
    }
    routing {
        get("/metodeverk") {
            val data = airTableController.fetchDataFromMetodeverk()
            val meta = airTableController.fetchDataFromMetadata()
            val metodeverkData = Json.encodeToJsonElement(data)
            val metaData = Json.encodeToJsonElement(meta)
            val combinedData = CombinedData(metodeverkData, metaData)
            val combinedJson = Json.encodeToString(combinedData)
            call.respondText(combinedJson, contentType = ContentType.Application.Json)
        }
    }

    routing {
        get("/alle") {
            val data = airTableController.fetchDataFromAlle()
            call.respondText(data.records.toString())
        }

    }

    routing {
        get("/{teamid}/kontrollere") {
            val teamid = call.parameters["teamid"]

            if (teamid != null) {
                val data = airTableController.fetchDataFromMetodeverk()
                val meta = airTableController.fetchDataFromMetadata()
                val metodeverkData = Json.encodeToJsonElement(data)
                val metaData = Json.encodeToJsonElement(meta)
                val combinedData = CombinedData(metodeverkData, metaData)
                val combinedJson = Json.encodeToString(combinedData)
                call.respondText(combinedJson, contentType = ContentType.Application.Json)
            } else {
                call.respond(HttpStatusCode.BadRequest, "Id not found")
            }
        }
    }


    routing {
        get("/answers") {
            var answers = mutableListOf<Answer>()
            try {
                answers = databaseRepository.getAnswersFromDatabase()
                val answersJson = Json.encodeToString(answers)
                call.respondText(answersJson, contentType = ContentType.Application.Json)
            } catch (e: SQLException) {
                e.printStackTrace()
                call.respond(HttpStatusCode.InternalServerError, "Error fetching answers")
            }
        }
    }

    routing {
        get("/answers/{teamId}") {
            val teamId = call.parameters["teamId"]
            var answers = mutableListOf<Answer>()
            if (teamId != null) {
                answers = databaseRepository.getAnswersByTeamIdFromDatabase(teamId)
                val answersJson = Json.encodeToString(answers)
                call.respondText(answersJson, contentType = ContentType.Application.Json)
            } else {
                call.respond(HttpStatusCode.BadRequest, "Team id not found")
            }
        }
    }



    routing {
        post("/answer") {
            val answerRequestJson = call.receiveText()
            val answerRequest = Json.decodeFromString<Answer>(answerRequestJson)
            val answer = Answer(
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
    }

}


@Serializable
data class Answer(val actor: String, val questionId: String, val question: String, val Svar: String, val updated: String, val team: String?)