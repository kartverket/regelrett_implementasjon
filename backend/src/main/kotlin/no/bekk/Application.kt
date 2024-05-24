package no.bekk

import com.typesafe.config.ConfigFactory
import io.ktor.http.*
import no.bekk.plugins.*
import io.ktor.server.application.*
import io.ktor.server.plugins.cors.routing.*
import no.bekk.database.AirTableRepository

val repository = AirTableRepository()
fun main(args: Array<String>) {
    io.ktor.server.netty.EngineMain.main(args)
}

fun Application.configureCors() {
    install(CORS) {
        allowHost("localhost:3000") // Allow requests from client-host [For development]
        allowHeader(HttpHeaders.ContentType)
    }
}

fun Application.module() {
    configureRouting()
    configureCors()
    // repository.connectToDatabase()
}


