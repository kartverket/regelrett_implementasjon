package no.bekk.authentication

import com.auth0.jwk.JwkProviderBuilder
import io.ktor.http.*
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

fun Application.initializeAuthentication(config: AppConfig) {
    val issuer = getIssuer(config)
    val clientId = config.oAuth.clientId
    val jwksUri = getJwksUrl(config)

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

suspend fun getGroupsOrEmptyList(call: ApplicationCall, microsoftService: MicrosoftService): List<MicrosoftGraphGroup> {
    val jwtToken = call.request.headers["Authorization"]?.removePrefix("Bearer ")
        ?: throw IllegalStateException("Authorization header missing")
    val oboToken = microsoftService.requestTokenOnBehalfOf(jwtToken)

    return microsoftService.fetchGroups(oboToken)
}

suspend fun getCurrentUser(call: ApplicationCall, microsoftService: MicrosoftService): MicrosoftGraphUser {
    val jwtToken = call.request.headers["Authorization"]?.removePrefix("Bearer ")
        ?: throw IllegalStateException("Authorization header missing")

    val oboToken = microsoftService.requestTokenOnBehalfOf(jwtToken)

    return microsoftService.fetchCurrentUser(oboToken)
}

suspend fun getUserByUserId(call: ApplicationCall, userId: String, microsoftService: MicrosoftService): MicrosoftGraphUser {
    val jwtToken = call.request.headers["Authorization"]?.removePrefix("Bearer ")
    ?: throw IllegalStateException("Authorization header missing")

    val oboToken = microsoftService.requestTokenOnBehalfOf(jwtToken)

    return microsoftService.fetchUserByUserId(oboToken, userId)
}

suspend fun hasTeamAccess(call: ApplicationCall, microsoftService: MicrosoftService, teamId: String?): Boolean {
    if (teamId == null || teamId == "") return false

    val groups = getGroupsOrEmptyList(call, microsoftService)
    if (groups.isEmpty()) return false

    return teamId in groups.map { it.id }
}

suspend fun hasContextAccess(call: ApplicationCall, contextId: String, microsoftService: MicrosoftService): Boolean {
    val context = ContextRepository.getContext(contextId)
    return hasTeamAccess(call, microsoftService, context.teamId)
}

suspend fun hasSuperUserAccess(call: ApplicationCall, config: AppConfig, microsoftService: MicrosoftService): Boolean {
    return hasTeamAccess(call, microsoftService, config.oAuth.superUserGroup)
}

suspend fun getTeamIdFromName(call: ApplicationCall, teamName: String, microsoftService: MicrosoftService): String? {
    val microsoftGroups = getGroupsOrEmptyList(call, microsoftService)

    return microsoftGroups.find { it.displayName == teamName }?.id
}

