package no.bekk.plugins

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.plugins.cors.routing.*

fun Application.configureCors() {
    install(CORS) {
        allowHost("localhost:3000") // Allow requests from client-host [For development]
        allowHeader(HttpHeaders.ContentType)
        allowHost("localhost:8080")
        allowHost("login.microsoftonline.com")
        allowHeader(HttpHeaders.AccessControlAllowOrigin)
        allowMethod(HttpMethod.Get)
    }
}