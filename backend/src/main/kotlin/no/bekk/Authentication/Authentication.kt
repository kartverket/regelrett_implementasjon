package no.bekk.Authentication

import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.sessions.*

var KV_TENANT_ID: String = "test"
var CLIENT_ID: String = "test"
var CLIENT_SECRET: String = "test"

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
                    name = "azure",
                    authorizeUrl = "https://login.microsoftonline.com/$KV_TENANT_ID/oauth2/v2.0/authorize?",
                    accessTokenUrl = "https://login.microsoftonline.com/$KV_TENANT_ID/oauth2/v2.0/token",
                    requestMethod = HttpMethod.Post,
                    clientId = CLIENT_ID,
                    clientSecret = CLIENT_SECRET,
                )
            }
            client = httpClient
        }
    }
}

data class UserSession(val state: String, val token: String)
