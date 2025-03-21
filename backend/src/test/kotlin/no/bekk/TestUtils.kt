package no.bekk

import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.*
import no.bekk.configuration.Database
import no.bekk.configuration.OAuthConfig
import no.bekk.database.*
import no.bekk.plugins.configureRouting
import no.bekk.services.FormService
import no.bekk.services.MicrosoftService

object TestUtils {
    fun Application.testModule(
        testDatabase: Database = object : MockDatabase {},
        microsoftService: MicrosoftService = object : MockMicrosoftService {},
        formService: FormService = object : MockFormService {},
        answerRepository: AnswerRepository = AnswerRepositoryImpl(testDatabase),
        commentRepository: CommentRepository = CommentRepositoryImpl(testDatabase),
        contextRepository: ContextRepository = ContextRepositoryImpl(testDatabase),
        oAuthConfig: OAuthConfig = OAuthConfig(
            baseUrl = "https://test.com",
            tenantId = "test-tenant",
            issuerPath = "/test",
            authPath = "/testAuth",
            tokenPath = "/testToken",
            jwksPath = "/testJwks",
            clientId = "test-client",
            clientSecret = "test-secret",
            providerUrl = "https://test",
            superUserGroup = "test-group"
        )
    ) {

        install(Authentication) {
            jwt("auth-jwt") {
                realm = "test"
                verifier(
                    JWT
                        .require(Algorithm.HMAC256("test-secret"))
                        .withAudience("test-audience")
                        .withIssuer("test-issuer")
                        .build()
                )
                validate { credentials -> JWTPrincipal(credentials.payload) }
            }
        }

        configureRouting(oAuthConfig, formService, microsoftService, testDatabase, answerRepository, commentRepository, contextRepository)
    }

    fun generateTestToken(): String {
        return JWT.create()
            .withAudience("test-audience")
            .withIssuer("test-issuer")
            .withClaim("oid", "test-user-id")
            .sign(Algorithm.HMAC256("test-secret"))
    }
}