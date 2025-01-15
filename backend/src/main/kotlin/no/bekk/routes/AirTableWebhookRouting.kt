package no.bekk.routes

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.Serializable
import no.bekk.providers.AirTableProvider
import no.bekk.services.FormService
import no.bekk.util.logger
import javax.crypto.Mac
import javax.crypto.spec.SecretKeySpec
import java.util.Base64

@Serializable
data class AirtableWebhookPayload(
    val base: Base,
    val webhook: Webhook,
    val timestamp: String,
)

@Serializable
data class Base(
    val id: String
)

@Serializable
data class Webhook(
    val id: String
)

fun Route.airTableWebhookRouting() {
    post("/webhook") {
        try {

            logger.info("Received webhook ping from AirTable")
            val incomingSignature = call.request.headers["X-Airtable-Content-Mac"]?.removePrefix("hmac-sha256=") ?: run {
                call.respond(HttpStatusCode.Unauthorized, "Missing signature")
                return@post
            }

            val requestBody = call.receiveText()
            val payload = kotlinx.serialization.json.Json.decodeFromString<AirtableWebhookPayload>(requestBody)

            try {
                validateSignature(incomingSignature, requestBody)
                processWebhook(payload.webhook.id)
                call.respond(HttpStatusCode.OK)
                return@post
            } catch (e: AuthorizationException) {
                call.respond(HttpStatusCode.Unauthorized, e.message ?: "Authorization error")
                return@post
            } catch (e: NotFoundException) {
                call.respond(HttpStatusCode.NotFound, e.message ?: "Resource not found")
                return@post
            } catch (e: Exception) {
                logger.error("Error processing webhook", e)
                call.respondText("Failed to process webhook", status = HttpStatusCode.BadRequest)
                return@post
            }
            logger.info("Received webhook ping from AirTable")

        } catch (e: Exception) {
            logger.error("Error processing webhook", e)
            call.respondText("Failed to process webhook", status = HttpStatusCode.BadRequest)
        }
    }
}

private fun getAirTableProviderByWebhookId(webhookId: String): AirTableProvider? =
    FormService.getFormProviders().filterIsInstance<AirTableProvider>().find { it.webhookId == webhookId }


private fun validateSignature(incomingSignature: String?, requestBody: String) {
    val payload = kotlinx.serialization.json.Json.decodeFromString<AirtableWebhookPayload>(requestBody)
    val provider = getAirTableProviderByWebhookId(payload.webhook.id) ?: throw NotFoundException("Provider not found")

    val macSecret = Base64.getDecoder().decode(provider.webhookSecret)
    val hmacSha256 = Mac.getInstance("HmacSHA256").apply {
        init(SecretKeySpec(macSecret, "HmacSHA256"))
    }

    val calculatedHmacHex = hmacSha256.doFinal(requestBody.toByteArray(Charsets.UTF_8)).joinToString("") {
        String.format("%02x", it)
    }

    if (calculatedHmacHex != incomingSignature) {
        logger.info("Missing or invalid signature")
        throw AuthorizationException("Missing or invalid signature")
    }
}

private suspend fun processWebhook(webhookId: String) {
    val provider = getAirTableProviderByWebhookId(webhookId) ?: throw NotFoundException("Provider not found")

    provider.refreshWebhook()
    provider.updateCaches()
}

class AuthorizationException(message: String) : Exception(message)
class NotFoundException(message: String) : Exception(message)
