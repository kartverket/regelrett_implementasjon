package no.bekk.authentication

import com.auth0.jwk.JwkProviderBuilder
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.*
import io.ktor.server.response.*
import no.bekk.configuration.OAuthConfig
import no.bekk.configuration.getIssuer
import no.bekk.configuration.getJwksUrl
import java.net.URI
import java.util.concurrent.TimeUnit

fun Application.initializeAuthentication(oAuthConfig: OAuthConfig) {
    val issuer = getIssuer(oAuthConfig)
    val clientId = oAuthConfig.clientId
    val jwksUri = getJwksUrl(oAuthConfig)

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

