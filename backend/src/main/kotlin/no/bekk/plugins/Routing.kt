package no.bekk.plugins

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.sessions.*
import kotlinx.serialization.Serializable
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.JsonElement
import kotlinx.serialization.json.encodeToJsonElement
import no.bekk.services.AirTableService
import no.bekk.authentication.UserSession
import no.bekk.database.DatabaseRepository
import no.bekk.routes.questionRouting
import no.bekk.routes.tableRouting
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
        questionRouting()
        tableRouting()

        get("/") {
            call.respondText("Velkommen til Kartverket Kontrollere!")
        }

        get("/health") {
            call.respondText("Health OK", ContentType.Text.Plain)
        }

        get("/auth-status"){
            val userSession: UserSession? = call.sessions.get<UserSession>()
            if (userSession != null){
                call.respond(HttpStatusCode.OK, mapOf("authenticated" to true))
            } else {
                call.respond(HttpStatusCode.Unauthorized, mapOf("authenticated" to false))
            }

        }

        authenticate ( "auth-oauth-azure" ) {
            get("/login") {
                call.respondText("Login endpoint")
            }

            get("/callback") {
                val currentPrincipal: OAuthAccessTokenResponse.OAuth2? = call.principal()

                // redirects home if the url is not found before authorization
                currentPrincipal?.let { principal ->
                    principal.state?.let { state ->
                        call.sessions.set(UserSession(state, principal.accessToken))
                        val redirects = mutableMapOf<String, String>()
                        redirects[state]?.let { redirect ->
                            call.respondRedirect(redirect)
                            return@get
                        }
                    }
                }
                call.respondRedirect(System.getenv("AUTH_FALLBACK_REDIRECT_URL"))
            }
        }

        get("/metodeverk") {
            val userSession: UserSession? = call.sessions.get<UserSession>()
            if (userSession != null) {
                val data = airTableService.fetchDataFromMetodeverk()
                val meta = airTableService.fetchDataFromMetadata()
                val metodeverkData = Json.encodeToJsonElement(data)
                val metaData = Json.encodeToJsonElement(meta)
                val combinedData = CombinedData(metodeverkData, metaData)
                val combinedJson = Json.encodeToString(combinedData)
                call.respondText(combinedJson, contentType = ContentType.Application.Json)
            }
            call.respond(HttpStatusCode.Unauthorized)
        }

        get("/alle") {
            val userSession: UserSession? = call.sessions.get<UserSession>()
            if (userSession != null) {
                val data = airTableService.fetchDataFromAlle()
                call.respondText(data.records.toString())
            }

            call.respond(HttpStatusCode.Unauthorized)
        }

        get("/{teamid}/kontrollere") {
            val userSession: UserSession? = call.sessions.get<UserSession>()
            if (userSession != null) {
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

            call.respond(HttpStatusCode.Unauthorized)
        }

        get("/answers") {
            val userSession: UserSession? = call.sessions.get<UserSession>()
            if (userSession != null) {
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

            call.respond(HttpStatusCode.Unauthorized)
        }

        get("/answers/{teamId}") {
            val userSession: UserSession? = call.sessions.get<UserSession>()
            if (userSession != null) {
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

            call.respond(HttpStatusCode.Unauthorized)
        }

        post("/answer") {
            val userSession: UserSession? = call.sessions.get<UserSession>()
            if (userSession != null) {
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

            call.respond(HttpStatusCode.Unauthorized)
        }

        post("/comments") {
            val userSession: UserSession? = call.sessions.get<UserSession>()
            if (userSession != null) {
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

            call.respond(HttpStatusCode.Unauthorized)
        }

        get("/comments/{teamId}") {
            val userSession: UserSession? = call.sessions.get<UserSession>()
            if (userSession != null) {
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

            call.respond(HttpStatusCode.Unauthorized)
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