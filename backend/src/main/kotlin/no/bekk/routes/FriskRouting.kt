package no.bekk.routes

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.sessions.*
import no.bekk.authentication.UserSession
import no.bekk.services.FriskService


fun Route.friskRouting() {
    val friskService = FriskService()

    route("/frisk") {
        get("/metadata") {
            val userSession = call.sessions.get<UserSession>() ?: throw IllegalStateException("No Session")
            val teamId = call.request.queryParameters["teamId"] ?: return@get call.respond(HttpStatusCode.BadRequest)

            val metadata = friskService.fetchMetadataByTeamId(userSession, teamId)
            call.respond(metadata)
        }

        get("/functions/{id}") {
            val userSession = call.sessions.get<UserSession>() ?: throw IllegalStateException("No Session")
            val id = call.parameters["id"]?.toIntOrNull() ?: return@get call.respond(HttpStatusCode.BadRequest)

            val function = friskService.fetchFunctionByFunctionId(userSession, id)
            call.respond(function)
        }
    }
}