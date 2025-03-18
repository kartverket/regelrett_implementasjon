package no.bekk.plugins

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import no.bekk.configuration.AppConfig
import no.bekk.routes.*
import no.bekk.services.FormService

fun Application.configureRouting(config: AppConfig) {

    routing {
        get("/") {
            call.respondText("Velkommen til Kartverket regelrett!")
        }

        get("/health") {
            call.respondText("Health OK", ContentType.Text.Plain)
        }

        get("/schemas") {
            val schemas = FormService.getFormProviders().map {
                it.getSchema()
            }
            call.respond(schemas)
        }

        authenticate("auth-jwt") {
            answerRouting()
            commentRouting()
            contextRouting()
            formRouting()
            userInfoRouting(config)
            uploadCSVRouting(config)
        }

        airTableWebhookRouting()
    }
}
