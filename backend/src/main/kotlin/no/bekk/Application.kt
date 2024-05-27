package no.bekk

import no.bekk.plugins.*
import io.ktor.server.application.*
import no.bekk.database.DatabaseRepository

val repository = DatabaseRepository()
fun main(args: Array<String>) {
    io.ktor.server.netty.EngineMain.main(args)
}


fun Application.module() {
    configureRouting()
    configureCors()
    // repository.connectToDatabase()
}


