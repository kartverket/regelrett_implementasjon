package no.bekk

import io.ktor.client.request.*
import io.ktor.http.*
import io.ktor.server.routing.*
import io.ktor.server.testing.*
import no.bekk.configuration.*
import no.bekk.database.AnswerRepositoryImpl
import no.bekk.database.CommentRepositoryImpl
import no.bekk.database.ContextRepositoryImpl
import no.bekk.di.Dependencies
import no.bekk.plugins.configureRouting
import no.bekk.services.FormServiceImpl
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertAll
import org.junit.jupiter.api.fail
import java.sql.Connection

class ApplicationTest {
    private val exampleConfig = AppConfig(
        FormConfig(AirTableConfig(""), emptyList()),
        MicrosoftGraphConfig("", ""),
        OAuthConfig("https://test.com", "test", "", "", "", "", "", "", "", ""),
        FrontendConfig(""),
        BackendConfig(""),
        DbConfig("", "", ""),
        AnswerHistoryCleanupConfig(""),
        emptyList(),
    )
    private val mockDatabase = object : Database {
        override fun getConnection(): Connection {
            TODO("Not yet implemented")
        }
    }

    @Test
    fun `Verify that authentication is enabled on non-public endpoints`() = testApplication {
        application {
            configureAPILayer(
                exampleConfig,
                Dependencies(
                    mockDatabase,
                    FormServiceImpl(exampleConfig.formConfig),
                    AnswerRepositoryImpl(mockDatabase),
                    CommentRepositoryImpl(mockDatabase),
                    ContextRepositoryImpl(mockDatabase),
                    object : MockAuthService {},
                ),
            )

            val routingRoot = configureRouting(
                Dependencies(
                    mockDatabase,
                    FormServiceImpl(exampleConfig.formConfig),
                    AnswerRepositoryImpl(mockDatabase),
                    CommentRepositoryImpl(mockDatabase),
                    ContextRepositoryImpl(mockDatabase),
                    object : MockAuthService {},
                ),
            )
            val publicEndpointsRegexList = listOf(
                Regex("^/schemas"),
                Regex("^/health"),
                Regex("^/webhook"),
                Regex("^/\\(method:GET\\)$"),
            )

            // Get all registered routes and filter out those that match any of the public endpoint regex patterns

            val nonPublicRoutes = routingRoot.getAllRoutes().filter { route ->
                publicEndpointsRegexList.none { regex ->
                    regex.containsMatchIn(route.toString())
                }
            }

            assertAll(
                "Authentication in routes",
                nonPublicRoutes.map { route ->
                    // The `assertionForRoute@` is a label to enable us to return from the function if we find
                    // the Authenticate plugin.
                    assertionForRoute@{
                        var currRoute: RoutingNode? = route
                        // The Authenticate plugin that we are looking for is possibly defined earlier in
                        // the route hierarchy, so we traverse upwards via the parent property.
                        while (currRoute != null) {
                            // Checks if the Authenticate plugin is enabled in the current routes pipeline
                            if (currRoute.items.any { it.name == "Authenticate" }) {
                                return@assertionForRoute
                            }
                            currRoute = currRoute.parent
                        }

                        fail("$route does not have authentication enabled")
                    }
                },
            )
        }
    }

    @Test
    fun `Verify that CORS is enabled`() = testApplication {
        application {
            configureAPILayer(
                exampleConfig.copy(allowedCORSHosts = listOf("test.com")),
                Dependencies(
                    mockDatabase,
                    FormServiceImpl(exampleConfig.formConfig),
                    AnswerRepositoryImpl(mockDatabase),
                    CommentRepositoryImpl(mockDatabase),
                    ContextRepositoryImpl(mockDatabase),
                    object : MockAuthService {},
                ),
            )
        }

        val failedCors = client.get("/health") {
            header(HttpHeaders.Origin, "https://test1234.com")
        }

        assertEquals(HttpStatusCode.Forbidden, failedCors.status)

        val successCors = client.get("/health") {
            header(HttpHeaders.Origin, "https://test.com")
        }

        assertEquals(HttpStatusCode.OK, successCors.status)
    }
}
