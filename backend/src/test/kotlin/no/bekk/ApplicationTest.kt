package no.bekk

import io.ktor.server.routing.*
import io.ktor.server.testing.*
import io.mockk.every
import io.mockk.mockkObject
import no.bekk.configuration.*
import no.bekk.plugins.runFlywayMigration
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertAll
import org.junit.jupiter.api.fail

class ApplicationTest {
    private val exampleConfig = AppConfig(
        FormConfig(AirTableConfig(""), emptyList()),
        MicrosoftGraphConfig("", ""),
        OAuthConfig("","test","","","","","","","",""),
        FrontendConfig(""),
        BackendConfig(""),
        DbConfig("", "", ""),
        AnswerHistoryCleanupConfig(""),
        emptyList()
    )

    @Test
    fun `Verify that authentication is enabled on non-public endpoints`() = testApplication {
        application {
            // Mock the Database object with stubs to avoid actual DB initialization and migrations during the test
            mockkObject(Database) {
                every { Database.initDatabase(exampleConfig) } returns Unit
                every { runFlywayMigration(exampleConfig) } returns Unit
                module()
                routing {
                    val publicEndpointsRegexList = listOf(
                        Regex("^/schemas"),
                        Regex("^/health"),
                        Regex("^/$")
                    )

                    // Get all registered routes and filter out those that match any of the public endpoint regex patterns
                    val nonPublicRoutes = getAllRoutes().filter { route ->
                        publicEndpointsRegexList.none { regex ->
                            regex.containsMatchIn(route.toString())
                        }
                    }

                    assertAll("Authentication in routes", nonPublicRoutes.map { route ->
                        // The `assertionForRoute@` is a label to enable us to return from the function if we find
                        // the Authenticate plugin.
                        assertionForRoute@ {
                            var currRoute: Route? = route
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
                    }
                    )
                }
            }
        }
    }
}