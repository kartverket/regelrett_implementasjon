package no.bekk.authentication

import com.auth0.jwk.JwkProviderBuilder
import io.ktor.client.HttpClient
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.*
import io.ktor.server.request.uri
import io.ktor.server.response.*
import io.ktor.server.sessions.*
import io.ktor.server.util.url
import kotlinx.serialization.Serializable
import no.bekk.configuration.Config
import no.bekk.configuration.getIssuer
import no.bekk.configuration.getJwksUrl
import no.bekk.di.Redirects
import no.bekk.util.*
import java.net.URI
import java.util.concurrent.TimeUnit

@Serializable
data class UserSession(val state: String, val token: String, val expiresAt: Long)

fun Application.initializeAuthentication(config: Config, httpClient: HttpClient, redirects: Redirects) {
    val issuer = getIssuer(config.oAuth)
    val clientId = config.oAuth.clientId
    val jwksUri = getJwksUrl(config.oAuth)

    val jwkProvider = JwkProviderBuilder(URI(jwksUri).toURL())
        .cached(10, 24, TimeUnit.HOURS)
        .rateLimited(10, 1, TimeUnit.MINUTES)
        .build()

    install(Sessions) {
        cookie<UserSession>("user_session") {
            cookie.path = "/"
            cookie.httpOnly = false
        }
    }

    install(Authentication) {
        oauth("auth-oauth-azure") {
            urlProvider = {
                "${config.server.appUrl}/callback"
            }
            providerLookup = {
                OAuthServerSettings.OAuth2ServerSettings(
                    name = "azure",
                    authorizeUrl = "${config.oAuth.baseUrl}/${config.oAuth.tenantId}${config.oAuth.authPath}",
                    accessTokenUrl = "${config.oAuth.baseUrl}/${config.oAuth.tenantId}/${config.oAuth.tokenPath}",
                    requestMethod = HttpMethod.Post,
                    clientId = clientId,
                    clientSecret = config.oAuth.clientSecret,
                    defaultScopes = listOf("$clientId/.default"),
                    onStateCreated = { call, state ->
                        call.request.queryParameters["redirectUrl"]?.let { redirectUrl ->
                            redirects.r[state] = redirectUrl
                        }
                        logAuthEvent(
                            "OAuth state created",
                            details = mapOf("state" to state, "redirectUrl" to call.request.queryParameters["redirectUrl"])
                        )
                    },
                )
            }
            client = httpClient
        }

        session<UserSession>("auth-session") {
            validate { session ->
                val currentTime = System.currentTimeMillis()
                val isValid = session.state != "" && session.token != "" && currentTime < session.expiresAt
                
                if (isValid) {
                    logAuthEvent(
                        "Session validation successful",
                        userId = session.state,
                        details = mapOf("expiresAt" to session.expiresAt)
                    )
                    session
                } else {
                    val reason = when {
                        currentTime > session.expiresAt -> "Token expired"
                        session.token.isBlank() -> "Missing token"
                        session.state.isBlank() -> "Missing state"
                        else -> "Unknown reason"
                    }
                    
                    logAuthEvent(
                        "Session validation failed",
                        userId = session.state.takeIf { it.isNotBlank() },
                        details = mapOf(
                            "reason" to reason,
                            "expiresAt" to session.expiresAt,
                            "currentTime" to currentTime,
                            "hasToken" to session.token.isNotBlank(),
                            "hasState" to session.state.isNotBlank()
                        ),
                        success = false
                    )
                    null
                }
            }

            challenge {
                val redirectUrl = call.url {
                    path("/login")
                    parameters.append("redirectUrl", call.request.uri)
                    build()
                }

                logAuthEvent(
                    "Session challenge triggered",
                    details = mapOf(
                        "originalUrl" to call.request.uri,
                        "redirectUrl" to redirectUrl
                    ),
                    success = false
                )

                call.respondRedirect(redirectUrl)
            }
        }

        jwt("auth-jwt") {
            verifier(jwkProvider, issuer) {
                withIssuer(issuer)
                acceptLeeway(3)
                withAudience(clientId)
            }

            validate { jwtCredential ->
                try {
                    val hasValidAudience = jwtCredential.audience.contains(clientId)
                    val subject = jwtCredential.payload.subject
                    
                    if (hasValidAudience) {
                        logAuthEvent(
                            "JWT validation successful",
                            userId = subject,
                            details = mapOf(
                                "issuer" to jwtCredential.payload.issuer,
                                "audience" to jwtCredential.audience.joinToString(","),
                                "expiresAt" to jwtCredential.payload.expiresAt?.time
                            )
                        )
                        JWTPrincipal(jwtCredential.payload)
                    } else {
                        logAuthEvent(
                            "JWT validation failed",
                            userId = subject,
                            details = mapOf(
                                "reason" to "Invalid audience",
                                "expectedAudience" to clientId,
                                "actualAudience" to jwtCredential.audience.joinToString(","),
                                "issuer" to jwtCredential.payload.issuer
                            ),
                            success = false
                        )
                        null
                    }
                } catch (e: Exception) {
                    logAuthEvent(
                        "JWT validation error",
                        details = mapOf(
                            "error" to e.message,
                            "cause" to e.cause?.message
                        ),
                        success = false
                    )
                    authLogger.error("JWT validation failed with exception", e)
                    null
                }
            }

            challenge { defaultScheme, realm ->
                logAuthEvent(
                    "JWT challenge triggered",
                    details = mapOf(
                        "scheme" to defaultScheme,
                        "realm" to realm,
                        "uri" to call.request.uri,
                        "authHeader" to (call.request.headers["Authorization"]?.take(20) + "..." ?: "missing")
                    ),
                    success = false
                )
                
                call.respond(
                    HttpStatusCode.Unauthorized,
                    ErrorResponse(
                        error = "AUTH_FAILED",
                        message = "Token is not valid or has expired",
                        requestId = getCurrentRequestId()
                    )
                )
            }
        }
    }
}
