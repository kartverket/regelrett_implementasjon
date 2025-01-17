package no.bekk.database

import kotlinx.serialization.Serializable

@Serializable
data class DatabaseContext(
    val id: String,
    val teamId: String,
    val formId: String,
    val name: String,
)

@Serializable
data class DatabaseContextRequest(
    val teamId: String,
    val formId: String,
    val name: String,
    val copyContext: String? = null,
)