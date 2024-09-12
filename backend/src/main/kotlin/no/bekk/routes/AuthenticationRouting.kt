package no.bekk.routes

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.sessions.*
import no.bekk.authentication.UserSession
import no.bekk.configuration.AppConfig
import no.bekk.util.logger


fun Route.authenticationRouting() {

    get("/auth-status") {
        val userSession: UserSession? = call.sessions.get<UserSession>()
        logger.debug("User session: {}", userSession)
        if (userSession != null) {
            logger.debug("User is authenticated. Session: {}", userSession)
            call.respond(HttpStatusCode.OK, mapOf("authenticated" to true))
        } else {
            logger.debug("User is not authenticated")
            call.respond(HttpStatusCode.Unauthorized, mapOf("authenticated" to false))
        }
    }

    authenticate("auth-oauth-azure") {
        get("/login") {
            call.respondText("Login endpoint")
        }
        get("/callback") {
            val currentPrincipal: OAuthAccessTokenResponse.OAuth2? = call.principal()

            // redirects home if the url is not found before authorization
            currentPrincipal?.let { principal ->
                logger.debug("Received OAuth2 principal: {}", principal)
                principal.state?.let { state ->
                    logger.debug("Session set for user: {}", state)
                    logger.debug("Access token {}", principal.accessToken)
                    call.sessions.set(UserSession(state, principal.accessToken))
                    val redirects = mutableMapOf<String, String>()
                    redirects[state]?.let { redirect ->
                        logger.debug("Redirecting to: $redirect")
                        call.respondRedirect(redirect)
                        return@get
                    }
                }
            }
            val providerUrl = if (AppConfig.frontend.host.startsWith("localhost")) {
                "http://${AppConfig.frontend.host}"
            } else {
                "https://${AppConfig.frontend.host}"
            }
            logger.debug("Redirecting to provider URL: $providerUrl")
            call.respondRedirect(providerUrl)
        }
    }
}