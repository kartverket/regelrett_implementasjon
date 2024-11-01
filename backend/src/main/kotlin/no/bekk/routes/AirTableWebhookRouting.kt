package no.bekk.routes

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import no.bekk.configuration.AppConfig
import no.bekk.util.logger

data class AirtableWebhookPayload(
    val changedTablesById: Map<String, List<String>>,
    val eventId: String,
    val baseId: String
)

fun Route.airTableWebhookRouting() {
    post("/webhook") {
        try {


            val incomingToken = call.request.headers["Authorization"]
            //val validToken = AppConfig.air  // Replace with your actual token

//            if (incomingToken != validToken) {
//                call.respond(HttpStatusCode.Unauthorized, "Invalid token")
//                return@post
//            }

            val payload = call.receive<AirtableWebhookPayload>()
            logger.info("Received webhook event: ${payload.eventId} for base: ${payload.baseId}")

            payload.changedTablesById.forEach { (tableId, changes) ->
                logger.info("Table ID: $tableId, Changes: $changes")
            }

        } catch (e: Exception) {
            logger.error("Error processing webhook", e)
            call.respondText("Failed to process webhook", status = io.ktor.http.HttpStatusCode.BadRequest)
        }
    }
}

