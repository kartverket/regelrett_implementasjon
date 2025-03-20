package no.bekk.plugins

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import no.bekk.configuration.Database
import no.bekk.configuration.OAuthConfig
import no.bekk.database.AnswerRepository
import no.bekk.database.CommentRepository
import no.bekk.database.ContextRepository
import no.bekk.routes.*
import no.bekk.services.FormService
import no.bekk.services.MicrosoftService

fun Application.configureRouting(
    oAuthConfig: OAuthConfig,
    formService: FormService,
    microsoftService: MicrosoftService,
    database: Database,
    answerRepository: AnswerRepository,
    commentRepository: CommentRepository,
    contextRepository: ContextRepository
) {
    routing {
        get("/") {
            call.respondText("Velkommen til Kartverket regelrett!")
        }

        get("/health") {
            call.respondText("Health OK", ContentType.Text.Plain)
        }

        get("/schemas") {
            val schemas = formService.getFormProviders().map {
                it.getSchema()
            }
            call.respond(schemas)
        }

        authenticate("auth-jwt") {
            answerRouting(microsoftService, answerRepository, contextRepository)
            commentRouting(microsoftService, commentRepository, contextRepository)
            contextRouting(microsoftService, answerRepository, contextRepository)
            formRouting(formService)
            userInfoRouting(oAuthConfig, microsoftService)
            uploadCSVRouting(oAuthConfig, microsoftService, database)
        }

        airTableWebhookRouting(formService)
    }
}
