package no.bekk.plugins

import com.typesafe.config.ConfigFactory
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.Serializable
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.encodeToJsonElement
import no.bekk.AirTableController
import kotlinx.serialization.json.JsonElement
import java.sql.DriverManager
import java.sql.SQLException
import java.sql.Connection

val airTableController = AirTableController()

fun Application.configureRouting() {

    val config = ConfigFactory.load()

    val databaseConfig = config.getConfig("ktor.database")
    val databaseUrl = databaseConfig.getString("url")
    val databaseUser = databaseConfig.getString("user")
    val databasePassword = databaseConfig.getString("password")

    @Serializable
    data class CombinedData(
        val metodeverkData: JsonElement,
        val metaData: JsonElement
    )

    fun getDatabaseConnection(): Connection {
        val url = databaseUrl
        val user = databaseUser
        val password = databasePassword
        return DriverManager.getConnection(url, user, password)
    }

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
        get("/answers") {
            val connection = getDatabaseConnection()
            val answers = mutableListOf<Answer>()
            try {
                connection.use { conn ->
                    val statement = conn.prepareStatement(
                        "SELECT id, actor, question, answer FROM questions"
                    )
                    val resultSet = statement.executeQuery()
                    while (resultSet.next()) {
                        val actor = resultSet.getString("actor")
                        val question = resultSet.getString("question")
                        val questionId = resultSet.getString("question_id")
                        val answer = resultSet.getString("answer")
                        answers.add(Answer(actor, question, questionId, answer))
                    }
                }
            } catch (e: SQLException) {
                e.printStackTrace()
                call.respond(HttpStatusCode.InternalServerError, "Error fetching answers")
                return@get
            }

            call.respondText(answers.toString())
        }
    }

    routing {
        post("/answer") {
            val answerRequestJson = call.receiveText()
            val answerRequest = Json.decodeFromString<Answer>(answerRequestJson)

            val connection = getDatabaseConnection()

            val answer = Answer(question = answerRequest.question, questionId = answerRequest.questionId, answer = answerRequest.answer, actor = answerRequest.actor)
            try {
                connection.use { conn ->
                    val statement = conn.prepareStatement(
                        "INSERT INTO questions (actor, question, question_id, answer) VALUES (?, ?, ?, ?)"
                    )
                    statement.setString(1, answer.actor)
                    statement.setString(2, answer.question)
                    statement.setString(3, answer.questionId)
                    statement.setString(4, answer.answer)

                    statement.executeUpdate()
                }
                call.respondText("Answer was successfully submitted.")
            } catch (e: SQLException) {
                e.printStackTrace()
                call.respond(HttpStatusCode.InternalServerError, "Error submitting answer")
                return@post
            }
        }
    }

}

@Serializable
data class Answer(val actor: String, val questionId: String, val question: String, val answer: String)

