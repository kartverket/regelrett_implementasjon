package no.bekk.routes

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.plugins.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import no.bekk.database.ContextRepository
import no.bekk.database.DatabaseContext
import no.bekk.database.DatabaseContextRequest
import no.bekk.util.logger

fun Route.contextRouting() {
    val contextRepository = ContextRepository()
    route("/contexts") {
        post {
            val contextRequestJson = call.receiveText()
            logger.debug("Received POST /context request with body: $contextRequestJson")
            val contextRequest = Json.decodeFromString<DatabaseContextRequest>(contextRequestJson)

            val insertedContext: DatabaseContext
            insertedContext = contextRepository.insertContext(contextRequest)
            call.respond(HttpStatusCode.Created, Json.encodeToString(insertedContext))
        }
    }

    route("/teams/{teamId}/contexts") {
        get {
            val teamId = call.parameters["teamId"] ?: throw BadRequestException("Missing teamId parameter")
            val contexts = contextRepository.getContextsByTeamId(teamId)

            if (contexts.isNotEmpty()) {
                call.respond(HttpStatusCode.OK, Json.encodeToString(contexts))
            } else {
                call.respond(HttpStatusCode.NotFound, "No contexts found for teamId: $teamId")
            }
        }
    }
}