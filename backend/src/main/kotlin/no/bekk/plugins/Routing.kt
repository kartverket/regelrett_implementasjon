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

val slaController = AirTableController()

fun Application.configureRouting() {

    val config = ConfigFactory.load()

    @Serializable
    data class CombinedData(
        val metodeverkData: JsonElement,
        val metaData: JsonElement
    )

    fun getDatabaseConnection(): Connection {
        val url = "jdbc:postgresql://localhost:5432/kontrollere"
        val user = "hein"
        val password = "password"
        return DriverManager.getConnection(url, user, password)
    }

    routing {
        get("/") {
            call.respondText("Velkommen til Kartverket Kontrollere!")
        }
    }
    routing {
        get("/metodeverk") {
            val data = slaController.fetchDataFromMetodeverk()
            val meta = slaController.fetchDataFromMetadata()
            val metodeverkData = Json.encodeToJsonElement(data)
            val metaData = Json.encodeToJsonElement(meta)
            val combinedData = CombinedData(metodeverkData, metaData)
            val combinedJson = Json.encodeToString(combinedData)
            call.respondText(combinedJson, contentType = ContentType.Application.Json)
        }

    }

    routing {
        get("/alle") {
            val data = slaController.fetchDataFromAlle()
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
                        val id = resultSet.getInt("id")
                        val actor = resultSet.getString("actor")
                        val question = resultSet.getString("question")
                        val answer = resultSet.getString("answer")
                        answers.add(Answer(id, actor, question, answer))
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
            val answer = call.receiveText()
            println(answer)
            call.respondText { answer }
        }
    }

}

data class Answer(val id: Int, val actor: String, val question: String, val answer: String)

