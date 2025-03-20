package no.bekk.plugins

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import no.bekk.configuration.Database
import no.bekk.configuration.OAuthConfig
import no.bekk.database.AnswerRepository
import no.bekk.routes.*
import no.bekk.services.FormService
import no.bekk.services.MicrosoftService

fun Application.configureRouting(oAuthConfig: OAuthConfig, formService: FormService, microsoftService: MicrosoftService, database: Database, answerRepository: AnswerRepository) {

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
            answerRouting(microsoftService, answerRepository)
            commentRouting(microsoftService)
            contextRouting(microsoftService, answerRepository)
            formRouting(formService)
            userInfoRouting(oAuthConfig, microsoftService)
            uploadCSVRouting(oAuthConfig, microsoftService, database)
        }

        airTableWebhookRouting(formService)
    }
}
