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
import no.bekk.services.AirTableService
import no.bekk.controllers.tableRouting
import no.bekk.database.DatabaseRepository
import java.sql.SQLException

val airTableService = AirTableService()
val databaseRepository = DatabaseRepository()

fun Application.configureRouting() {

    @Serializable
    data class CombinedData(
        val metodeverkData: JsonElement,
        val metaData: JsonElement
    )

    routing {
        tableRouting()
    }

    routing {
        get("/") {
            call.respondText("Velkommen til Kartverket Kontrollere!")
        }
    }

    routing {
        get("/health") {
            call.respondText("Health OK", ContentType.Text.Plain)
        }
    }

    routing {
        get("/metodeverk") {
            val data = airTableService.fetchDataFromMetodeverk()
            val meta = airTableService.fetchDataFromMetadata()
            val metodeverkData = Json.encodeToJsonElement(data)
            val metaData = Json.encodeToJsonElement(meta)
            val combinedData = CombinedData(metodeverkData, metaData)
            val combinedJson = Json.encodeToString(combinedData)
            call.respondText(combinedJson, contentType = ContentType.Application.Json)
        }
    }

    routing {
        get("/alle") {
            val data = airTableService.fetchDataFromAlle()
            call.respondText(data.records.toString())
        }
    }

    routing {
        get("/{teamid}/kontrollere") {
            val teamid = call.parameters["teamid"]
            if (teamid != null) {
                val data = airTableService.fetchDataFromMetodeverk()
                val meta = airTableService.fetchDataFromMetadata()
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
            var answers = mutableListOf<DatabaseAnswer>()
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
            var answers = mutableListOf<DatabaseAnswer>()
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
    }

    routing {
        post("/comments") {
            val commentRequestJson = call.receiveText()
            val databaseCommentRequest = Json.decodeFromString<DatabaseComment>(commentRequestJson)
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
    }

    routing {
        get("/comments/{teamId}") {
            val teamId = call.parameters["teamId"]
            val databaseComments: MutableList<DatabaseComment>
            if (teamId != null) {
                databaseComments = databaseRepository.getCommentsByTeamIdFromDatabase(teamId)
                val commentsJson = Json.encodeToString(databaseComments)
                call.respondText(commentsJson, contentType = ContentType.Application.Json)
            } else {
                call.respond(HttpStatusCode.BadRequest, "Team id not found")
            }
        }
    }

}

@Serializable
data class DatabaseAnswer(
    val actor: String,
    val questionId: String,
    val question: String,
    val Svar: String? = null,
    val updated: String,
    val team: String?
)

@Serializable
data class DatabaseComment(
    val actor: String,
    val questionId: String,
    val comment: String,
    val team: String?,
    val updated: String
)