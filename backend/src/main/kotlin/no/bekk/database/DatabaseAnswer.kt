package no.bekk.database

import kotlinx.serialization.Serializable

@Serializable
data class DatabaseAnswer(
    val actor: String,
    val recordId: String,
    val questionId: String,
    val question: String,
    val answer: String? = null,
    val updated: String,
    val team: String?,
    val answerType: String,
    val answerUnit: String? = null,
)
