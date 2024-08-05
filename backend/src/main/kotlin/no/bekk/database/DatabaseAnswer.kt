package no.bekk.database

import kotlinx.serialization.Serializable

@Serializable
data class DatabaseAnswer(
    val actor: String,
    val questionId: String,
    val question: String,
    val Svar: String? = null,
    val updated: String,
    val team: String?
)
