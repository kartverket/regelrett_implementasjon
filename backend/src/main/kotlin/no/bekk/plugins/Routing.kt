package no.bekk.plugins

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.html.*
import io.ktor.server.http.content.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.sessions.*
import kotlinx.html.*
import no.bekk.authentication.UserSession
import no.bekk.configuration.Config
import no.bekk.di.Dependencies
import no.bekk.routes.*
import java.io.*

fun Application.configureRouting(
    config: Config,
    dependencies: Dependencies,
): RoutingRoot = routing {
    get("/health") {
        call.respondText("Health OK", ContentType.Text.Plain)
    }

    get("/schemas") {
        val schemas = dependencies.formService.getFormProviders().map {
            it.getSchema()
        }
        call.respond(schemas)
    }

    authenticate("auth-oauth-azure") {
        get("/login") {
            // Redirects to 'authorizeUrl' automatically
        }

        get("/callback") {
            val currentPrincipal: OAuthAccessTokenResponse.OAuth2? = call.principal()
            currentPrincipal?.let { principal ->
                principal.state?.let { state ->
                    call.sessions.set(UserSession(state, principal.accessToken))
                    dependencies.redirects.r[state]?.let { redirect ->
                        call.respondRedirect(redirect)
                        return@get
                    }
                }
            }
            call.respondRedirect("/")
        }
    }

    authenticate("auth-session") {
        webRouting(config.frontendDevServer, config.homePath)
        get("/logout") {
            call.sessions.clear<UserSession>()
            call.respondRedirect("/")
            // TODO: logout auth provider
        }
    }

    authenticate("auth-jwt") {
        route("/api") {
            answerRouting(dependencies.authService, dependencies.answerRepository)
            commentRouting(dependencies.authService, dependencies.commentRepository)
            contextRouting(dependencies.authService, dependencies.answerRepository, dependencies.contextRepository, dependencies.commentRepository)
            formRouting(dependencies.formService)
            userInfoRouting(dependencies.authService)
            uploadCSVRouting(dependencies.authService, dependencies.database)
        }
    }

    airTableWebhookRouting(dependencies.formService)
}
