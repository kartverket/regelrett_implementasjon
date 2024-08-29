package no.bekk.configuration

import java.sql.Connection
import java.sql.DriverManager

fun getDatabaseConnection(): Connection {
    val dbConfig = AppConfig.db
    val connection = DriverManager.getConnection(
        dbConfig.url,
        dbConfig.username,
        dbConfig.password
    )
    connection.schema = "regelrett"
    return connection
}