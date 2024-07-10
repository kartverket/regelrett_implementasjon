package no.bekk.model.internal

import kotlinx.serialization.Serializable

@Serializable
data class Question(
    val id: String,
    val columns: List<Column>,
    val updated: String,
    val answer: Answer?,
    val comment: Comment?,
)
