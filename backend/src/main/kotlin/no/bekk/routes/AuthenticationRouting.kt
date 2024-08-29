package no.bekk.routes

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.sessions.*
import no.bekk.authentication.UserSession
import no.bekk.plugins.Config
import no.bekk.singletons.Env

fun Route.authenticationRouting() {

    get("/auth-status"){
        if(Config.isDevelopment) {
            call.respond(HttpStatusCode.OK, mapOf("authenticated" to true))
        } else {
            val userSession: UserSession? = call.sessions.get<UserSession>()
            if (userSession != null){
                call.respond(HttpStatusCode.OK, mapOf("authenticated" to true))
            } else {
                call.respond(HttpStatusCode.Unauthorized, mapOf("authenticated" to false))
            }
        }
    }

    if (!Config.isDevelopment) {
        authenticate ( "auth-oauth-azure" ) {
            get("/login") {
                call.respondText("Login endpoint")
            }
        }
        get("/callback") {
            val currentPrincipal: OAuthAccessTokenResponse.OAuth2? = call.principal()

            // redirects home if the url is not found before authorization
            currentPrincipal?.let { principal ->
                principal.state?.let { state ->
                    call.sessions.set(UserSession(state, principal.accessToken))
                    val redirects = mutableMapOf<String, String>()
                    redirects[state]?.let { redirect ->
                        call.respondRedirect(redirect)
                        return@get
                    }
                }
            }
            call.respondRedirect("https://${Env.get("FRONTEND_URL_HOST")}")
        }
    }

}