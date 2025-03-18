package no.bekk.configuration

import com.zaxxer.hikari.HikariConfig
import com.zaxxer.hikari.HikariDataSource

object Database {
    private lateinit var dataSource: HikariDataSource

    fun initDatabase(config: AppConfig) {
        val hikariConfig = HikariConfig()
        hikariConfig.apply {
            schema = "regelrett"
            jdbcUrl = config.db.url
            username = config.db.username
            password = config.db.password
            driverClassName = "org.postgresql.Driver"
        }
        dataSource = HikariDataSource(hikariConfig)
    }

    fun getConnection() = dataSource.connection

    fun closePool() {
        dataSource.close()
    }
}
