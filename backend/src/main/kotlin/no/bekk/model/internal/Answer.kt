package no.bekk.model.internal

import kotlinx.serialization.Serializable

@Serializable
data class Answer(
    val actor: String,
    val questionId: String,
    val answer: String,
    val team: String?,
    val updated: String,
)
