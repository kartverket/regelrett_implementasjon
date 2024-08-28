package no.bekk.plugins

import io.ktor.server.application.*
import no.bekk.configuration.getEnvVariableOrConfig
import org.flywaydb.core.Flyway

fun Application.runFlywayMigration() {
    val dbUser = getEnvVariableOrConfig("DB_USER", "ktor.database.user")
    val dbPassword = getEnvVariableOrConfig("DB_PASSWORD", "ktor.database.password")

    val dbUrl = "jdbc:postgresql://localhost:5432/regelrett"

    val flyway = Flyway.configure()
        .createSchemas(true)
        .defaultSchema("regelrett")
        .dataSource(
            dbUrl, dbUser, dbPassword
        )
        .locations("filesystem:src/main/resources/db/migration")
        .load()
    flyway.migrate()
}