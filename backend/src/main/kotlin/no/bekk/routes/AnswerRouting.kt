package no.bekk.routes

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import no.bekk.authentication.hasContextAccess
import no.bekk.database.AnswerRepository
import no.bekk.database.DatabaseAnswer
import no.bekk.database.DatabaseAnswerRequest
import no.bekk.util.logger

fun Route.answerRouting() {
    val answerRepository = AnswerRepository()

    post("/answer") {
        val answerRequestJson = call.receiveText()
        logger.debug("Received POST /answer request with body: $answerRequestJson")
        val answerRequest = Json.decodeFromString<DatabaseAnswerRequest>(answerRequestJson)

        if (answerRequest.contextId == null) {
            call.respond(HttpStatusCode.BadRequest)
            return@post
        }

        if (!hasContextAccess(call, answerRequest.contextId)) {
            call.respond(HttpStatusCode.Forbidden)
            return@post
        }

        val insertedAnswer = answerRepository.insertAnswerOnContext(answerRequest)
        call.respond(HttpStatusCode.OK, Json.encodeToString(insertedAnswer))
    }

    get("/answers") {
        val recordId = call.request.queryParameters["recordId"]
        val tableId = call.request.queryParameters["tableId"]
        val contextId = call.request.queryParameters["contextId"]


        if (contextId == null || tableId == null) {
            call.respond(HttpStatusCode.BadRequest)
            return@get
        }

        if (!hasContextAccess(call, contextId)) {
            call.respond(HttpStatusCode.Forbidden)
            return@get
        }

        val answers: MutableList<DatabaseAnswer>
        if (recordId != null) {
            answers = answerRepository.getAnswersByContextAndRecordIdFromDatabase(contextId, tableId, recordId)
        } else {
            answers = answerRepository.getAnswersByContextIdFromDatabase(contextId, tableId)
        }

        val answersJson = Json.encodeToString(answers)
        call.respondText(answersJson, contentType = ContentType.Application.Json)
    }

}