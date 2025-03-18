package no.bekk.plugins

import no.bekk.configuration.AppConfig
import org.flywaydb.core.Flyway

fun runFlywayMigration(config: AppConfig) {
    val flyway = Flyway.configure()
        .createSchemas(true)
        .defaultSchema("regelrett")
        .dataSource(
            config.db.url,
            config.db.username,
            config.db.password
        )
        .validateMigrationNaming(true)
        .load()
    flyway.migrate()
}
