package no.bekk.routes

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import no.bekk.services.TableService
import no.bekk.util.logger
import javax.crypto.Mac
import javax.crypto.spec.SecretKeySpec
import java.util.Base64

data class AirtableWebhookPayload(
    val changedTablesById: Map<String, List<String>>,
    val eventId: String,
    val baseId: String
)

fun Route.airTableWebhookRouting() {
    post("/webhook") {
        try {
            val macSecretBase64 = System.getenv("AIRTABLE_WEBHOOK_SECRET")

            val incomingSignature = call.request.headers["X-Airtable-Content-Mac"] ?: run {
                call.respond(HttpStatusCode.Unauthorized, "Missing signature")
                return@post
            }
            val incomingSignatureHex = incomingSignature.removePrefix("hmac-sha256=")

            val macSecret = Base64.getDecoder().decode(macSecretBase64)
            val hmacSha256 = Mac.getInstance("HmacSHA256").apply {
                init(SecretKeySpec(macSecret, "HmacSHA256"))
            }

            val requestBody = call.receiveText()
            val calculatedHmacHex = hmacSha256.doFinal(requestBody.toByteArray(Charsets.UTF_8)).joinToString("") {
                String.format("%02x", it)
            }
            if (calculatedHmacHex != incomingSignatureHex) {
                call.respond(HttpStatusCode.Unauthorized, "Invalid signature")
                return@post
            }
            logger.info("Received webhook ping from AirTable")

            val tableProviders = TableService.getTableProviders()
            tableProviders.forEach { provider ->
                try {
                    provider.tableCache.invalidate(provider.id)
                    provider.columnCache.invalidate(provider.id)
                    provider.questionCache.invalidateAll()

                    val freshTable = provider.getTable()
                    provider.tableCache.put(provider.id, freshTable)
                    provider.columnCache.put(provider.id, freshTable.columns)
                    freshTable.records.forEach { record ->
                        record.recordId?.let {
                            provider.questionCache.put(it, record)
                        }
                    }
                    logger.info("Updated cache for provider id: ${provider.id}")
                } catch (e: Exception) {
                    logger.error("Failed to update cache for provider id: ${provider.id}", e)
                }
            }

            call.respond(HttpStatusCode.OK)
            return@post

        } catch (e: Exception) {
            logger.error("Error processing webhook", e)
            call.respondText("Failed to process webhook", status = io.ktor.http.HttpStatusCode.BadRequest)
        }
    }
}

