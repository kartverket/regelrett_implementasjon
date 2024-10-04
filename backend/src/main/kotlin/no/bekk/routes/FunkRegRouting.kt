package no.bekk.routes

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.routing.*
import io.ktor.server.response.*
import io.ktor.server.sessions.*
import no.bekk.authentication.UserSession
import no.bekk.services.MicrosoftService
import no.bekk.util.logger

fun Route.funkRegRouting() {

    authenticate("auth-jwt") {

        get("/funkReg/metadata") {
            val call = call

            try {
                val userSession: UserSession? = call.sessions.get<UserSession>()
                if (userSession == null) {
                    logger.warn("User session not found")
                    call.respond(HttpStatusCode.Unauthorized, "User not authenticated")
                    return@get
                }

                val teamId = call.request.queryParameters["team_id"]

                if (teamId.isNullOrBlank()) {
                    logger.warn("Missing 'team_id' query parameters")
                    call.respond(
                        HttpStatusCode.BadRequest,
                        mapOf("error" to "Missing 'team_id' query parameters")
                    )
                    return@get
                }

                val microsoftService = MicrosoftService()
                val accessTokenForFunkReg = microsoftService.requestFRISKTokenOnBehalfOf(userSession)
                val funkRegResource = microsoftService.fetchFunkRegMetadata(accessTokenForFunkReg, teamId)

                call.respond(HttpStatusCode.OK, funkRegResource)
            } catch (ex: Exception) {
                logger.error("Failed to retrieve resource from FunkReg: ${ex.message}")
                call.respond(
                    HttpStatusCode.InternalServerError,
                    mapOf("error" to "Failed to retrieve resource from FunkReg")
                )
            }
        }

        get("/funkReg/functions/{id}") {
            val call = call

            try {
                val userSession: UserSession? = call.sessions.get<UserSession>()
                if (userSession == null) {
                    logger.warn("User session not found")
                    call.respond(HttpStatusCode.Unauthorized, "User not authenticated")
                    return@get
                }

                val id = call.parameters["id"]?.toIntOrNull() ?: run {
                    logger.warn("Missing 'team_id' query parameters")
                    call.respond(
                        HttpStatusCode.BadRequest,
                        mapOf("error" to "Missing 'team_id' query parameters")
                    )
                    return@get

                }

                val microsoftService = MicrosoftService()
                val accessTokenForFunkReg = microsoftService.requestFRISKTokenOnBehalfOf(userSession)
                val funkRegResource = microsoftService.fetchFunkRegFunction(accessTokenForFunkReg, id)

                call.respond(HttpStatusCode.OK, funkRegResource)
            } catch (ex: Exception) {
                logger.error("Failed to retrieve resource from FunkReg: ${ex.message}")
                call.respond(
                    HttpStatusCode.InternalServerError,
                    mapOf("error" to "Failed to retrieve resource from FunkReg")
                )
            }


        }
    }
}
