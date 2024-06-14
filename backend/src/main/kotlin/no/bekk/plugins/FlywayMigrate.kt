package no.bekk.plugins

import io.ktor.server.application.*
import org.flywaydb.core.Flyway

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