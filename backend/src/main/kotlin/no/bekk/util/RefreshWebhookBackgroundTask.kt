package no.bekk.util

import io.ktor.server.application.*
import kotlinx.coroutines.*
import no.bekk.providers.AirTableProvider
import no.bekk.services.TableService

fun Application.configureBackgroundTasks() {
    launchBackgroundTask {
        while (isActive) {
            try {
                val airTableProviders = TableService.getTableProviders().filterIsInstance<AirTableProvider>()
                airTableProviders.forEach { provider ->
                    if (provider.webhookId.isNullOrEmpty()) {
                        logger.info("Table ${provider.id} has no webhook id. Nothing to refresh.")
                        return@forEach
                    }
                    val success = provider.refreshWebhook()
                    if (success) {
                        logger.info("Successfully refreshed webhook for table ${provider.id}")
                    } else {
                        logger.warn("Failed to refresh webhook for table ${provider.id}")
                    }
                }

                // Delay for 24 hours
                delay(24 * 60 * 60 * 1000L)
            } catch (e: CancellationException) {
                throw e
            } catch (e: Exception) {
                logger.error("Error refreshing webhook", e)
                delay(60 * 1000L) // Retry after 1 minute in case of error
            }
        }
    }
}

fun Application.launchBackgroundTask(block: suspend CoroutineScope.() -> Unit): Job {
    return this.launch(block = block)
}
