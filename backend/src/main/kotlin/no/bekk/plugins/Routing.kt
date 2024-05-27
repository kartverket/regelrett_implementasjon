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
import no.bekk.configuration.getDatabaseConnection
import java.sql.Connection
import java.sql.SQLException

val airTableController = AirTableController()

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
        get("/answers") {
            val answers = mutableListOf<Answer>()
            val connection = getDatabaseConnection()
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
            val answer = Answer(
                question = answerRequest.question,
                questionId = answerRequest.questionId,
                answer = answerRequest.answer,
                actor = answerRequest.actor
            )
            try {
                connection.use { conn ->

                    val result = conn.prepareStatement(
                        "SELECT question_id FROM questions WHERE question_id = ? "
                    )

                    result.setString(1, answer.questionId)
                    val resultSet = result.executeQuery()

                    if (resultSet.next()) {
                        updateRow(conn, answer)
                    } else {
                        removeRow(conn, answer)
                    }

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

private fun removeRow(conn: Connection, answer: Answer): Int {
    val statement = conn.prepareStatement(
        "INSERT INTO questions (actor, question, question_id, answer) VALUES (?, ?, ?, ?)"
    )
    statement.setString(1, answer.actor)
    statement.setString(2, answer.question)
    statement.setString(3, answer.questionId)
    statement.setString(4, answer.answer)

    return statement.executeUpdate()
}

private fun updateRow(conn: Connection, answer: Answer): Int {
    val statement = conn.prepareStatement(
        "UPDATE questions SET actor = ?, question = ?, question_id = ?, answer = ? WHERE question_id = ?"
    )
    statement.setString(1, answer.actor)
    statement.setString(2, answer.question)
    statement.setString(3, answer.questionId)
    statement.setString(4, answer.answer)
    statement.setString(5, answer.questionId)

    return statement.executeUpdate()
}

@Serializable
data class Answer(val actor: String, val questionId: String, val question: String, val answer: String)

