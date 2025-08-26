# Error Handling and Logging Improvements

This document describes the comprehensive error handling and logging improvements implemented for the Regelrett backend application.

## Overview

The application previously lacked consistent error handling and sufficient logging for debugging issues. This implementation introduces:

1. **Standardized error responses** across all endpoints
2. **Enhanced logging configuration** with request correlation
3. **Comprehensive exception hierarchy** for different error scenarios
4. **Improved authentication and security logging**
5. **Database operation monitoring**

## Key Features

### 1. Request Correlation IDs

Every request now gets a unique correlation ID that can be traced through all logs:

```
2024-01-15 10:30:45.123 [http-nio-8080-exec-1] INFO  no.bekk.routes - [req-123-456] Received GET /contexts with teamId abc123
2024-01-15 10:30:45.125 [http-nio-8080-exec-1] DEBUG no.bekk.database - [req-123-456] DB_OPERATION: get_contexts_by_team completed in 15ms
```

### 2. Standardized Error Responses

All APIs now return consistent error responses:

```json
{
  "error": "VALIDATION_ERROR",
  "message": "Missing required parameter: teamId",
  "details": "Parameter 'teamId' cannot be null or blank",
  "requestId": "req-123-456",
  "timestamp": "2024-01-15T10:30:45.123Z"
}
```

### 3. Enhanced Authentication Logging

Authentication failures are now logged with detailed context:

```
2024-01-15 10:30:45.123 [http-nio-8080-exec-1] WARN  no.bekk.security - AUTH_EVENT: JWT validation failed | User: user@example.com | Details: reason=Invalid audience, expectedAudience=app-client-id, actualAudience=other-client-id
```

### 4. Database Operation Monitoring

All database operations are logged with timing information:

```
2024-01-15 10:30:45.123 [http-nio-8080-exec-1] DEBUG no.bekk.database - DB_OPERATION: insert_context completed in 25ms
2024-01-15 10:30:45.150 [http-nio-8080-exec-1] ERROR no.bekk.database - DB_OPERATION: get_user_groups failed after 1500ms
```

### 5. Security Event Logging

Security-related events are properly logged for monitoring:

```
2024-01-15 10:30:45.123 [http-nio-8080-exec-1] WARN  no.bekk.security - Webhook signature validation failed | Context: webhookId=webhook-123, expectedSignature=abc123..., receivedSignature=def456...
```

## Error Types

The system now uses a comprehensive exception hierarchy:

- **ValidationException** (400) - Input validation errors
- **AuthenticationException** (401) - Authentication failures
- **AuthorizationException** (403) - Access denied scenarios
- **ResourceNotFoundException** (404) - Missing resources
- **ConflictException** (409) - Resource conflicts (e.g., unique constraint violations)
- **DatabaseException** (500) - Database operation failures
- **ExternalServiceException** (502) - External API failures

## Configuration

### Logging Configuration (`logback.xml`)

```xml
<configuration>
    <!-- Request correlation ID in all log messages -->
    <pattern>%d{YYYY-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger{36} - [%X{requestId:-}] %msg%n</pattern>
    
    <!-- Application loggers with detailed logging -->
    <logger name="no.bekk.authentication" level="DEBUG"/>
    <logger name="no.bekk.security" level="DEBUG"/>
    <logger name="no.bekk.database" level="DEBUG"/>
</configuration>
```

### Example Usage in Routes

```kotlin
fun Route.exampleRouting() {
    post("/example") {
        safeExecute(call, logger, "Failed to process example") {
            val id = validateRequired(call.parameters["id"], "id")
            
            validateAccess(
                authService.hasAccess(call, id),
                "resource $id"
            )
            
            val result = logDatabaseOperation("example_operation") {
                repository.performOperation(id)
            }
            
            call.respond(HttpStatusCode.OK, result)
        }
    }
}
```

## Benefits

1. **Easier Debugging**: Request IDs make it simple to trace a request through all logs
2. **Better Monitoring**: Database timing and error patterns are visible
3. **Security Auditing**: Authentication and authorization failures are properly logged
4. **Consistent APIs**: All endpoints return standardized error formats
5. **Type Safety**: Custom exceptions provide better error categorization
6. **Performance Insights**: Database operation timing helps identify bottlenecks

## Migration Guide

Existing error handling patterns like:

```kotlin
// Old pattern
if (parameter == null) {
    call.respond(HttpStatusCode.BadRequest, "Missing parameter")
    return
}
```

Are replaced with:

```kotlin
// New pattern
val parameter = validateRequired(call.parameters["parameter"], "parameter")
```

This provides consistent error responses and better logging automatically.