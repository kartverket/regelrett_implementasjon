package no.bekk

import no.bekk.plugins.*
import io.ktor.server.application.*
import no.bekk.database.AirTableRepository

val repository = AirTableRepository()
fun main(args: Array<String>) {
    io.ktor.server.netty.EngineMain.main(args)
}


fun Application.module() {
    configureRouting()
    configureCors()
    // repository.connectToDatabase()
}


