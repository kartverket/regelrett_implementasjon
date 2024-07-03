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

val airtableAccessToken = System.getenv("AIRTABLE_ACCESS_TOKEN")
val applicationProperties = loadConfig("application.properties")
val metadataAddress = applicationProperties.getProperty("metadataAddress")
val metodeverkAddress = applicationProperties.getProperty("metodeverkAddress")
val alleAddress = applicationProperties.getProperty("alleAddress")

fun main(args: Array<String>) {
    io.ktor.server.netty.EngineMain.main(args)
}

fun Application.module() {
    configureRouting()
    configureCors()
    runFlywayMigration()
}
