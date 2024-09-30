package no.bekk.database

import kotlinx.serialization.Serializable

@Serializable
data class DatabaseAnswer(
    val actor: String,
    val questionId: String,
    val question: String,
    val answer: String? = null,
    val updated: String,
    val team: String?
)
