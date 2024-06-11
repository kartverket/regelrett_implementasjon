package no.bekk.configuration

import java.sql.Connection
import java.sql.DriverManager

fun getDatabaseConnection(): Connection {

    val dbHost = System.getenv("DB_HOST") ?: "localhost"
    val dbPort = System.getenv("DB_PORT") ?: "5432"
    val dbName = System.getenv("DB_NAME") ?: "kontrollere"
    val dbUser = System.getenv("DB_USER") ?: "insert_name_here_when_running_locally"
    val dbPassword = System.getenv("DB_PASSWORD") ?: "your_db_password"

    val databaseUrl = "jdbc:postgresql://$dbHost:$dbPort/$dbName"

    return DriverManager.getConnection(databaseUrl, dbUser, dbPassword)
}