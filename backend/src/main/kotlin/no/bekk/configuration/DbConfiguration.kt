package no.bekk.configuration

import com.zaxxer.hikari.HikariConfig
import com.zaxxer.hikari.HikariDataSource

object Database {
    private lateinit var dataSource: HikariDataSource

    fun initDatabase() {
        val hikariConfig = HikariConfig()
        hikariConfig.apply {
            schema = "regelrett"
            jdbcUrl = AppConfig.db.url
            username = AppConfig.db.username
            password = AppConfig.db.password
            driverClassName = "org.postgresql.Driver"
        }
        dataSource = HikariDataSource(hikariConfig)
    }

    fun getConnection() = dataSource.connection

    fun closePool() {
        dataSource.close()
    }
}
