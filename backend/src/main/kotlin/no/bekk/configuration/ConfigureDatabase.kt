package no.bekk.configuration
import java.sql.Connection
import java.sql.DriverManager
import com.typesafe.config.ConfigFactory

fun getDatabaseConnection(): Connection {
    val config = ConfigFactory.load()
    val databaseConfig = config.getConfig("ktor.database")
    val dbName = System.getenv("DB_NAME") ?: databaseConfig.getString("name")
    val dbUser = System.getenv("DB_USER") ?: databaseConfig.getString("user")
    val dbPassword = System.getenv("DB_PASSWORD") ?: databaseConfig.getString("password")

    val databaseUrl = "jdbc:postgresql://localhost:5432/$dbName?currentSchema=regelrett"

    return DriverManager.getConnection(databaseUrl, dbUser, dbPassword)
}