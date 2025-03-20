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
import no.bekk.services.MicrosoftService
import no.bekk.util.logger

fun Route.answerRouting(microsoftService: MicrosoftService, answerRepository: AnswerRepository) {

    post("/answer") {
        val answerRequestJson = call.receiveText()
        logger.debug("Received POST /answer request with body: $answerRequestJson")
        val answerRequest = Json.decodeFromString<DatabaseAnswerRequest>(answerRequestJson)

        if (answerRequest.contextId == null) {
            call.respond(HttpStatusCode.BadRequest)
            return@post
        }

        if (!hasContextAccess(call, answerRequest.contextId, microsoftService)) {
            call.respond(HttpStatusCode.Forbidden)
            return@post
        }

        val insertedAnswer = answerRepository.insertAnswerOnContext(answerRequest)
        call.respond(HttpStatusCode.OK, Json.encodeToString(insertedAnswer))
    }

    get("/answers") {
        val recordId = call.request.queryParameters["recordId"]
        val contextId = call.request.queryParameters["contextId"]
        logger.debug("Received GET /answers with contextId: $contextId and recordId: $recordId")

        if (contextId == null) {
            call.respond(HttpStatusCode.BadRequest)
            return@get
        }

        if (!hasContextAccess(call, contextId, microsoftService)) {
            call.respond(HttpStatusCode.Forbidden)
            return@get
        }

        val answers: MutableList<DatabaseAnswer>
        if (recordId != null) {
            answers = answerRepository.getAnswersByContextAndRecordIdFromDatabase(contextId, recordId)
        } else {
            answers = answerRepository.getAnswersByContextIdFromDatabase(contextId)
        }

        val answersJson = Json.encodeToString(answers)
        call.respondText(answersJson, contentType = ContentType.Application.Json)
    }

}