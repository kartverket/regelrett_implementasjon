package no.bekk

import no.bekk.plugins.*
import io.ktor.server.application.*
import java.io.FileInputStream
import java.util.*

fun loadConfig(filePath: String): Properties {
    val props = Properties()
    FileInputStream(filePath).use { props.load(it) }
    return props
}

val props = loadConfig("config.properties")
val accessToken = props.getProperty("accessToken")

fun main(args: Array<String>) {
    io.ktor.server.netty.EngineMain.main(args)
}

fun Application.module() {
    configureRouting()
    configureCors()
}


