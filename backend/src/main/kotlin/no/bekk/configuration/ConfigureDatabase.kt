package no.bekk.configuration

import com.typesafe.config.ConfigFactory
import java.sql.Connection
import java.sql.DriverManager

fun getDatabaseConnection(): Connection {
    val config = ConfigFactory.load()
    val databaseConfig = config.getConfig("ktor.database")

    val databaseUrl = databaseConfig.getString("url")
    val databaseUser = databaseConfig.getString("user")
    val databasePassword = databaseConfig.getString("password")

    val url = databaseUrl
    val user = databaseUser
    val password = databasePassword
    return DriverManager.getConnection(url, user, password)
}
