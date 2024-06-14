package no.bekk.configuration
import java.sql.Connection
import java.sql.DriverManager
import com.typesafe.config.ConfigFactory

fun getDatabaseConnection(): Connection {
    val config = ConfigFactory.load()
    val databaseConfig = config.getConfig("ktor.database")
    val dbHost = System.getenv("DB_HOST") ?: databaseConfig.getString("host")
    val dbPort = System.getenv("DB_PORT") ?: databaseConfig.getString("port")
    val dbName = System.getenv("DB_NAME") ?: databaseConfig.getString("name")
    val dbUser = System.getenv("DB_USER") ?: databaseConfig.getString("user")
    val dbPassword = System.getenv("DB_PASSWORD") ?: databaseConfig.getString("password")

    val databaseUrl = "jdbc:postgresql://$dbHost:$dbPort/$dbName"

    return DriverManager.getConnection(databaseUrl, dbUser, dbPassword)
}