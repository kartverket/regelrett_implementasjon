package no.bekk.configuration
import java.sql.Connection
import java.sql.DriverManager
import com.typesafe.config.ConfigFactory

fun getDatabaseConnection(): Connection {
    val dbConfig = AppConfig.db
    return DriverManager.getConnection(
        dbConfig.url,
        dbConfig.username,
        dbConfig.password
    )
}