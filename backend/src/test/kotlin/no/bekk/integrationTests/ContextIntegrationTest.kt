package no.bekk.integrationTests

import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*
import io.ktor.server.testing.*
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import no.bekk.MockMicrosoftService
import no.bekk.TestDatabase
import no.bekk.TestUtils.generateTestToken
import no.bekk.TestUtils.testModule
import no.bekk.configuration.JDBCDatabase
import no.bekk.database.ContextRepositoryImpl
import no.bekk.database.DatabaseContext
import no.bekk.database.DatabaseContextRequest
import no.bekk.domain.MicrosoftGraphGroup
import no.bekk.routes.TeamUpdateRequest
import org.junit.jupiter.api.AfterAll
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.Test

class ContextIntegrationTest {

    @Test
    fun `Create, get, update and delete context`() = testApplication {
        val database = JDBCDatabase.create(testDatabase.getTestdatabaseConfig())
        val microsoftService = object : MockMicrosoftService {
            override suspend fun requestTokenOnBehalfOf(jwtToken: String?): String {
                return ""
            }

            override suspend fun fetchGroups(bearerToken: String): List<MicrosoftGraphGroup> {
                return listOf(MicrosoftGraphGroup("teamId", ""))
            }
        }
        val contextRepository = ContextRepositoryImpl(database)
        application {
            testModule(
                database,
                contextRepository = contextRepository,
                microsoftService = microsoftService,
            )
        }

        //Create context
        var response = client.post("/contexts") {
            header(HttpHeaders.Authorization, "Bearer ${generateTestToken()}")
            contentType(ContentType.Application.Json)
            setBody(
                Json.encodeToString(
                    DatabaseContextRequest("team", "formId", "name")
                )
            )
        }

        assertEquals(HttpStatusCode.Created, response.status)

        //Get context
        response = client.get("/contexts?formId=formId&teamId=team") {
            header(HttpHeaders.Authorization, "Bearer ${generateTestToken()}")
        }
        val contextList: List<DatabaseContext> = Json.decodeFromString(response.bodyAsText())
        val contextId = contextList.first().id

        assertEquals(1, contextList.size)
        contextList.first().let {
            assertEquals("name", it.name,)
            assertEquals("teamId", it.teamId)
            assertEquals("formId", it.formId)
        }


        //Update context team
        val newTeamName = "newTeam"
        val teamUpdateRequest = TeamUpdateRequest(newTeamName)

        response = client.patch("/contexts/${contextId}/team") {
            header(HttpHeaders.Authorization, "Bearer ${generateTestToken()}")
            contentType(ContentType.Application.Json)
            setBody(Json.encodeToString(teamUpdateRequest))
        }
        assertEquals(HttpStatusCode.OK, response.status)

        //Get context to verify that the team is updated
        response = client.get("contexts/${contextId}") {
            header(HttpHeaders.Authorization, "Bearer ${generateTestToken()}")
        }
        val updatedContext: DatabaseContext = Json.decodeFromString(response.bodyAsText())
        assertEquals(updatedContext.teamId, newTeamName)

        //Delete context
        response = client.delete("/contexts/${contextId}") {
            header(HttpHeaders.Authorization, "Bearer ${generateTestToken()}")
        }
        assertEquals(HttpStatusCode.OK, response.status)
        assertEquals("Context and its answers and comments were successfully deleted.", response.bodyAsText())
    }

    companion object {

        private lateinit var testDatabase: TestDatabase

        @JvmStatic
        @BeforeAll
        fun setup() {
            testDatabase = TestDatabase()
        }

        @JvmStatic
        @AfterAll
        fun cleanup() {
            testDatabase.stopTestDatabase()
        }
    }
}