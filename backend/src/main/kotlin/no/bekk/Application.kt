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
    val dbHost = System.getenv("DB_HOST") ?: environment.config.property("ktor.database.host").getString()
    val dbPort = System.getenv("DB_PORT") ?: environment.config.property("ktor.database.port").getString()
    val dbName = System.getenv("DB_NAME") ?: environment.config.property("ktor.database.name").getString()
    val dbUser = System.getenv("DB_USER") ?: environment.config.property("ktor.database.user").getString()
    val dbPassword = System.getenv("DB_PASSWORD") ?: environment.config.property("ktor.database.password").getString()

    val dbUrl = "jdbc:postgresql://$dbHost:$dbPort/$dbName"

    val flyway = Flyway.configure()
        .dataSource(
            dbUrl, dbUser, dbPassword
        )
        .locations("filesystem:src/main/resources/db/migration")
        .load()
    flyway.migrate()
}