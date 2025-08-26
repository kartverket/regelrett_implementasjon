package no.bekk.util

import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*
import io.ktor.server.testing.*
import kotlinx.serialization.json.Json
import no.bekk.testModule
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue

class ErrorHandlingTest {

    @Test
    fun `should return standardized error response for validation error`() = testApplication {
        application {
            testModule()
        }
        
        val response = client.get("/api/contexts") {
            header(HttpHeaders.Authorization, "Bearer valid-token")
            // Missing required teamId parameter
        }
        
        assertEquals(HttpStatusCode.BadRequest, response.status)
        
        val errorResponse = Json.decodeFromString<ErrorResponse>(response.bodyAsText())
        assertEquals("VALIDATION_ERROR", errorResponse.error)
        assertTrue(errorResponse.message.contains("Missing required parameter: teamId"))
        assertTrue(errorResponse.requestId?.isNotEmpty() == true)
        assertTrue(errorResponse.timestamp.isNotEmpty())
    }

    @Test 
    fun `should return standardized error response for access denied`() = testApplication {
        application {
            testModule()
        }
        
        val response = client.get("/api/contexts") {
            header(HttpHeaders.Authorization, "Bearer valid-token")
            parameter("teamId", "unauthorized-team")
        }
        
        assertEquals(HttpStatusCode.Forbidden, response.status)
        
        val errorResponse = Json.decodeFromString<ErrorResponse>(response.bodyAsText())
        assertEquals("ACCESS_DENIED", errorResponse.error)
        assertTrue(errorResponse.message.contains("Access denied"))
        assertTrue(errorResponse.requestId?.isNotEmpty() == true)
    }

    @Test
    fun `should return standardized error response for authentication failure`() = testApplication {
        application {
            testModule()
        }
        
        val response = client.get("/api/contexts") {
            // No authorization header
            parameter("teamId", "some-team")
        }
        
        assertEquals(HttpStatusCode.Unauthorized, response.status)
        
        val errorResponse = Json.decodeFromString<ErrorResponse>(response.bodyAsText())
        assertEquals("AUTH_FAILED", errorResponse.error)
        assertTrue(errorResponse.requestId?.isNotEmpty() == true)
    }
}