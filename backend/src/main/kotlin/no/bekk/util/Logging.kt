package no.bekk.util

import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.slf4j.MDC
import io.ktor.server.application.*
import java.util.UUID

val logger: Logger = LoggerFactory.getLogger("no.bekk.logger")

// Specialized loggers for different concerns
val authLogger: Logger = LoggerFactory.getLogger("no.bekk.authentication")
val securityLogger: Logger = LoggerFactory.getLogger("no.bekk.security")
val errorLogger: Logger = LoggerFactory.getLogger("no.bekk.error")
val databaseLogger: Logger = LoggerFactory.getLogger("no.bekk.database")

const val REQUEST_ID_KEY = "requestId"

/**
 * Generates and sets a correlation ID for the current request
 */
fun ApplicationCall.setRequestId(): String {
    val requestId = request.headers["X-Request-ID"] ?: UUID.randomUUID().toString()
    MDC.put(REQUEST_ID_KEY, requestId)
    response.headers.append("X-Request-ID", requestId)
    return requestId
}

/**
 * Gets the current request ID from MDC
 */
fun getCurrentRequestId(): String? = MDC.get(REQUEST_ID_KEY)

/**
 * Clears the request ID from MDC
 */
fun clearRequestId() = MDC.remove(REQUEST_ID_KEY)

/**
 * Executes a block with request correlation context
 */
inline fun <T> withRequestContext(requestId: String, block: () -> T): T {
    val previousRequestId = MDC.get(REQUEST_ID_KEY)
    try {
        MDC.put(REQUEST_ID_KEY, requestId)
        return block()
    } finally {
        if (previousRequestId != null) {
            MDC.put(REQUEST_ID_KEY, previousRequestId)
        } else {
            MDC.remove(REQUEST_ID_KEY)
        }
    }
}

/**
 * Log authentication events with security context
 */
fun logAuthEvent(
    event: String,
    userId: String? = null,
    details: Map<String, Any?> = emptyMap(),
    success: Boolean = true
) {
    val level = if (success) "INFO" else "WARN"
    val logDetails = buildString {
        append("AUTH_EVENT: $event")
        userId?.let { append(" | User: $it") }
        if (details.isNotEmpty()) {
            append(" | Details: ${details.entries.joinToString(", ") { "${it.key}=${it.value}" }}")
        }
    }
    
    if (success) {
        authLogger.info(logDetails)
    } else {
        securityLogger.warn(logDetails)
    }
}

/**
 * Log error events with detailed context
 */
fun logError(
    message: String,
    throwable: Throwable? = null,
    context: Map<String, Any?> = emptyMap()
) {
    val contextDetails = if (context.isNotEmpty()) {
        " | Context: ${context.entries.joinToString(", ") { "${it.key}=${it.value}" }}"
    } else ""
    
    val fullMessage = "$message$contextDetails"
    
    if (throwable != null) {
        errorLogger.error(fullMessage, throwable)
    } else {
        errorLogger.error(fullMessage)
    }
}

/**
 * Log database operations with timing
 */
inline fun <T> logDatabaseOperation(
    operation: String,
    block: () -> T
): T {
    val startTime = System.currentTimeMillis()
    return try {
        val result = block()
        val duration = System.currentTimeMillis() - startTime
        databaseLogger.debug("DB_OPERATION: $operation completed in ${duration}ms")
        result
    } catch (e: Exception) {
        val duration = System.currentTimeMillis() - startTime
        databaseLogger.error("DB_OPERATION: $operation failed after ${duration}ms", e)
        throw e
    }
}

