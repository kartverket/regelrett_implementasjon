package no.bekk.database

import kotlinx.serialization.Serializable

@Serializable
data class DatabaseComment(
    val actor: String,
    val questionId: String,
    val comment: String,
    val team: String?,
    val updated: String
)
