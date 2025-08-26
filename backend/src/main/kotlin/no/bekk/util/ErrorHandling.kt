package no.bekk.util

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.plugins.origin
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.Serializable
import org.slf4j.Logger

/**
 * Standardized error response format
 */
@Serializable
data class ErrorResponse(
    val error: String,
    val message: String,
    val details: String? = null,
    val requestId: String? = null,
    val timestamp: String = java.time.Instant.now().toString()
)

/**
 * Custom exception types for better error handling
 */
sealed class ApplicationException(
    message: String,
    cause: Throwable? = null,
    val errorCode: String,
    val httpStatus: HttpStatusCode
) : Exception(message, cause)

class AuthenticationException(
    message: String,
    cause: Throwable? = null,
    val reason: String? = null
) : ApplicationException(message, cause, "AUTH_FAILED", HttpStatusCode.Unauthorized)

class AuthorizationException(
    message: String,
    cause: Throwable? = null,
    val resource: String? = null
) : ApplicationException(message, cause, "ACCESS_DENIED", HttpStatusCode.Forbidden)

class ValidationException(
    message: String,
    cause: Throwable? = null,
    val field: String? = null
) : ApplicationException(message, cause, "VALIDATION_ERROR", HttpStatusCode.BadRequest)

class ResourceNotFoundException(
    message: String,
    cause: Throwable? = null,
    val resourceType: String? = null,
    val resourceId: String? = null
) : ApplicationException(message, cause, "RESOURCE_NOT_FOUND", HttpStatusCode.NotFound)

class DatabaseException(
    message: String,
    cause: Throwable? = null,
    val operation: String? = null
) : ApplicationException(message, cause, "DATABASE_ERROR", HttpStatusCode.InternalServerError)

class ExternalServiceException(
    message: String,
    cause: Throwable? = null,
    val service: String? = null
) : ApplicationException(message, cause, "EXTERNAL_SERVICE_ERROR", HttpStatusCode.BadGateway)

class BusinessLogicException(
    message: String,
    cause: Throwable? = null
) : ApplicationException(message, cause, "BUSINESS_LOGIC_ERROR", HttpStatusCode.UnprocessableEntity)

class ConflictException(
    message: String,
    cause: Throwable? = null,
    val resource: String? = null
) : ApplicationException(message, cause, "CONFLICT", HttpStatusCode.Conflict)

/**
 * Extension function to handle exceptions in a standardized way
 */
suspend fun ApplicationCall.handleException(
    exception: Throwable,
    logger: Logger,
    defaultMessage: String = "An unexpected error occurred"
) {
    val requestId = getCurrentRequestId()
    
    when (exception) {
        is ApplicationException -> {
            logger.warn("Application exception: ${exception.message}", exception)
            respond(
                exception.httpStatus,
                ErrorResponse(
                    error = exception.errorCode,
                    message = exception.message ?: defaultMessage,
                    details = exception.cause?.message,
                    requestId = requestId
                )
            )
        }
        is no.bekk.database.UniqueConstraintViolationException -> {
            logger.warn("Unique constraint violation: ${exception.message}", exception)
            respond(
                HttpStatusCode.Conflict,
                ErrorResponse(
                    error = "UNIQUE_CONSTRAINT_VIOLATION",
                    message = exception.message ?: "Resource already exists",
                    requestId = requestId
                )
            )
        }
        is IllegalArgumentException -> {
            logger.warn("Validation error: ${exception.message}", exception)
            respond(
                HttpStatusCode.BadRequest,
                ErrorResponse(
                    error = "INVALID_ARGUMENT",
                    message = exception.message ?: "Invalid argument provided",
                    requestId = requestId
                )
            )
        }
        else -> {
            logError(
                "Unhandled exception in ${request.uri}",
                exception,
                mapOf(
                    "method" to request.httpMethod.value,
                    "userAgent" to request.headers["User-Agent"],
                    "remoteHost" to request.origin.remoteHost
                )
            )
            respond(
                HttpStatusCode.InternalServerError,
                ErrorResponse(
                    error = "INTERNAL_ERROR",
                    message = defaultMessage,
                    requestId = requestId
                )
            )
        }
    }
}

/**
 * Extension function for safe execution with error handling in routes
 */
suspend inline fun <T> Route.safeExecute(
    call: ApplicationCall,
    logger: Logger,
    errorMessage: String = "Operation failed",
    block: () -> T
): T? {
    return try {
        block()
    } catch (e: Exception) {
        call.handleException(e, logger, errorMessage)
        null
    }
}

/**
 * Validates that a parameter is not null or blank
 */
fun validateRequired(value: String?, parameterName: String): String {
    if (value.isNullOrBlank()) {
        throw ValidationException(
            message = "Missing required parameter: $parameterName",
            field = parameterName
        )
    }
    return value
}

/**
 * Validates access to a resource
 */
fun validateAccess(hasAccess: Boolean, resource: String, action: String = "access") {
    if (!hasAccess) {
        throw AuthorizationException(
            message = "Access denied to $action $resource",
            resource = resource
        )
    }
}