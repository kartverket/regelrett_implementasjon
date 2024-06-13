package no.bekk

import no.bekk.plugins.*
import io.ktor.server.application.*
import org.flywaydb.core.Flyway
import java.io.FileInputStream
import java.util.*

fun loadConfig(filePath: String): Properties {
    val props = Properties()
    FileInputStream(filePath).use { props.load(it) }
    return props
}

val props = loadConfig("config.properties")
val accessToken = props.getProperty("accessToken")

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

fun Application.runFlywayMigration() {
    val dbUrl = environment.config.property("ktor.database.url").getString()
    val dbUser = environment.config.property("ktor.database.user").getString()
    val dbPassword = environment.config.property("ktor.database.password").getString()

    val flyway = Flyway.configure()
        .dataSource(
            dbUrl, dbUser, dbPassword
        )
        .locations("filesystem:src/main/resources/db/migration")
        .load()
    flyway.migrate()
}