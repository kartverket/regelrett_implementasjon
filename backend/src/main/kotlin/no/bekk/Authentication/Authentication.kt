package no.bekk.Authentication

import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.sessions.*


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
    install(Authentication) {
            oauth("auth-oauth-azure") {
                urlProvider = { "http://localhost:8080/callback" }
                providerLookup = {
                    OAuthServerSettings.OAuth2ServerSettings(
                        name = "auth0",
                        authorizeUrl = "https://dev-yveq13bhfjkp7ujy.eu.auth0.com/authorize",
                        accessTokenUrl = "https://dev-yveq13bhfjkp7ujy.eu.auth0.com/oauth/token",
                        requestMethod = HttpMethod.Post,
                        clientId = System.getenv("CLIENT_ID"),
                        clientSecret = System.getenv("CLIENT_SECRET"),
                        defaultScopes = listOf("openid"),
                        onStateCreated = { call, state ->
                            call.request.queryParameters["redirectUrl"]?.let {
                                val redirects = mutableMapOf<String, String>()
                                redirects[state] = it
                            }
                        }
                    )
                }
            client = httpClient
        }
    }
}

data class UserSession(val state: String, val token: String)
