package no.bekk.plugins

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.plugins.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import no.bekk.database.ContextRepository
import no.bekk.routes.*
import no.bekk.services.FormService
import no.bekk.util.logger

fun Application.configureRouting() {

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

        //This endpoint can be removed after schemas in frisk are migrated to new metadata
        get("/contexts/{contextId}/tableId") {
            logger.debug("Received GET /contexts/{contextId}/tableId with id: ${call.parameters["contextId"]}")
            val contextId = call.parameters["contextId"] ?: throw BadRequestException("Missing contextId")
            val tableId = ContextRepository.getContextTableId(contextId);
            call.respond(HttpStatusCode.OK, tableId)
            return@get
        }

        authenticate("auth-jwt") {
            answerRouting()
            commentRouting()
            contextRouting()
            questionRouting()
            tableRouting()
            userInfoRouting()
            uploadCSVRouting()
        }

        airTableWebhookRouting()
    }
}
