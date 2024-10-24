package no.bekk.authentication

import com.auth0.jwk.JwkProviderBuilder
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.*
import io.ktor.server.response.*
import no.bekk.configuration.*
import no.bekk.database.ContextRepository
import no.bekk.domain.MicrosoftGraphGroup
import no.bekk.domain.MicrosoftGraphUser
import no.bekk.services.MicrosoftService
import java.net.URI
import java.util.concurrent.TimeUnit

val applicationHttpClient = HttpClient(CIO) {
    install(ContentNegotiation) {
        json()
    }
}

fun Application.initializeAuthentication(httpClient: HttpClient = applicationHttpClient) {
    val issuer = AppConfig.oAuth.getIssuer()
    val clientId = AppConfig.oAuth.clientId
    val jwksUri = AppConfig.oAuth.getJwksUrl()

    val jwkProvider = JwkProviderBuilder(URI(jwksUri).toURL())
        .cached(10, 24, TimeUnit.HOURS)
        .rateLimited(10, 1, TimeUnit.MINUTES)
        .build()

    install(Authentication) {
        jwt("auth-jwt") {
            verifier(jwkProvider, issuer) {
                withIssuer(issuer)
                acceptLeeway(3)
                withAudience(clientId)
            }
            validate { jwtCredential ->
                if (jwtCredential.audience.contains(clientId)) JWTPrincipal(jwtCredential.payload) else null
            }
            challenge { _, _ ->
                call.respond(HttpStatusCode.Unauthorized, "You are unauthenticated")
            }
        }
    }
}

suspend fun getGroupsOrEmptyList(call: ApplicationCall): List<MicrosoftGraphGroup> {
    val microsoftService = MicrosoftService()
    val jwtToken = call.request.headers["Authorization"]?.removePrefix("Bearer ")
        ?: throw IllegalStateException("Authorization header missing")
    val oboToken = microsoftService.requestTokenOnBehalfOf(jwtToken)

    return microsoftService.fetchGroups(oboToken)
}

suspend fun getCurrentUser(call: ApplicationCall): MicrosoftGraphUser {
    val microsoftService = MicrosoftService()

    val jwtToken = call.request.headers["Authorization"]?.removePrefix("Bearer ")
        ?: throw IllegalStateException("Authorization header missing")
    val oboToken = microsoftService.requestTokenOnBehalfOf(jwtToken)

    return microsoftService.fetchCurrentUser(oboToken)
}

suspend fun hasTeamAccess(call: ApplicationCall, teamId: String?): Boolean {
    if (teamId == null || teamId == "") return false

    val groups = getGroupsOrEmptyList(call)
    if (groups.isEmpty()) return false

    return teamId in groups.map { it.id }
}

suspend fun hasContextAccess(call: ApplicationCall, contextId: String,): Boolean {
    val contextRepository = ContextRepository()
    val context = contextRepository.getContext(contextId)
    return hasTeamAccess(call, context.teamId)
}

data class UserSession(val state: String, val token: String)
