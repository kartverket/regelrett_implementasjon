package no.bekk.plugins

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import no.bekk.configuration.AppConfig
import no.bekk.configuration.Database
import no.bekk.routes.*
import no.bekk.services.FormService
import no.bekk.services.MicrosoftService

fun Application.configureRouting(config: AppConfig, formService: FormService, microsoftService: MicrosoftService, database: Database) {

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
            answerRouting(microsoftService)
            commentRouting(microsoftService)
            contextRouting(microsoftService)
            formRouting(formService)
            userInfoRouting(config, microsoftService)
            uploadCSVRouting(config, microsoftService, database)
        }

        airTableWebhookRouting(formService)
    }
}
