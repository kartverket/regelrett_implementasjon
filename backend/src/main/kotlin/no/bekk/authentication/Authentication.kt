package no.bekk.authentication

import com.auth0.jwk.JwkProviderBuilder
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.http.*
import io.ktor.http.auth.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.*
import io.ktor.server.response.*
import io.ktor.server.sessions.*
import java.net.URL
import java.util.concurrent.TimeUnit
import kotlin.math.log

val applicationHttpClient = HttpClient(CIO) {
    install(ContentNegotiation) {
        json()
    }
}

fun Application.installSessions() {
    install(Sessions) {
        cookie<UserSession>("user_session") {
            cookie.path = "/"
            cookie.maxAgeInSeconds = 360
            cookie.secure
            cookie.httpOnly = true
        }
    }
}

fun Application.initializeAuthentication(httpClient: HttpClient = applicationHttpClient) {
    val redirects = mutableMapOf<String, String>()
    val issuer = System.getenv("AUTH_ISSUER")
    val clientId = System.getenv("AUTH_CLIENT_ID")
    val jwksUri = "https://login.microsoftonline.com/${System.getenv("TENANT_ID")}/discovery/v2.0/keys"

    val jwkProvider = JwkProviderBuilder(URL(jwksUri))
        .cached(10, 24, TimeUnit.HOURS)
        .rateLimited(10, 1, TimeUnit.MINUTES)
        .build()

    install(Authentication) {
        jwt("auth-jwt") {
            verifier(jwkProvider, issuer){
                withIssuer(issuer)
                acceptLeeway(3)
                withAudience(clientId)
            }
            validate { jwtCredential ->
                if (jwtCredential.audience.contains(clientId)) JWTPrincipal(jwtCredential.payload) else null
            }
            challenge{_,_ ->
                call.respond(HttpStatusCode.Unauthorized, "You are unauthenticated")
            }
            authHeader { call ->
                val userSession: UserSession? = call.sessions.get<UserSession>()
                val token = userSession?.token
                if (token.isNullOrEmpty()) return@authHeader null
                try {
                    parseAuthorizationHeader("Bearer $token")
                } catch (e: IllegalArgumentException) {
                    throw IllegalArgumentException("Error decoding authentication token", e)
                }
            }
        }

        oauth("auth-oauth-azure") {
            urlProvider = { System.getenv("AUTH_PROVIDER_URL") }
            providerLookup = {
                OAuthServerSettings.OAuth2ServerSettings(
                    name = "azure",
                    authorizeUrl = "https://login.microsoftonline.com/${System.getenv("TENANT_ID")}/oauth2/v2.0/authorize",
                    accessTokenUrl = "https://login.microsoftonline.com/${System.getenv("TENANT_ID")}/oauth2/v2.0/token",
                    requestMethod = HttpMethod.Post,
                    clientId = clientId,
                    clientSecret = System.getenv("AUTH_CLIENT_SECRET"),
                    defaultScopes = listOf("$clientId/.default"),
                    extraAuthParameters = listOf("audience" to clientId),
                    onStateCreated = { call, state ->
                        call.request.queryParameters["redirectUrl"]?.let {
                            redirects[state] = it
                        }
                    }
                )
            }
            client = httpClient
        }
    }
}

fun getGroupsOrEmptyList(call: ApplicationCall): List<String> {
    val principal = call.principal<JWTPrincipal>()
    val groupsClaim = principal?.payload?.getClaim("groups")

    if(groupsClaim == null || groupsClaim.isMissing || groupsClaim.isNull){
        return emptyList()
    }
    val groups = groupsClaim.asList(String::class.java)

    return groups
}

fun hasTeamAccess(call: ApplicationCall, teamId: String?): Boolean {
    if(teamId == null || teamId == "") return false

    val groups = getGroupsOrEmptyList(call)
    if(groups.isEmpty()) return false

    return teamId in groups
}

data class UserSession(val state: String, val token: String)
