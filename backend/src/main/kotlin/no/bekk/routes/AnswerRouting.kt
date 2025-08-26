package no.bekk.routes

import io.ktor.http.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.SerializationException
import kotlinx.serialization.json.Json
import no.bekk.database.AnswerRepository
import no.bekk.database.DatabaseAnswer
import no.bekk.database.DatabaseAnswerRequest
import no.bekk.authentication.AuthService
import no.bekk.util.*

fun Route.answerRouting(authService: AuthService, answerRepository: AnswerRepository) {

    post("/answer") {
        safeExecute(call, logger, "Failed to create answer") {
            val answerRequestJson = call.receiveText()
            logger.info("Received POST /answer request")

            val answerRequest = try {
                Json.decodeFromString<DatabaseAnswerRequest>(answerRequestJson)
            } catch (e: SerializationException) {
                throw ValidationException("Invalid answer request format", e)
            }

            val contextId = validateRequired(answerRequest.contextId, "contextId")

            validateAccess(
                authService.hasContextAccess(call, contextId),
                "context $contextId",
                "create answer in"
            )

            val insertedAnswer = logDatabaseOperation("insert_answer") {
                answerRepository.insertAnswerOnContext(answerRequest)
            }
            
            logger.info("Answer created successfully for context $contextId")
            call.respond(HttpStatusCode.OK, Json.encodeToString(insertedAnswer))
        }
    }

    get("/answers") {
        safeExecute(call, logger, "Failed to get answers") {
            val recordId = call.request.queryParameters["recordId"]
            val contextId = validateRequired(call.request.queryParameters["contextId"], "contextId")
            logger.info("Received GET /answers with contextId: $contextId${recordId?.let { " and recordId: $it" } ?: ""}")

            validateAccess(
                authService.hasContextAccess(call, contextId),
                "context $contextId",
                "view answers for"
            )

            val answers: List<DatabaseAnswer> = if (recordId != null) {
                logDatabaseOperation("get_answers_by_context_and_record") {
                    answerRepository.getAnswersByContextAndRecordIdFromDatabase(contextId, recordId)
                }
            } else {
                logDatabaseOperation("get_latest_answers_by_context") {
                    answerRepository.getLatestAnswersByContextIdFromDatabase(contextId)
                }
            }

            val answersJson = Json.encodeToString(answers)
            call.respondText(answersJson, contentType = ContentType.Application.Json)
        }
    }
}
