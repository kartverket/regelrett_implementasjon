package no.bekk

import no.bekk.plugins.*
import io.ktor.server.application.*
import no.bekk.database.SLARepository

val repository = SLARepository()
fun main(args: Array<String>) {
    io.ktor.server.netty.EngineMain.main(args)

}

fun Application.module() {
    configureRouting()
   // repository.connectToDatabase()
}


