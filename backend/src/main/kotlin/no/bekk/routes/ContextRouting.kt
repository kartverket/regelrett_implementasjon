package no.bekk.routes

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.plugins.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import no.bekk.authentication.hasContextAccess
import no.bekk.authentication.hasTeamAccess
import no.bekk.database.*
import no.bekk.util.logger

fun Route.contextRouting() {
    route("/contexts") {
        post {
            try {

                val contextRequestJson = call.receiveText()
                logger.debug("Received POST /context request with body: $contextRequestJson")
                val contextRequest = Json.decodeFromString<DatabaseContextRequest>(contextRequestJson)
                if (!hasTeamAccess(call, contextRequest.teamId)) {
                    call.respond(HttpStatusCode.Forbidden)
                    return@post
                }


                val insertedContext = ContextRepository.insertContext(contextRequest)

                if (contextRequest.copyContext != null) {
                    if (!hasContextAccess(call, contextRequest.copyContext)) {
                        call.respond(HttpStatusCode.Forbidden)
                        return@post
                    }
                    AnswerRepository.copyAnswersFromOtherContext(insertedContext.id, contextRequest.copyContext)
                }
                call.respond(HttpStatusCode.Created, Json.encodeToString(insertedContext))
                return@post
            } catch (e: UniqueConstraintViolationException) {
                logger.warn("Unique constraint violation: ${e.message}")
                call.respond(
                    HttpStatusCode.Conflict,
                    mapOf("error" to e.message)
                )
                return@post
            } catch (e: Exception) {
                logger.error("Unexpected error: ${e.message}")
                call.respond(
                    HttpStatusCode.InternalServerError,
                    mapOf("error" to "An unexpected error occurred.")
                )
                return@post
            }
        }

        get {
            val teamId = call.request.queryParameters["teamId"] ?: throw BadRequestException("Missing teamId parameter")
            val tableId = call.request.queryParameters["tableId"]
            if (!hasTeamAccess(call, teamId)) {
                call.respond(HttpStatusCode.Forbidden)
                return@get
            }

            if (tableId != null) {
                val context = ContextRepository.getContextByTeamIdAndTableId(teamId, tableId)
                call.respond(HttpStatusCode.OK, Json.encodeToString(context))
                return@get
            } else {
                val contexts = ContextRepository.getContextsByTeamId(teamId)
                call.respond(HttpStatusCode.OK, Json.encodeToString(contexts))
                return@get
            }

        }

        route("/{contextId}") {
            get {
                logger.debug("Received GET /context with id: ${call.parameters["contextId"]}")
                val contextId = call.parameters["contextId"] ?: throw BadRequestException("Missing contextId")

                if (!hasContextAccess(call, contextId)) {
                    call.respond(HttpStatusCode.Forbidden)
                    return@get
                }
                val context = ContextRepository.getContext(contextId)
                call.respond(HttpStatusCode.OK, Json.encodeToString(context))
                return@get
            }

            delete {
                logger.info("Received DELETE /context with id: ${call.parameters["contextId"]}")
                val contextId = call.parameters["contextId"] ?: throw BadRequestException("Missing contextId")
                if (!hasContextAccess(call, contextId)) {
                    call.respond(HttpStatusCode.Forbidden)
                    return@delete
                }
                ContextRepository.deleteContext(contextId)
                call.respondText("Context and its answers and comments were successfully deleted.")
            }
        }
    }
}