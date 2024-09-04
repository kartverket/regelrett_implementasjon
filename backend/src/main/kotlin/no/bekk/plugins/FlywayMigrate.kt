package no.bekk.plugins

import no.bekk.configuration.AppConfig
import org.flywaydb.core.Flyway

fun runFlywayMigration() {
    val flyway = Flyway.configure()
        .createSchemas(true)
        .defaultSchema("regelrett")
        .dataSource(
            AppConfig.db.url,
            AppConfig.db.username,
            AppConfig.db.password
        )
        .locations("filesystem:src/main/resources/db/migration")
        .load()
    flyway.migrate()
}
