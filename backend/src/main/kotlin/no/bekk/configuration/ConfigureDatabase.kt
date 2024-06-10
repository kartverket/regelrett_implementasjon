package no.bekk.configuration

import com.typesafe.config.ConfigFactory
import java.sql.Connection
import java.sql.DriverManager

fun getDatabaseConnection(): Connection {
    /*val config = ConfigFactory.load()
    val databaseConfig = config.getConfig("ktor.database")

    val databaseUrl = databaseConfig.getString("url")
    val databaseUser = databaseConfig.getString("user")
    val databasePassword = databaseConfig.getString("password")

    val url = databaseUrl
    val user = databaseUser
    val password = databasePassword*/

    //val dockerHost = System.getenv("HOST")

    val dbHost = System.getenv("DB_HOST") ?: "localhost"
    val dbPort = System.getenv("DB_PORT") ?: "5432"
    val dbName = System.getenv("DB_NAME") ?: "your_db_name"
    val dbUser = System.getenv("DB_USER") ?: "your_db_user"
    val dbPassword = System.getenv("DB_PASSWORD") ?: "your_db_password"

    val databaseUrl = "jdbc:postgresql://$dbHost:$dbPort/$dbName"


    return DriverManager.getConnection(databaseUrl, dbUser, dbPassword)
}