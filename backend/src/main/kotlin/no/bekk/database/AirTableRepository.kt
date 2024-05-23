package no.bekk.database

import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.Table

class AirTableRepository {
    fun connectToDatabase() {
        Database.connect(
            url = "jdbc:postgresql://localhost:5432/kontrollere",
            driver = "org.postgresql.Driver",
            user = "username",
            password = "password"
        )
    }

    object Users : Table() {
        val id = integer("id").autoIncrement()
        val name = varchar("name", length = 50)
        val email = varchar("email", length = 100)

        override val primaryKey = PrimaryKey(id)
    }
}