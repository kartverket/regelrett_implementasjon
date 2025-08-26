package no.bekk.routes

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.Serializable
import kotlinx.serialization.SerializationException
import no.bekk.providers.AirTableProvider
import no.bekk.services.FormService
import no.bekk.util.*
import java.util.Base64
import javax.crypto.Mac
import javax.crypto.spec.SecretKeySpec

@Serializable
data class AirtableWebhookPayload(
    val base: Base,
    val webhook: Webhook,
    val timestamp: String,
)

@Serializable
data class Base(
    val id: String,
)

@Serializable
data class Webhook(
    val id: String,
)

fun Route.airTableWebhookRouting(formService: FormService) {
    post("/webhook") {
        safeExecute(call, logger, "Failed to process AirTable webhook") {
            logger.info("Received webhook request from AirTable")
            
            val incomingSignature = call.request.headers["X-Airtable-Content-Mac"]?.removePrefix("hmac-sha256=")
            if (incomingSignature.isNullOrBlank()) {
                securityLogger.warn("Webhook request missing signature header")
                throw AuthenticationException(
                    "Missing or invalid signature header",
                    reason = "No X-Airtable-Content-Mac header found"
                )
            }

            val requestBody = try {
                call.receiveText()
            } catch (e: Exception) {
                throw ValidationException("Failed to read request body", e)
            }

            val payload = try {
                kotlinx.serialization.json.Json.decodeFromString<AirtableWebhookPayload>(requestBody)
            } catch (e: SerializationException) {
                throw ValidationException("Invalid webhook payload format", e)
            }

            try {
                validateSignature(incomingSignature, requestBody, formService)
                processWebhook(payload.webhook.id, formService)
                
                logger.info("Successfully processed webhook for base ${payload.base.id}")
                call.respond(HttpStatusCode.OK)
            } catch (e: AuthenticationException) {
                securityLogger.warn("Webhook signature validation failed: ${e.message}")
                throw e
            } catch (e: ResourceNotFoundException) {
                logger.warn("Webhook provider not found: ${e.message}")
                throw e
            }
        }
    }
}

private fun getAirTableProviderByWebhookId(webhookId: String, formService: FormService): AirTableProvider? {
    return try {
        formService.getFormProviders()
            .filterIsInstance<AirTableProvider>()
            .find { it.webhookId == webhookId }
    } catch (e: Exception) {
        logger.error("Failed to retrieve form providers", e)
        null
    }
}

private fun validateSignature(incomingSignature: String, requestBody: String, formService: FormService) {
    val payload = try {
        kotlinx.serialization.json.Json.decodeFromString<AirtableWebhookPayload>(requestBody)
    } catch (e: SerializationException) {
        throw ValidationException("Failed to parse payload for signature validation", e)
    }
    
    val provider = getAirTableProviderByWebhookId(payload.webhook.id, formService)
        ?: throw ResourceNotFoundException(
            "Provider not found for webhook",
            resourceType = "webhook",
            resourceId = payload.webhook.id
        )

    val macSecret = try {
        Base64.getDecoder().decode(provider.webhookSecret)
    } catch (e: IllegalArgumentException) {
        throw ValidationException("Invalid webhook secret format", e)
    }

    val calculatedHmacHex = try {
        val hmacSha256 = Mac.getInstance("HmacSHA256").apply {
            init(SecretKeySpec(macSecret, "HmacSHA256"))
        }
        hmacSha256.doFinal(requestBody.toByteArray(Charsets.UTF_8)).joinToString("") {
            String.format("%02x", it)
        }
    } catch (e: Exception) {
        throw ValidationException("Failed to calculate HMAC signature", e)
    }

    if (calculatedHmacHex != incomingSignature) {
        securityLogger.warn(
            "Webhook signature validation failed",
            mapOf(
                "webhookId" to payload.webhook.id,
                "expectedSignature" to calculatedHmacHex.take(10) + "...",
                "receivedSignature" to incomingSignature.take(10) + "..."
            ).let { context ->
                logError("Invalid webhook signature", context = context)
            }
        )
        throw AuthenticationException(
            "Invalid webhook signature",
            reason = "HMAC signature mismatch"
        )
    }
    
    securityLogger.info("Webhook signature validated successfully for webhook ${payload.webhook.id}")
}

private suspend fun processWebhook(webhookId: String, formService: FormService) {
    val provider = getAirTableProviderByWebhookId(webhookId, formService)
        ?: throw ResourceNotFoundException(
            "Provider not found for webhook processing",
            resourceType = "webhook",
            resourceId = webhookId
        )

    try {
        logger.info("Processing webhook for provider ${provider.javaClass.simpleName}")
        provider.refreshWebhook()
        provider.updateCaches()
        logger.info("Webhook processing completed successfully")
    } catch (e: Exception) {
        throw ExternalServiceException(
            "Failed to process webhook",
            e,
            service = "AirTable"
        )
    }
}
