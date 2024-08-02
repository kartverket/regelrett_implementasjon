package no.bekk.configuration
import java.sql.Connection
import java.sql.DriverManager
import com.typesafe.config.ConfigFactory

fun getDatabaseConnection(): Connection {
    val dbName = getEnvVariableOrConfig("DB_NAME", "ktor.database.name")
    val dbUser = getEnvVariableOrConfig("DB_USER", "ktor.database.user")
    val dbPassword = getEnvVariableOrConfig("DB_PASSWORD", "ktor.database.password")

    val databaseUrl = "jdbc:postgresql://localhost:5432/$dbName?currentSchema=regelrett"

    return DriverManager.getConnection(databaseUrl, dbUser, dbPassword)
}

fun getEnvVariableOrConfig(envVar: String, configPath: String): String {
    val config = ConfigFactory.load()
    return System.getenv(envVar)
        ?: if (config.hasPath(configPath)) config.getString(configPath)
        else throw IllegalArgumentException("$envVar or $configPath must be provided")
}