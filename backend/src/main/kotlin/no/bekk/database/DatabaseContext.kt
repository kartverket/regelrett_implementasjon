package no.bekk.database

import kotlinx.serialization.Serializable

@Serializable
data class DatabaseContext(
    val id: String,
    val teamId: String,
    val name: String? = null,
)

@Serializable
data class DatabaseContextRequest(
    val teamId: String,
    val name: String? = null,
)