package no.bekk

import no.bekk.plugins.*
import io.ktor.server.application.*
import no.bekk.database.DatabaseRepository
import java.io.FileInputStream
import java.util.*

fun loadConfig(filePath: String): Properties {
    val props = Properties()
    FileInputStream(filePath).use { props.load(it) }
    return props
}

// Usage
val props = loadConfig("config.properties")
val accessToken = props.getProperty("accessToken")

val repository = DatabaseRepository()
fun main(args: Array<String>) {
    io.ktor.server.netty.EngineMain.main(args)
}


fun Application.module() {
    configureRouting()
    configureCors()
    // repository.connectToDatabase()
}


