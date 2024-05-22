package no.bekk

import no.bekk.plugins.*
import io.ktor.server.application.*
import io.ktor.server.plugins.cors.routing.*
import no.bekk.database.SLARepository

val repository = SLARepository()
fun main(args: Array<String>) {
    io.ktor.server.netty.EngineMain.main(args)
}

fun Application.configureCors() {
    install(CORS) {
        allowHost("localhost:3000") // Allow requests from client-host [For development]
    }
}

fun Application.module() {
    configureRouting()
    configureCors()
    // repository.connectToDatabase()
}


