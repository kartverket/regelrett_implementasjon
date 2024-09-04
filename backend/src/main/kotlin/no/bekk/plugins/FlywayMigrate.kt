package no.bekk.plugins

import no.bekk.configuration.AppConfig
import org.flywaydb.core.Flyway

fun runFlywayMigration() {
    val flyway = Flyway.configure()
        .dataSource(
            AppConfig.db.url,
            AppConfig.db.username,
            AppConfig.db.password
        )
        .load()
    flyway.migrate()
}
